

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

    async updateProduct(id, newData) {
        try {
           
            const index = this.products.findIndex(product => product.id === id);
            if (index !== -1) {
                // Actualiza el producto con los nuevos datos
                this.products[index] = { ...this.products[index], ...newData };
                // Escribe los productos actualizados en el archivo
                await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
                console.log("Producto actualizado correctamente.");
            } else {
                console.log("No se encontró ningún producto con el ID proporcionado.");
            }
        } catch (error) {
            console.log("No se pudo actualizar el producto:", error);
        }
    }
    


    async deleteProduct(id) {
        try {
           
            const index = this.products.findIndex(product => product.id === id);
            if (index !== -1) {
             
                this.products.splice(index, 1);
         
                await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
                console.log("Producto eliminado correctamente.");
            } else {
                console.log("No se encontró ningún producto con el ID proporcionado.");
            }
        } catch (error) {
            console.log("No se pudo eliminar el producto:", error);
        }
    }

}

const manager = new productManager();

(async () => {
    await manager.addProduct("Camisa", "Descripción de la camisa", 20, "imagen.jpg", "12345", 100);
    await manager.addProduct("remera", "Descripción de la remera", 10, "imagen.jpg", "12547", 90);
    
    await manager.getProducts();
    
    console.log("Este es el producto número 1:", await manager.getProductsById(1));
    
    await manager.updateProduct(1, {title: "BANANA"});
    
    await manager.addProduct("zapatilla", "Descripción de la zapatilla", 10, "imagen.jpg", "12547", 90);
    
    await manager.getProducts();
    
    await manager.deleteProduct(1);
})();
