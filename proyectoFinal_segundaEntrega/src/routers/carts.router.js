import { Router } from "express";
import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/product.model.js";
import mongoose from "mongoose";
export const router = Router();

router.get("/:cid",async(req,res) => {
    res.setHeader("Content-Type","application/json");
    let {cid} = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(cid))
            return res.status(400).json({error:"Error - Invalid cart id format"});
        const products = await cartModel.findOne({_id: cid}).populate("products.product_id");
        if(!products)
            return res.status(400).json({error:"Error - Cart id not found"});
        res.status(200).json({status: "succes",products});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message})
    }
});

router.post("/",async(req,res) => {
    res.setHeader("Content-Type","application/json");
    let {products} = req.body;
    if(!products)
        return res.status(400).json({status: "error", msg: "missing parameters"});
    try {
        for (const product of products) {
            if (!product.product_id || !product.quantity)
                return res.status(400).json({status: 'error', msg: 'Error - All products must have an id and a quantity'})
                
            if (!mongoose.Types.ObjectId.isValid(product.product_id))
                return res.status(400).json({error:"Error - Invalid product id format"});
    
            let productExists = await productModel.findById(product.product_id);
    
            if (!productExists)
                return res.status(400).json({error:"Error - Product id not found"});
    
            let price = (await productModel.findById(product.product_id)).price;
            product.subtotal = price * product.quantity;
        }
        const car = {
            products
        }
        let resultado = await cartModel.create(car);
        res.status(201).json({status: "success", msg: `Cart created: ${resultado}`});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message})
    }
});

router.post("/:cid/products/:pid",async(req,res) => {
    res.setHeader("Content-Type","application/json");
    let {cid,pid} = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(cid))
            return res.status(400).json({error:"Error - Invalid cart id format"});
        if(!mongoose.Types.ObjectId.isValid(pid))
            return res.status(400).json({error:"Error - Invalid product id format"});
        const product = await productModel.findById(pid);
        if(!product)
            return res.status(400).json({error:"Error - Product id not found"});
        const cart = await cartModel.findById(cid);
        if(!cart)
            return res.status(400).json({error:"Error - Cart id not found"});
        let resultado;
        let exist = await cartModel.findOne({_id: cid, "products.product_id": pid});
        if(exist)
            resultado = await cartModel.updateOne({_id: cid, "products.product_id": pid},{$inc: {"products.$.quantity": 1, "products.$.subtotal": product.price}});
        else
            resultado = await cartModel.updateOne({_id: cid},{$push: {products: {product_id: pid, quantity: 1, subtotal: product.price}}});
        res.status(201).json({status: "success", msg: `Product added to cart: ${resultado}`});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message})  
    }
});

router.delete("/:cid/products/:pid",async(req,res) => {
    res.setHeader("Content-Type","application/json");
    let {cid,pid} = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(cid))
            return res.status(400).json({error:"Error - Invalid cart id format"});
        if(!mongoose.Types.ObjectId.isValid(pid))
            return res.status(400).json({error:"Error - Invalid product id format"});
        const product = await productModel.findById(pid);
        if(!product)
            return res.status(400).json({error:"Error - Product id not found"});
        const cart = await cartModel.findById(cid);
        if(!cart)
            return res.status(400).json({error:"Error - Cart id not found"});
        
        let resultado = await cartModel.updateOne({_id: cid},{$pull: {products: {product_id: pid}}});
        res.status(201).json({status: "success", msg: `Product deleted from cart: ${resultado}`});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message})  
    }
});

router.delete("/:cid",async(req,res) => {
    res.setHeader("Content-Type","application/json");
    let {cid} = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(cid))
            return res.status(400).json({error:"Error - Invalid cart id format"});
        const cart = await cartModel.findById(cid);
        if(!cart)
            return res.status(400).json({error:"Error - Cart id not found"});
        let resultado = await cartModel.updateOne({_id: cid},{$set: {products: []}});
        res.status(201).json({status: "success", msg: `Cart deleted: ${resultado}`});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message})  
    }
});

router.put("/:cid",async(req,res) => {
    res.setHeader("Content-Type","application/json");
    let {cid} = req.params;
    let {products} = req.body;
    if(!products)
        return res.status(400).json({status: "error", msg: "missing parameters"});
    try{
        if(!mongoose.Types.ObjectId.isValid(cid))
            return res.status(400).json({error:"Error - Invalid cart id format"});
        const cart = await cartModel.findById(cid);
        if(!cart)
            return res.status(400).json({error:"Error - Cart id not found"});
        for (const product of products) {
            if (!product.product_id || !product.quantity)
                return res.status(400).json({status: 'error', msg: 'Error - All products must have an id and a quantity'})
                
            if (!mongoose.Types.ObjectId.isValid(product.product_id))
                return res.status(400).json({error:"Error - Invalid product id format"});
    
            let productExists = await productModel.findById(product.product_id);
    
            if (!productExists)
                return res.status(400).json({error:"Error - Product id not found"});
    
            let price = (await productModel.findById(product.product_id)).price;
            product.subtotal = price * product.quantity;
        }
        let resultado = await cartModel.updateOne({_id: cid},{$set: {products: products}});
        res.status(201).json({status: "success", msg: `Cart updated: ${resultado}`});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message})  
    }
});

router.put("/:cid/products/:pid",async(req,res) => {
    res.setHeader("Content-Type","application/json");
    let {cid,pid} = req.params;
    let {quantity} = req.body;
    try{
        if(!mongoose.Types.ObjectId.isValid(cid))
            return res.status(400).json({error:"Error - Invalid cart id format"});
        if(!mongoose.Types.ObjectId.isValid(pid))
            return res.status(400).json({error:"Error - Invalid product id format"});
        const product = await productModel.findById(pid);
        if(!product)
            return res.status(400).json({error:"Error - Product id not found"});
        const cart = await cartModel.findById(cid);
        if(!cart)
            return res.status(400).json({error:"Error - Cart id not found"});
        let exist = await cartModel.findOne({_id: cid, "products.product_id": pid});
        if(!exist)
            return res.status(400).json({error:"Error - Product id not found in cart"});
        let resultado = await cartModel.updateOne({_id: cid, "products.product_id": pid},{$set: {"products.$.quantity": quantity, "products.$.subtotal": quantity * product.price}});
        res.status(201).json({status: "success", msg: `Product updated: ${resultado}`});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message})  
    }
});

