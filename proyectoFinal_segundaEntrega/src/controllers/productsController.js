import { productsService } from '../services/products.service.js';
import {io} from "../app.js";
import { CustomError } from '../services/errors/customError.js';
import EErrors from '../services/errors/enums.js';
import { generateProductsErrorInfo } from '../services/errors/info.js';

let validateProps = (body, ...validator) => {
    let newProductProps = Object.keys(body);
    for (const toValidateProp of validator) {
        if (!newProductProps.includes(toValidateProp))
            return false;
    };
    return true;
}

async function getProducts(req, res) {
    res.setHeader("Content-Type", "application/json");
    let {limit, page, sort, query} = req.query;

    limit = limit ? parseInt(limit) : 10;
    if (isNaN(limit) || limit < 0)
        return res.status(400);

    page = page ? parseInt(page) : 1;
    if (isNaN(page) || page <= 0)
        return res.status(400);

    if (sort && !['asc', 'desc'].includes(sort))
        return res.status(400);
    let sortBy = sort ? {price: sort} : {};

    // query puede ser available o puede ser la categoria por la cual filtrar.
    let queryCondition = {};
    if (query)
        queryCondition = query === 'available' ? {status: true} : {category: query};

    let result;
    try {
        result = await productsService.getFilteredProducts(queryCondition, limit, page, sortBy);
    } catch (error) {
        return res.status(400);
    }

    let {
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
    } = result;
    
    const baseUrl = req.protocol + '://' + req.get('host') + req.baseUrl; 
    const prevLink = hasPrevPage ? `${baseUrl}?page=${prevPage}&limit=${limit}${sort ?"&sort=" + sort : ""}${query ? "&query=" + query: ""}` : null;
    const nextLink = hasNextPage ? `${baseUrl}?page=${nextPage}&limit=${limit}${sort ?"&sort=" + sort : ""}${query ? "&query=" + query: ""}` : null;

    res.status(201).json({
        products: result.docs,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        prevLink,
        nextLink
    });
}

async function getProductById(req, res) {
    res.setHeader("Content-Type", "application/json");
    let pid = req.params.pid;

    try {
        let result = await productsService.validateProductId(pid);

        if (result.error)
            return res.status(400);

        result.status(201).json(result.product);
    } catch (error) {
        res.status(500);
    }
}

async function postProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let product = req.body;

    if (!validateProps(product, 'title', 'description', 'code', 'price', 'status', 'stock', 'category'))
        throw CustomError("To less arguments", product, generateProductsErrorInfo(product),EErrors.INVALID_TYPES_ERROR);

    let codeProduct = await productsService.getProductByCode(product.code);
    if (codeProduct)
        return res.status(400);

    product.price = parseFloat(product.price);
    product.status = !!product.status;
    product.stock = parseInt(product.stock);
    product.owner = req.user._id;

    try {
        let newProduct = await productsService.createProduct(product);
        io.emit('list-updated', {products: await productsService.getProducts(), msg: `Product ${product.title} added.`});
        res.status(201).json({msg: `Product ${newProduct} added successfully`});
    } catch (error) {
        res.status(500);
    }
}

async function putProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let {pid} = req.params;
    let product = req.body;
    let validator = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];

    let idValidation = await productsService.validateProductId(pid);
    if (idValidation.error)
        return res.sendUserError(idValidation.msg);
    let productToUpdate = idValidation.product;

    for (const toValidateProp of Object.keys(product)) {
        if (!validator.includes(toValidateProp))
            return res.status(400);
    }

    let codeProduct = await productsService.getProductByCode(product.code);
    if (codeProduct)
        return res.status(500);

    if (req.user.role === 'premium' && productToUpdate.owner !== req.user._id){
        return res.status(401);
    }

    if (product.price) {
        product.price = parseFloat(product.price);
        if (isNaN(product.price))
            return res.status(400);
    }

    if (product.status)
        product.status = !!product.status;

    if (product.stock) {
        product.stock = parseInt(product.stock);
        if (isNaN(product.stock))
            return res.status(400);
    }

    Object.entries(product).forEach(([key, value]) => {
        productToUpdate[key] = value;
    });

    try {
        let result = await productsService.updateProduct(pid, productToUpdate);
        io.emit('list-updated', {products: await productsService.getProducts(), msg: `Product with id ${pid} updated.`});
        res.status(201).json({msg: `Product with id ${pid} updated successfully: ${result}`}); 
    } catch (error) {
        res.status(500);
    }
}

async function deleteProduct(req, res) {
    res.setHeader("Content-Type", "application/json");
    let {pid} = req.params;
        
    let idValidation = await productsService.validateProductId(pid);
    if (idValidation.error)
        return res.status(400);

    if(req.user.role === 'premium' && idValidation.product.owner !== req.user._id){
        return res.status(401);
    }

    try {
        let result = await productsService.deleteProduct(pid);
        io.emit('list-updated', {products: await productsService.getProducts(), msg: `Product with id ${pid} deleted.`});
        res.status(201).json({msg:`Product with id ${pid} deleted successfully: ${result}`}); 
    } catch (error) {
        res.status(500);
    }
}

export default { getProducts, getProductById, postProduct, putProduct, deleteProduct };