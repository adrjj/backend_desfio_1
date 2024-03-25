class productManager{ //creamos una clase llamada productManager
    constructor(){   //creamos el cosntrucctor
       
        this.products=[] // declaramos la instancia products que es un array vacio
    }


// addProduct es la metedo/funcion para crear un nuevo objeto dentro del array

addProduct(title, description, price, thumbnail, code, stock) {
    const newProduct = {
        id: this.products.length+1, //cremos un id unico cada vez que agregamos un nuevo objeto al arreglo producto, 
                                    //el metodo length en este caso cuenta los objetos del array 
                                    //suponiendo que tenemos 5 objetos el proximo que carguemos tendria el id:6
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock
    };
   // con el metodo push aplicado al array products cargamos un nuevo producto en el objeto newProduct
    this.products.push(newProduct);
}
// con el metodo getProducts solo retornamos TODO lo que esta guardado en el array productos 
getProducts() {
    return this.products; // Devuelve todos los arreglos de los productos
}
// con el metodo getProductById podemos cargar el metodo 
getProductById(id) {
    const product = this.products.find(product => product.id === id);
    if (product) {
        return product;
    } else {
        return "No se encontró ningún producto con el ID proporcionado.";
    }
}

}
const manager = new productManager();
manager.addProduct("Camisa", "Descripción de la camisa", 20, "imagen.jpg", "12345", 100);
manager.addProduct("remera", "Descripción de la remera", 10, "imagen.jpg", "12547", 90);
manager.addProduct("zapatilla", "Descripción de la zapatilla", 5, "imagen.jpg", "15247", 70);
manager.addProduct("campera", "Descripción de la campera", 8, "imagen.jpg", "121447", 105);
// probamos que no encuentra el id buscado
console.log("probamos el mensaje de error si no esta el id buscado",manager.getProductById());
//probamos que encuentra un id espesifico
console.log("este es el producto numero 3", manager.getProductById(3));
// probamos que nos devuelva todos los objetos del array
console.log ("estos son todos los productos",manager.getProducts())



