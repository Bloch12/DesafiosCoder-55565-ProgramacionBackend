import { Router } from "express";
import viewsController from "../controllers/viewsController.js";
export const router = Router();

const auth=(req, res, next)=>{
    if(req.session.user){
        next()
    }else{
        return res.redirect('/login')
    }
}

const auth2=(req, res, next)=>{
    if(req.session.user){
        return res.redirect('/products')
    }else{
        next()
    }
}

router.get(viewsController.getHome);

router.get("/products",auth,viewsController.getProducts);

router.get("/products/:pid",viewsController.getProductById);

router.get("/carts/:cid",viewsController.getCartById);

router.get("/login",auth2,viewsController.getLogin);

router.get("/registro",auth2,viewsController.getRegister);

router.get("/perfil",viewsController.getProfile);




