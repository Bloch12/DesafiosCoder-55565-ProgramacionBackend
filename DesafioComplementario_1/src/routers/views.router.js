import { Router } from "express";
export const router = Router();
import { productModel } from "../dao/models/product.model.js";


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