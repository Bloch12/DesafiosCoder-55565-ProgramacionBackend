const fs = require("fs");
const { get } = require("http");


class ProductManager{
    #path;
    constructor(){
        this.#path = "./Files/products.json"
    }

    addProduct(title,description,price,thumbnail,code,stock){
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log("Error: all fields are required");
            return;
        }

        let products = [];
        if(fs.existsSync(this.#path)){
            products = JSON.parse(fs.readFileSync(this.#path,"utf-8"));
            if(products.find(product => product.code === code) !== undefined){
                console.log(`Error: already exists a product with the code ${code}, the product ${title} was not added`);
                return;
            } 
        }   
        
        let product = {
            title,
            description,
            price,
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
            console.log(`Error: there is no product with the id ${id}`);
            return;
        }
        return product;
    }

    updateProduct(id,value,field){
        let products = this.getProducts();
        let product = products.find(product => product.id === id);
        if(!product){
            console.log(`Error: there is no product with the id ${id}`);
            return;
        }
        if(typeof value === typeof product){
            for(let key in value){
                if (product[key] && key !== "id"){
                    product[key] = value[key];
                }
            }
        }else{
            if(!product[field]){
                console.log(`Error: there is no field ${field} in the product with the id ${id}`);
                return;
            }
            if(field === "id"){
                console.log(`Error: the field ${field} cannot be modified`);
                return;
            }
            product[field] = value;
        }    
        fs.writeFileSync(this.#path,JSON.stringify(products,null,"\t"));
    } 
    
    deleteProduct(id){
        let products = this.getProducts();
        products = products.filter(product => product.id !== id);
        fs.writeFileSync(this.#path,JSON.stringify(products,null,"\t"));
    }
}


//pruebas
let productManager = new ProductManager();
console.log(productManager.getProducts());
productManager.addProduct("producto prueba","Este es un producto prueba",200,"Sin imagen","abc123",25);
console.log(productManager.getProducts());
console.log(productManager.getProductById(1));
productManager.updateProduct(1,20,"stock");
productManager.addProduct("producto prueba 2","Este es un producto prueba 2",200,"Sin imagen","abc234",25);
let product = {
    title: "producto prueba 3",
    description: "Este es un producto prueba 3",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc345",
    stock: 25,
}
productManager.updateProduct(2,product);
console.log(productManager.getProducts());
productManager.deleteProduct(1);



