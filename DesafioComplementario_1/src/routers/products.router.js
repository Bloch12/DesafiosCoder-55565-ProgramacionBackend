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
    let limit = req.query.limit;
    try{
        const products = await productModel.find();
        if(!limit)
            res.status(200).json({status: "success", products});
        else{
            if(isNaN(limit) || limit < 0){
                return res.status(400).json({error: "the limit must be a no negative number"});
            }
            res.status(200).json({status: "success", products: products.slice(0,limit)});
        } 
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message});
    }
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