import Router from "express";
import productsController from "../controllers/productsController.js";
import { permit } from "../utils/util.js";
export const router = Router();

router.get('/',  productsController.getProducts);
        
router.get('/:pid', productsController.getProductById);
        
router.post('/',permit("admin","premium"), productsController.postProduct);
        
router.put('/:pid',permit("admin","premium"), productsController.putProduct);
        
router.delete('/:pid',permit("admin","premium"), productsController.deleteProduct);