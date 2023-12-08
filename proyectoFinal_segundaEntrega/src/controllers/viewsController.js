import { productsService } from "../services/products.service.js";
import { cartsService } from "../services/carts.service.js";

async function getHome (req,res) {
    res.setHeader("Content-Type","text/html");
    const products = await productModel.find();
    const productPlain = products.map(product => product.toObject());
    res.status(200).render("home",{title: "Lista de productos",products: productPlain});
}


async function getProducts (req,res){
    res.setHeader("Content-Type","text/html");
    let {limit,page,query,sort} = req.query;
    
    limit = parseInt(limit) || 10;
    if(isNaN(limit) || limit < 1)
        return res.status(400).json({error:"Error - Invalid limit format"});
    page = parseInt(page) || 1;
    if(isNaN(page) || page < 1)
        return res.status(400).json({error:"Error - Invalid page format"});
    if(sort && sort !== "asc" && sort !== "desc")
        return res.status(400).json({error:"Error - Invalid sort format"});
    const sortObj = sort? {price: sort} : {};
    let queryObj = {};
    if(query)
        queryObj = query === "available"? {status: true} : {category: query};
    let resultado;
    try{
        resultado = await productsService.getFilteredProducts(queryObj, limit, page, sortObj);
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message});
    }
    
    let {
        totalPages,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
    } = resultado;

    const baseUrl = "/products";
    const prevLink = hasPrevPage ? `${baseUrl}?limit=${limit}&page=${prevPage}${sort?`&sort=${sort}`:""}${query?`&query=${query}`:""}` : null;
    const nextLink = hasNextPage ? `${baseUrl}?limit=${limit}&page=${nextPage}${sort?`&sort=${sort}`:""}${query?`&query=${query}`:""}` : null;
    const firstLink = `${baseUrl}?limit=${limit}${sort?`&sort=${sort}`:""}${query?`&query=${query}`:""}`;
    const lastLink = `${baseUrl}?limit=${limit}&page=${totalPages}${sort?`&sort=${sort}`:""}${query?`&query=${query}`:""}`;
    
    res.status(200).render("products",{
        title: "Products",
        products: resultado.docs,
        totalPages,
        hasPrevPage,
        hasNextPage,
        prevPage: prevLink,
        nextPage: nextLink,
        firstPage: firstLink,
        lastPage: lastLink,
        limit: limit,
        page,
        userName: req.session.user.name
    });

}

async function getProductById(req,res){
    res.setHeader("Content-Type","text/html");
    let {pid} = req.params;
    try{
        let pidValidation = await productsService.validateProductId(pid);
        if (pidValidation.error)
            return res.status(400).json({error:"Error - Product id not found"})

        const product = pidValidation.product;

        if(!product)
            return res.status(400).json({error:"Error - Product id not found"});
        let{title,description,price,category,stock,code} = product;
        res.status(200).render("product",{
            title,
            description,
            price,
            category,
            stock,
            code,
            id: pid
        });
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message});
    }
}

async function getCartById (req,res){
    res.setHeader("Content-Type","text/html");
    let {cid} = req.params;
    try{
        let cidValidation = await cartsService.validateCartId(req.user.cart);
        if (cidValidation.error)
            return res.res.status(400).json({error:"Error - Cart id not found"})

        const cart = cidValidation.cart;

        if(!cart)
            return res.status(400).json({error:"Error - Cart id not found"});
        let products = [];
        cart.products.forEach(prod => {
            products.push({
                _id: prod.product_id._id,
                title: prod.product_id.title,
                description: prod.product_id.description,
                price: prod.product_id.price,
                category: prod.product_id.category,
                stock: prod.product_id.stock,
                code: prod.product_id.code,
                quantity: prod.quantity,
                subtotal: prod.subtotal
            });
        });
        res.status(200).render("cart",{title: "Lista de productos",products});
    }catch(error){
        res.status(500).json({error:'unexpeted Error', detalle:error.message})
    }
}

async function getLogin(req,res)  {
    res.setHeader("Content-Type","text/html");
    res.status(200).render("login",{title: "Login"});
}

async function getRegister(req,res) {
    res.setHeader("Content-Type","text/html");
    res.status(200).render("registro",{title: "Registro"});
}

async function getProfile (req,res) {
    res.setHeader("Content-Type","text/html");
    res.status(200).render("perfil",{title: "Perfil", userName: req.session.user.name, rol: req.session.user.role, email: req.session.user.email});
}

async function getForgotPassword(req, res) {
    res.renderSuccess("forgotPassword");
}

async function getRestorePassword(req, res) {
    res.renderSuccess("restorePassword");
}


export default { getHome, getProfile, getProducts, getProductById, getCartById, getRegister, getLogin, getForgotPassword, getRestorePassword }




