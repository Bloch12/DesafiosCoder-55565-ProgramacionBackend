import express from "express";
import {router as productsRouter} from "./routers/products.router.js";
import {router as cartsRouter} from "./routers/carts.router.js";
import {router as viewsRouter} from "./routers/views.router.js";
import {router as chatRouter, chatSocket} from './routers/chat.router.js';
import handlebars from 'express-handlebars';
import __dirname from './util.js';
import {Server} from 'socket.io'
import mongoose, { mongo } from 'mongoose';


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");



app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter);
app.use("/chat",chatRouter);
app.use("/", viewsRouter);

app.get('*', (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.status(404).send('error 404 - page not found');
});



const serverExpress = app.listen(PORT,() => {console.log(`Server running on port ${PORT}`)});

mongoose.connect('mongodb+srv://user:123@ecomerce.37i6wvl.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp').then(()=>console.log("Concetet to DB")).catch((error)=>{
    if(error){
        console.log("Cannot connect to DB: " + error);
        process.exit();
    }
    
});

export const io = new Server(serverExpress);

io.on("connection", socket => {
    console.log(`Se conecto un cliente con id ${socket.id}`);
    chatSocket(io, socket);
});

io.on("res",data=>{ console.log(data)});
