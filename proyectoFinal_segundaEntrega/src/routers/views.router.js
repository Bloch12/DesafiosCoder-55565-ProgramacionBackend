import { Router } from "express";
import { productModel } from "../dao/models/product.model.js";
import { cartModel } from "../dao/models/cart.model.js";
import mongoose from "mongoose";
export const router = Router();

router.get("/home", async(req,res) => {
    res.setHeader("Content-Type","text/html");
    const products = await productModel.find();
    const productPlain = products.map(product => product.toObject());
    res.status(200).render("home",{title: "Lista de productos",products: productPlain});
});

router.get('/realtimeproducts', async(req,res) => {
    res.setHeader("Content-Type","text/html");
    const products = await productModel.find();
    const productPlain = products.map(product => product.toObject());
    res.status(200).render("realtimeproducts", {
        title: "Productos en tiempo real",
        products: productPlain
    });
});

router.get("/products",async(req,res) => {
    res.setHeader("Content-Type","text/html");
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

    const baseUrl = "/products";
    const prevLink = hasPrevPage ? `${baseUrl}?limit=${limit}&page=${prevPage}${sort?`&sort=${sort}`:""}${query?`&query=${query}`:""}` : null;
    const nextLink = hasNextPage ? `${baseUrl}?limit=${limit}&page=${nextPage}${sort?`&sort=${sort}`:""}${query?`&query=${query}`:""}` : null;
    const firstLink = `${baseUrl}?limit=${limit}${sort?`&sort=${sort}`:""}${query?`&query=${query}`:""}`;
    const lastLink = `${baseUrl}?limit=${limit}&page=${totalPages}${sort?`&sort=${sort}`:""}${query?`&query=${query}`:""}`;
    
    res.status(200).render("products",{
        title: "Products",
        products: resultado.docs,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage: prevLink,
        nextPage: nextLink,
        firstPage: firstLink,
        lastPage: lastLink,
        limit: limit,
        page
    });

});

router.get("/products/:pid",async(req,res) => {
    res.setHeader("Content-Type","text/html");
    let {pid} = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(pid))
            return res.status(400).json({error:"Error - Invalid product id format"});
        const product = await productModel.findById(pid);
        if(!product)
            return res.status(400).json({error:"Error - Product id not found"});
        let{title,description,price,category,stock,code} = product;
        res.status(200).render("product",{
            title,
            description,
            price,
            category,
            stock,
            code,
            id: pid
        });
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message});
    }
});

router.get("/carts/:cid",async(req,res) => {
    res.setHeader("Content-Type","text/html");
    let {cid} = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(cid))
            return res.status(400).json({error:"Error - Invalid cart id format"});
        const cart = await cartModel.findOne({_id: cid}).populate("products.product_id");
        if(!cart)
            return res.status(400).json({error:"Error - Cart id not found"});
        let products = [];
        cart.products.forEach(prod => {
            products.push({
                _id: prod.product_id._id,
                title: prod.product_id.title,
                description: prod.product_id.description,
                price: prod.product_id.price,
                category: prod.product_id.category,
                stock: prod.product_id.stock,
                code: prod.product_id.code,
                quantity: prod.quantity,
                subtotal: prod.subtotal
            });
        });
        res.status(200).render("cart",{title: "Lista de productos",products});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message})
    }
});


