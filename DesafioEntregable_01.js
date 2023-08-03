class ProductManager{
    
    constructor(){
        this.products = [];
    }

    addProduct(title,description,price,thumbnail,code,stock){
        
        if(title === undefined || description === undefined || price === undefined || thumbnail === undefined || code === undefined || stock === undefined){
            console.log("Error: all fields are required");
            return;
        }

       if(this.products.find(product => product.code === code) !== undefined){
            console.log(`Error: already exists a product with the code ${code}, the product ${title} was not added`);
            return;
       } 

        let product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };
        if(this.products.length === 0){
            product.id = 1;
        }else{
            product.id = this.products[this.products.length - 1].id + 1;
        }
        
        this.products.push(product);
    }   
    
    getProducts(){
        return this.products;
    }

    getProductById(id){
       let product = this.products.find(product => product.id === id);
       if(product === undefined){
           console.log(`Error: there is no product with the id ${id}`);
           return;
       }
       return product;
    }
}


let productManager = new ProductManager();
// cracion de un producto sin todos los campos
productManager.addProduct("car",1000,"./car.jpg",1,10);
//creacion de un nuevo producto
productManager.addProduct("car","a car",1000,"./car.jpg",1,10);
//creacion de un producto con un codigo que ya existe
productManager.addProduct("motorcycle","a motorcycle",500,"./motorcycle.jpg",1,20);
//creacion de dos nuevo producto
productManager.addProduct("motorcycle","a motorcycle",500,"./motorcycle.jpg",2,20);
productManager.addProduct("bike","a bike",200,"./bike.jpg",3,30);
//listado de los productos
console.log(productManager.getProducts());
//busqueda de un producto con id existente
console.log(productManager.getProductById(1));
//busqueda de un producto con id inexistente
console.log(productManager.getProductById(4));
