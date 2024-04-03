

const fs = require('fs').promises;

class productManager { 
    constructor() {   
        this.path = "productos.json"
        this.products = [] 
    }
    async addProduct(title, description, price, thumbnail, code, stock) {
        const newProduct = {

            id: this.products.length + 1,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }
        this.products.push(newProduct);
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2))


        } catch (error) {
            console.log("no se pudo agregar los productos", error)
            throw error;
        }
    }

    async loadProducts() {

        try {
            const data = await fs.readFile(this.path, "utf8");
            return JSON.parse(data)

        } catch (error) {
            console.log("no se pudo cargar los productos", error)
            throw error;
        }
    }

    async getProducts() {
        try {
            const productosCargados = await manager.loadProducts();
            console.log("Estos son todos los productos:", productosCargados);

        } catch (error) {
            console.log("no se pudo cargar los productos", error)
            throw error;
        }
    }
    async getProductsById(id) {

        const productId = this.products.find(product => product.id === id);
        if (productId) {
            return productId;
        } else {
            throw new Error("No se encontró ningún producto con el ID proporcionado.");
        }

}

async updateProducts(){
    try{

    }catch{

    }
}


async deleteProducts(){
    try{

    }catch{

    }
}

}

const manager = new productManager();
manager.addProduct("Camisa", "Descripción de la camisa", 20, "imagen.jpg", "12345", 100);
manager.addProduct("remera", "Descripción de la remera", 10, "imagen.jpg", "12547", 90);
manager.getProducts();
console.log("este es el producto numero 1", manager.getProductsById(1));