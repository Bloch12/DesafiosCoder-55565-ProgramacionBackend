import Router from "express";
import {ProductManager}  from "../Managers/productManager.js";
export const router = Router();

const productManager = new ProductManager();

router.get("/",(req,res) => {
    res.setHeader("Content-Type","application/json");
    let {limit} = req.query;
    let products = productManager.getProducts();
    if(!limit)
        return res.status(200).json(products);
    limit = parseInt(limit);
    if(isNaN(limit)){
        return res.status(400).json({error: "the limit must be a number"});
    }
    if(limit < 0){
        return res.status(400).json({error: "the limit must be a positive number"});
    }
    products = products.slice(0,limit);
    res.status(200).json(products);
});

router.get("/:pid",(req,res) => {
    res.setHeader("Content-Type","application/json");
    let {pid} = req.params;
    pid = parseInt(pid);
    if(isNaN(pid)){
        return res.status(400).json({error: "the id must be a number"});
    }
    let product = productManager.getProductById(pid);
    if(product === undefined){
        return res.status(404).json({error: "the product does not exist"});
    }
    res.status(200).json(product);
});

router.post("/",(req,res) => {
    let {title,description,price,thumbnail,code,stock} = req.body;
    console.log(req.body);
    let message = productManager.addProduct(title,description,price,thumbnail,code,stock);
    if(message){
        return res.status(400).json({message});
    }
    res.status(201).json({message: "product added successfully"});
});

router.put("/:pid",(req,res) => {
    let {pid} = req.params;
    pid = parseInt(pid);
    if(isNaN(pid)){
        return res.status(400).json({error: "the id must be a number"});
    }
    let value = req.body;
    let message = productManager.updateProduct(pid,value);
    if(message){
        return res.status(400).json({error: message});
    }
    res.status(200).json({message: "product updated successfully"});
});

router.delete("/:pid",(req,res) => {
    let {pid} = req.params;
    pid = parseInt(pid);
    if(isNaN(pid)){
        return res.status(400).json({error: "the id must be a number"});
    }
    let message = productManager.deleteProduct(pid);
    res.status(200).json({message: "product deleted successfully"});
});

