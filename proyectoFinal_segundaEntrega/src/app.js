import express from "express";
import {router as productsRouter} from "./routers/products.router.js";
import {router as cartsRouter} from "./routers/carts.router.js";
import {router as viewsRouter} from "./routers/views.router.js";
import {router as sessionsRouter} from './routers/sessions.router.js';
import {router as mockRouter} from './routers/mocks.router.js';
import {router as usersRouter} from './routers/users.router.js';
import handlebars from 'express-handlebars';
import {__dirname } from './utils/util.js';
import {middLogger} from './utils/logger.js';
import {Server} from 'socket.io'
import mongoose, { mongo } from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { inicializarPassport} from './config/passport.config.js'
import { config } from './config/dotenv.config.js';
import {errorHandler} from './middlewares/errors/index.js';

const PORT = config.PORT;

const app = express();


app.use(session({
    store: MongoStore.create({
        mongoUrl: config.MONGO_URL,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 3600
    }),
    secret: config.PRIVATE_KEY,
    resave: true,
    saveUninitialized: true
}));

inicializarPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");



app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter);
app.use("/api/sessions",sessionsRouter);
app.use("/mockingproducts",mockRouter);
app.use("/api/users",usersRouter);
app.use("/", viewsRouter);

app.use(errorHandler);
app.use(middLogger);

app.get('*', (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.status(404).send('error 404 - page not found');
});



const serverExpress = app.listen(PORT,() => {console.log(`Server running on port ${PORT}`)});

mongoose.connect(config.MONGO_URL).then(()=>console.log("Concetet to DB")).catch((error)=>{
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
