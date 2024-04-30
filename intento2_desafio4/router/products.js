//products archivo con la logica ubicado en router

const express = require('express')
const router = express.Router()

const fs = require('fs');
const path = require('path');








class productManager {
    constructor() {
        this.path = path.join(__dirname, "../productos.json"); // Definir la ruta absoluta del archivo productos.json
        this.products = []
        //  this.loadProducts();
        console.log("de donde sale", this.path )
    }



    async addProduct(title, description, price, thumbnail, code, stock, status, category) {
        try {
           // Validar campos obligatorios
           if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                throw new Error("Todos los campos son obligatorios  add product.");
            } 
        

            // Validar que el código no se duplique
            if (this.products.some(product => product.code === code)) {
                throw new Error("El código del producto ya existe.");
            }
            const fileExists = await fs.promises.access(path.join(__dirname, this.path)).then(() => true).catch(() => false);
            if (!fileExists) {
                // Si el archivo no existe, crearlo con un array vacío
                await fs.promises.writeFile(this.path, '[]');
            }

            const nextProductId = await this.getNextProductId();
            const newProduct = {
                id: nextProductId,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
                status: true,
                category: category
            };

            this.products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
           
          
            console.log("Producto agregado:", newProduct); // Agregamos este console.log para depurar


        } catch (error) {
            console.log("No se pudo agregar el producto:", error);
            throw error;
        }
    }




    async loadProducts() {
        try {
            const data = await fs.promises.readFile(this.path, { encoding: "utf8" });
            
            console.log("Contenido del archivo JSON:", data);
            return JSON.parse(data);
        } catch (error) {
            console.log("No se pudo cargar los productos", error);
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
    async getNextProductId() {
        await this.loadProducts();
        if (this.products.length === 0) {
            return 1; // Si no hay productos, devolver 1 como primer ID
        } else {
            const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
            return Number(maxId) + 1;
        }
    }



    async updateProduct(id, newData) {
        try {
            // Validar que exista el ID proporcionado
            const index = this.products.findIndex(product => product.id === id);
            if (index === -1) {
                throw new Error("No se encontró ningún producto con el ID proporcionado.");
            }

            // Validar que el nuevo código no se duplique
            if ('code' in newData && newData.code !== this.products[index].code && this.products.some(product => product.code === newData.code)) {
                throw new Error("El nuevo código del producto ya existe.");
            }

            // Actualizar el producto con los nuevos datos
            this.products[index] = { ...this.products[index], ...newData };
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
            console.log("Producto actualizado correctamente.");
        } catch (error) {
            console.log("No se pudo actualizar el producto:", error);
            throw error;
        }
    }


    async deleteProduct(id) {
        try {
            const index = this.products.findIndex(product => product.id === id);
            if (index !== -1) {
                // Guarda el ID del producto eliminado
                const deletedProductId = this.products[index].id; // <-- Se agregó esta línea para obtener el ID del producto eliminado
                this.products.splice(index, 1);
                await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));

                console.log("Producto eliminado:", deletedProductId); // Agregamos este console.log para depurar

             
                console.log("Evento productDeleted emitido:", deletedProductId); // Agregamos este console.log para depurar
            } else {
                console.log("No se encontró ningún producto con el ID proporcionado.");
            }
        } catch (error) {
            console.log("No se pudo eliminar el producto:", error);
        }
    }

   

    async testMethod() {
        return '¡ProductManager está enlazado correctamente!';
    }

}




const manager = new productManager();
router.manager = manager;



// Ruta para agregar un nuevo producto (POST)
router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, category, status } = req.body;
        // datos obligatorios
       if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            return res.status(400).json({ error: "Todos los campos son obligatorios en router post." });
       }
        console.log(req.body);

        // Agregar el producto usando el método de la instancia
        await manager.addProduct(title, description, price, thumbnail, code, stock, status, category);


        res.status(201).json({ message: "Producto agregado correctamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar el producto en router post.", message: error.message });
    }
});

// Ruta para obtener todos los productos (GET)
router.get('/', async (req, res) => {
    try {
        // Obtener todos los productos usando el método de la instancia
        const productos = await manager.loadProducts();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos.", message: error.message });
    }
});


// Ruta para obtener un producto por su ID (GET)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Obtener un producto por su ID usando el método de la instancia
        const producto = await manager.loadProducts(id);

    

        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto.", message: error.message });
    }
});






// Ruta para actualizar un producto por su ID (PUT)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        // Actualizar un producto por su ID usando el método de la instancia
        await manager.updateProduct(id, newData);
        res.status(200).json({ message: "Producto actualizado correctamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto.", message: error.message });
    }
});

// Ruta para eliminar un producto por su ID (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Eliminar un producto por su ID usando el método de la instancia
        await manager.deleteProduct(id);
        res.status(200).json({ message: "Producto eliminado correctamente." });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto.", message: error.message });
    }
});

module.exports = router;
