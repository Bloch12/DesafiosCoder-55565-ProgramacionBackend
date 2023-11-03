import { Router } from "express";
import cartsController from "../controllers/cartsController.js";
export const router = Router();

router.post('/', cartsController.createCart);

router.get('/:cid', cartsController.getCartById);
        
router.post('/:cid/product/:pid',  cartsController.addProductToCart);
        
router.delete('/:cid/products/:pid', cartsController.deleteProductFromCart);
        
router.put('/:cid',  cartsController.updateCart);
        
router.put('/:cid/products/:pid', cartsController.updateAmountOfProductInCart);
        
router.delete('/:cid', cartsController.deleteCart);