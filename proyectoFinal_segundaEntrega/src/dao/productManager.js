import fs from "fs";
import path from 'path';
import __dirname from "../util.js";

export class ProductManager{
    #path;
    constructor(){
        this.#path = path.join( __dirname, "Files", "products.json");
    }

    addProduct(title,description,price,code,stock,status = true,thumbnail){
        if(!title || !description || !price || !status || !code || !stock){
            return "Error: all fields are required";
        }
        let products = [];
        if(fs.existsSync(this.#path)){
            products = JSON.parse(fs.readFileSync(this.#path,"utf-8"));
            if(products.find(product => product.code === code) !== undefined){
                
                return `Error: already exists a product with the code ${code}$, the product ${title} was not added`;
            } 
        }   
        
        let product = {
            title,
            description,
            price,
            status,
            thumbnail,
            code,
            stock
        };

        if(products.length === 0){
            product.id = 1;
        }else{
            product.id = products[products.length - 1].id + 1;
        }
        products.push(product);
        fs.writeFileSync(this.#path,JSON.stringify(products,null,"\t"));
    }   
    
    getProducts(){
        if(!fs.existsSync(this.#path)){
            return [];
        }
        return JSON.parse(fs.readFileSync(this.#path,"utf-8"));
    }

    getProductById(id){
       let product = this.getProducts().find(product => product.id === id);
       if(!product){
            return;
        }
        return product;
    }

    updateProduct(id,modifiquedProduct){
        let products = this.getProducts();
        let product = products.find(product => product.id === id);
        let invalidFields = [];
        if(!product){
            return `Error: there is no product with the id ${id}`;
        }

        if (modifiquedProduct.code) {
            modifiquedProduct.code += "";
            if (products.find(currentProduct => currentProduct.code === modifiquedProduct.code) !== undefined)
                return res.status(400).json({status: 'error', msg: 'Error - Product code already exists'});
        }
        if (modifiquedProduct.price)
            product.price = parseFloat(product.price);
        if (modifiquedProduct.stock)
            product.stock = parseInt(product.stock); 

        let productArr = Object.entries(modifiquedProduct);

        productArr.forEach(newProp => {
            if(newProp[0] !== "id" && product.hasOwnProperty(newProp[0]))
                product[newProp[0]] = newProp[1];
            else
                invalidFields.push(newProp[0]);
        });
        fs.writeFileSync(this.#path,JSON.stringify(products,null,"\t"));
        if(invalidFields.length > 0)
            return `Error: the fields ${invalidFields.join(", ")} are invalid`;
    } 
    
    deleteProduct(id){
        let products = this.getProducts();
        products = products.filter(product => product.id !== id);
        fs.writeFileSync(this.#path,JSON.stringify(products,null,"\t"));
    }

}

