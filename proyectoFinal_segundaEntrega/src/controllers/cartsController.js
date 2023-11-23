import { cartsService } from "../services/carts.service.js"
import { productsService } from "../services/products.service.js";
import { CustomError } from "../services/errors/customError.js";
import EErrors from "../services/errors/enums.js";
import { addProductToCartError } from "../services/errors/info.js";


async function getCartById(req,res){
    res.setHeader("Content-Type","application/json");
    let {cid} = req.params;
    try{
        let idValidation = await cartsService.validateCartId(cid);
        if (idValidation.error)
            return res.status(404).json({status: 'error',msg: idValidation.msg})

        const cart = idValidation.cart;
        
        res.status(201).json({status: "sussess", msg: 'Cart created'})
    }catch{
        return res.status(500).json({status: 'error',msg: 'Error - Unexpeted Error'})
    }
}

async function createCart(req,res){
    res.setHeader("Content-Type","application/json");
    let {products} = req.body;
    if(!products)
        return res.status(400).json({status: "error", msg: "missing parameters"});
    
        try {
        for (const product of products) {
            if (!product.product_id || !product.quantity)
                return res.status(400).json({status: 'error', msg: 'Error - All products must have an id and a quantity'})
                
            let pid = product._id;
            let idValidation = await productsService.validateProductId(pid);

            if(idValidation.error){
                return res.status(400).json({status: 'error', msg: idValidation.msg})
            }

            let price = (await productModel.findById(product.product_id)).price;
            product.subtotal = price * product.quantity;
        }

        const cart = {
            products
        }

        let resultado = await cartsService.create(cart);
        res.status(201).json({status: "success", msg: `Cart created: ${resultado}`});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message})
    }
}

async function addProductToCart(req,res) {
    res.setHeader("Content-Type","application/json");
    let {cid,pid} = req.params;
    try{
        let pidValidation = await productsService.validateProductId(pid);
        if (pidValidation.error)
            throw CustomError(pidValidation.msg,pidValidation,addProductToCartError(pid,cid),EErrors.INVALID_TYPES_ERROR);

        let cidValidation = await cartsService.validateCartId(cid);
        if (cidValidation.error)
            throw CustomError(cidValidation.msg,cidValidation,addProductToCartError(pid,cid),EErrors.INVALID_TYPES_ERROR);

        let product = pidValidation.product;
        let cart = cidValidation.cart;

        let resultado;
        let exist = await cartsService.getProductById(cid, pid);
        if(exist){
            let productInCart = existingProduct.products[0];
            let product = productInCart.product;
            resultado = await cartsService.updateAmountOfProductInCart(cid, pid, productInCart.quantity + 1, productInCart.subtotal + product.price);
        }else{
            let newProduct = {
                product: pid,
                quantity: 1,
                subtotal: product.price
            }
            resultado = await cartsService.createProductInCart(cid, newProduct);
        }
        res.status(201).json({status: "success", msg: `Product added to cart: ${resultado}`});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message})  
    }
}


async function deleteProductFromCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid, pid } = req.params;

    try {
        let pidValidation = await productsService.validateProductId(pid);
        if (pidValidation.error)
            return res.status(400)

        let cidValidation = await cartsService.validateCartId(cid);
        if (cidValidation.error)
            return res.status(400)

        let resultado = await cartsService.deleteProductFromCart(cid, pid);
        res.status(201).json({status: "success", msg: `Product added to cart: ${resultado}`});
    } catch (error) {
        res.status(500);
    }
}

async function updateCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid } = req.params;

    try {
        let cidValidation = await cartsService.validateCartId(cid);
        if (cidValidation.error)
            return res.status(400)

        let { products } = req.body;

        if (!Array.isArray(products))
            return res.status(400);

        for (const product of products) {
            if (!product.product || !product.quantity)
                return res.status(400);
            
            let pid = product.product._id;
            let pidValidation = await productsService.validateProductId(pid);
            if (pidValidation.error)
                return res.status(400);

            let price = (await productsService.getProductById(pid)).price;
            product.subtotal = price * product.quantity;
        }

        let resultado = await cartsService.updateCart(cid, products);
        res.status(201).json({status: "success", msg: `Product added to cart: ${resultado}`});
    } catch (error) {
        res.status(500);
    }
}

async function updateAmountOfProductInCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid, pid } = req.params;

    try {
        let pidValidation = await productsService.validateProductId(pid);
        if (pidValidation.error)
            return res.status(400);

        let product = pidValidation.product;

        let cidValidation = await cartsService.validateCartId(cid);
        if (cidValidation.error)
            return res.status(400);

        let { quantity } = req.body;
        if (!quantity)
            return res.status(400);
        quantity = parseInt(quantity);
        if (isNaN(quantity) || quantity <= 0)
            return res.status(400);

        let resultado = await cartsService.updateAmountOfProductInCart(cid, pid, quantity, product.price * quantity);
        return res.status(201).json({status:"succes", msg: `Product with id ${pid} quantity updated successfully to ${quantity}: ${resultado}`});
    } catch (error) {
        res.status(500);
    }
}

async function deleteCart(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { cid } = req.params;

    try {
        let cidValidation = await cartsService.validateCartId(cid);
        if (cidValidation.error)
            return res.status(400);

        let products = [];
        let resultado = await cartsService.updateCart(cid, products);
        return res.status(201).json({status: "succes", msg:`Cart ${cid} deleted successfully: ${resultado}`});
    } catch (error) {
        res.status(500);
    }
}

async function purchase(req,res){
    res.setHeader("Content-Type","application/json");
    let {cid} = req.params;

    try{
        let cidValidation = await cartsService.validateCartId(cid);
        if (cidValidation.error)
            return res.status(400);
        
        let products = cidValidation.cart.products;
        let rejectedProducts = [];
        
        if(products.length == 0)
            return res.status(400);

        ticket = {purchaser: req.user.email, amount};
        ticket.amount = 0;
        products.forEach(async element => {
            let pid = element.product;
            let pidValidation = await productsService.validateProductId(pid);
            if (pidValidation.error)
                return res.status(400);
            
            let product = pidValidation.product;

            if(product.stock < element.quantity){
                rejectedProducts.push(element);
            }else{
                product.stock -= element.quantity;
                ticket.amount += element.subtotal;
                await productsService.updateProduct(pid, {stock: product.stock});
            }
        });

        if(ticket.amount == 0)
            return res.status(400);
    
        await cartsService.updateCart(cid, rejectedProducts);
        
        
        ticket = await ticketsService.createTicket(ticket);
        rejectedProducts.map(p => p = p.product);
        return res.status(201).json({status: "success", msg: `Ticket created: ${ticket} \n Rejected products: ${rejectedProducts}`});

    }catch(error){
        res.status(500);
    }
}

export default { createCart, getCartById, addProductToCart, deleteProductFromCart, updateCart, updateAmountOfProductInCart, deleteCart, purchase};