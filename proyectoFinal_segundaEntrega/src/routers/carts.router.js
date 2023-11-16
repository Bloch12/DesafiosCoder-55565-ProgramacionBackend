import { Router } from "express";
import cartsController from "../controllers/cartsController.js";
import { permit } from "../util.js";
export const router = Router();

router.post('/',permit("user"),cartsController.createCart);

router.get('/:cid', cartsController.getCartById);
        
router.post('/:cid/product/:pid',permit("user"),cartsController.addProductToCart);
        
router.delete('/:cid/products/:pid',permit("user"), cartsController.deleteProductFromCart);
        
router.put('/:cid',  cartsController.updateCart);
        
router.put('/:cid/products/:pid',permit("user"), cartsController.updateAmountOfProductInCart);
        
router.delete('/:cid', cartsController.deleteCart);

router.put('/:cid/purchase',permit("user"),cartsController.purchase);