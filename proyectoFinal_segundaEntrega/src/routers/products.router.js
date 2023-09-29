import Router from "express";
import { productModel } from "../dao/models/product.model.js";
import mongoose from "mongoose";
import {io} from "../app.js";
import { cartModel } from "../dao/models/cart.model.js";
export const router = Router();

let validateProps = (body, ...validator) => {
    let newProductProps = Object.keys(body);
    for (const toValidateProp of validator) {
        if (!newProductProps.includes(toValidateProp))
            return false;
    };
    return true;
}


router.get("/",async(req,res) => {
    res.setHeader("Content-Type","application/json");
    let {limit,page,query,sort} = req.query;
    
    limit = parseInt(limit) || 10;
    if(isNaN(limit) || limit < 1)
        return res.status(400).json({error:"Error - Invalid limit format"});
    page = parseInt(page) || 1;
    if(isNaN(page) || page < 1)
        return res.status(400).json({error:"Error - Invalid page format"});
    if(sort && sort !== "asc" && sort !== "desc")
        return res.status(400).json({error:"Error - Invalid sort format"});
    const sortObj = sort? {price: sort} : {};
    let queryObj = {};
    if(query)
        queryObj = query === "available"? {status: true} : {category: query};
    let resultado;
    try{
        resultado = await productModel.paginate(queryObj,{limit,lean: true,page,sortObj});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message});
    }
    
    let {
        totalPages,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
    } = resultado;

    const baseUrl = req.protocol + "://" + req.get("host") + req.baseUrl;
    const prevLink = hasPrevPage ? `${baseUrl}?limit=${limit}&page=${prevPage}${sort?`&sort=${sort}`:""}${query?`&query=${query}`:""}` : null;
    const nextLink = hasNextPage ? `${baseUrl}?limit=${limit}&page=${nextPage}${sort?`&sort=${sort}`:""}${query?`&query=${query}`:""}` : null;
    
    res.status(200).json({
        status: "success",
        payload: resultado.docs,
        totalPages,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
    });
});

router.get("/:pid",async(req,res) => {
    res.setHeader("Content-Type","application/json");
    let {pid} = req.params;
    
    try{
        if(!mongoose.Types.ObjectId.isValid(pid))
            return res.status(400).json({error:"Error - Invalid product id format"});
        const product = await productModel.findById(pid);
        if(!product)
            return res.status(400).json({error:"Error - Product id not found"});
        res.status(200).json({status: "succes",product});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message});
    }
});

router.post("/",async(req,res) => {
    res.setHeader("Content-Type","application/json");
    const product = req.body;
    if(!validateProps(product,"title","description","price","status","code","stock","category")){
        return res.status(400).json({error: "missing parameters"});
    }
    try {
        let existCode = await productModel.findOne({code: product.code});
        if(existCode)
            return res.status(400).json({error: "Error - Product code already exists"});
        let resultado = await productModel.create(product);
        io.emit('products-update', {products: await productModel.find(), msg: `Product with id ${resultado._id} created.`});
        res.status(201).json({status: "success", msg: `Product created: ${resultado}`});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message});
    }
});

router.put("/:pid",async(req,res) => {
    res.setHeader("Content-Type", "application/json");
    let {pid} = req.params;
    let product = req.body;
    let validator = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
    try{
        if (!mongoose.Types.ObjectId.isValid(pid))    
		return res.status(400).json({error:"Error - Invalid id"});

        let updatedProduct = await productModel.findById(pid);
        if (!updatedProduct)
            return res.status(404).json({status: 'error', msg: 'Error - Product not found'});

        for (const toValidateProp of Object.keys(product)) {
            if (!validator.includes(toValidateProp))
                return res.status(400).json({status: 'error', msg: `Error - Invalid property: ${toValidateProp}`});
        }

        let codeProduct = await productModel.findOne({code: product.code});
        if (codeProduct)
            return res.status(400).json({status: 'error', msg: `Error - Product code ${product.code} already exists`});


        if (product.price) {
            product.price = parseFloat(product.price);
            if (isNaN(product.price))
                return res.status(400).json({status: 'error', msg: `Error - Invalid price: ${product.price}`});
        }

        if (product.status)
            product.status = !!product.status;

        if (product.stock) {
            product.stock = parseInt(product.stock);
            if (isNaN(product.stock))
                return res.status(400).json({status: 'error', msg: `Error - Invalid stock: ${product.stock}`});
        }

        Object.entries(product).forEach(([key, value]) => {
            updatedProduct[key] = value;
        });

        let resultado = await productModel.findByIdAndUpdate(pid, updatedProduct);
        io.emit('products-update', {products: await productModel.find(), msg: `Product with id ${pid} updated.`});
        res.status(200).json({status: 'ok', msg: `Product with id ${pid} updated successfully: ${resultado}`});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message});
    }
});

router.delete("/:pid",async(req,res) => {
    let {pid} = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(pid))
            return res.status(400).json({error:"Error - Invalid product id format"});
        let exist=await productModel.findById(pid);
        if(!exist)
            return res.status(400).json({error:"Error - Product id not found"});
        let resultado = await productModel.deleteOne({_id: pid});
        io.emit('products-update', {products: await productModel.find(), msg: `Product with id ${pid} deleted.`});
        res.status(200).json({status: "success", msg: `Product deleted: ${resultado}`});

    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message});
    }
});