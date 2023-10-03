const express = require('express');
const bodyParser = require('body-parser');
const productsRouter = require('../src/routes/products.js');
const cartsRouter = require('../src/routes/carts.js');

const app = express();
const puerto = 8080;

app.use(bodyParser.json());

// Monta los routers de productos y carritos en las rutas /api/products y /api/carts
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(puerto, () => {
  console.log(`Servidor corriendo en puerto: ${puerto}`);
});
