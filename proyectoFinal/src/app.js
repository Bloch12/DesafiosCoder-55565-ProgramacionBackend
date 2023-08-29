import express from "express";
import {router as productsRouter} from "./routers/products.router.js";
import {router as cartsRouter} from "./routers/carts.router.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter);
app.listen(PORT,() => {console.log(`Server running on port ${PORT}`)});

