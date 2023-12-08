import Router from 'express'
import {generateProduct} from '../utils/util.js'

export const router = Router();

router.get('/', (req, res) => {
    let products = [];
    for (let i = 0; i < 100; i++) {
        products.push(generateProduct());
    }

    res.status(200).json(products);
});
