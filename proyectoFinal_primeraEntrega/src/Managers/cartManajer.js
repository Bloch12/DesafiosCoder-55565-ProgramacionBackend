import fs from 'fs';
import { ProductManager } from './productManager.js';

export class CartManager {
    #path;
    constructor(){
        this.#path = "./Files/carts.json";
    }

    addCart(){
        let carts = [];
        let products = [];
        if(fs.existsSync(this.#path)){
            carts = JSON.parse(fs.readFileSync(this.#path,"utf-8"));
        }
        let cart = {
            products,
        };
        if(carts.length === 0)
            cart.id = 1;
        else
            cart.id = carts[carts.length - 1].id + 1;
        carts.push(cart);
        fs.writeFileSync(this.#path,JSON.stringify(carts,null,"\t"));
    }

    getCarts(){
        if(!fs.existsSync(this.#path))
            return [];
        return JSON.parse(fs.readFileSync(this.#path,"utf-8"));
    }

    getCartsById(id){
        let carts = this.getCarts();
        let cart = carts.find(cart => cart.id === id);
        if(!cart)
            return;
        return cart;
    }

    addProductToCart(id,productId){
        let carts = this.getCarts();
        let cart = carts.find(cart => cart.id === id);
        if(!cart)
            return "Error: the cart does not exist";
        let productManager = new ProductManager();
        let product = productManager.getProductById(productId);
        if(!product)
            return "Error: the product does not exist";
        if(cart.products.find(product => product.id === productId)){
            cart.products.find(product => product.id === productId).quantity++;
        }else{
            cart.products.push({
                id: product.id,
                quantity: 1
            });
        }
        fs.writeFileSync(this.#path,JSON.stringify(carts,null,"\t"));
    }

}