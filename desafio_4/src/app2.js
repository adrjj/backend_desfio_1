const express = require("express")
const __dirname= require("./utils")
const handlebars = require('express-handlebars');
const viewsRouter = require('./routes/views.router.js');

const { Server } = require('socket.io');

const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, console.log(`Server running on port ${PORT}`))

const socketServer = new Server(httpServer)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const productRouter = require("../router/products.js")
const cartRouter = require("../router/carts.js")

app.use('/api/products', productRouter);
app.use('/api/carts',cartRouter);


app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.use('/', viewsRouter)


socketServer.on('connection', socket => {
    socket.on('mensaje', data => {
        console.log(`mensaje recibido ${data}`)
        socketServer.emit('mensaje', data)
    })
})


