import { Router } from "express";
import { CartManager } from "../Managers/cartManajer.js";
export const router = Router();

const cartManager = new CartManager();

router.get("/:cid",(req,res) => {
    let {cid} = req.params;
    cid = parseInt(cid);
    if(isNaN(cid)){
        return res.status(400).json({error: "the id must be a number"});
    }
    let cart = cartManager.getCartsById(cid);
    if(cart === undefined){
        return res.status(404).json({error: "the cart does not exist"});
    }
    res.status(200).json(cart);
});

router.post("/",(req,res) => {
    cartManager.addCart();
    res.status(201).json({message: "cart added successfully"});
});

router.post("/:cid/products/:pid",(req,res) => {
    let {cid,pid} = req.params;
    cid = parseInt(cid);
    pid = parseInt(pid);
    if(isNaN(cid) || isNaN(pid)){
        return res.status(400).json({error: "the id must be a number"});
    }
    let message = cartManager.addProductToCart(cid,pid);
    if(message){
        return res.status(400).json({error: message});
    }
    res.status(201).json({message: "product added successfully"});
});