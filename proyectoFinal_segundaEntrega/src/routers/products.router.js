import Router from "express";
import productsController from "../controllers/productsController.js";
import { permit } from "../util.js";
export const router = Router();

router.get('/',  productsController.getProducts);
        
router.get('/:pid', productsController.getProductById);
        
router.post('/',permit("admin"), productsController.postProduct);
        
router.put('/:pid',permit("admin"), productsController.putProduct);
        
router.delete('/:pid',permit("admin"), productsController.deleteProduct);