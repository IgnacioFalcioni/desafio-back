const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('../src/routes/products.js');
const cartsRouter = require('../src/routes/carts.js');
const handlebars = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs'); 





const app = express();
const server = http.createServer(app);
const io = new Server(server);





app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/home', (req,res)=>{


  res.render('home');
});


app.get('/realtimeproducts', (req,res)=>{


  res.render('realTimeProducts', {productos});
});

io.on('connection', (socket)=>{
  console.log('cliente conectado');
  socket.on('nuevo_producto', (producto)=>{


    io.emit('producto_agregado', producto);

  });

  socket.on('eliminar_producto', (productoId) => {
   
    const index = productos.findIndex((p) => p.id === productoId);
    if (index !== -1) {
      const productoEliminado = productos.splice(index, 1)[0];
      io.emit('producto_eliminado', productoEliminado);
      
      io.to('realTimeProducts').emit('producto_eliminado', productoEliminado.id);
    }
  });

 

  socket.on('disconnect', ()=>{
    console.log('cliente desconectado');
  });

});

const puerto = 8080;
server.listen(puerto, ()=>{
  console.log(`servidor corriendo en puerto: ${puerto}`);
})
