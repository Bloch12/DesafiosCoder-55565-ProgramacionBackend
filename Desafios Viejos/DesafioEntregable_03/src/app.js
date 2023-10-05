const ProductManager = require(__dirname + "/../../DesafioEntregable_02");
const productManager = new ProductManager();
const express = require("express");

const app = express();
const PORT = 3000;


app.get("/products",(req,res) => {
    res.setHeader("Content-Type","application/json");
    let {limit} = req.query;
    products = productManager.getProducts();
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

app.get("/products/:pid",(req,res) => {
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

app.listen(PORT,() => {console.log(`Server running on port ${PORT}`)});


