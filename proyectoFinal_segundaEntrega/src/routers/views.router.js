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

router.get('/loggerTest',(req,res)=>{
    req.logger.debug("Test - Debug message");
    req.logger.http("Test - Http message");
    req.logger.info("Test - Info message");
    req.logger.warning("Test - Warning message");
    req.logger.error("Test - Error message");
    req.logger.fatal("Test - Fatal message");

    res.send("Check the console");
});

router.get(viewsController.getHome);

router.get("/products",auth,viewsController.getProducts);

router.get("/products/:pid",viewsController.getProductById);

router.get("/carts/:cid",viewsController.getCartById);

router.get("/login",auth2,viewsController.getLogin);

router.get("/registro",auth2,viewsController.getRegister);

router.get("/perfil",viewsController.getProfile);

router.get('/forgotPassword', auth2, viewsController.getForgotPassword);

router.get('/restorePassword', auth2, viewsController.getRestorePassword);







