import Router from "express";
import productsController from "../controllers/productsController.js";
export const router = Router();

router.get('/',  productsController.getProducts);
        
router.get('/:pid', productsController.getProductById);
        
router.post('/', productsController.postProduct);
        
router.put('/:pid', productsController.putProduct);
        
router.delete('/:pid', productsController.deleteProduct);