const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();


router.post('/', (req, res) => {
  const newCart = {
    id: uuidv4(),
    products: [],
  };


  const carts = JSON.parse(fs.readFileSync('./src/routes/carrito.json', 'utf-8'));
  carts.push(newCart);
  fs.writeFileSync('./src/routes/carrito.json', JSON.stringify(carts, null, 2));

  res.json(newCart);
});


router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;

  const carts = JSON.parse(fs.readFileSync('./src/routes/carrito.json', 'utf-8'));
  const cart = carts.find((c) => c.id === cartId);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});


router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;


  const carts = JSON.parse(fs.readFileSync('./src/routes/carrito.json', 'utf-8'));
  const cart = carts.find((c) => c.id === cartId);
  if (cart) {
    const existingProduct = cart.products.find((p) => p.id === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ id: productId, quantity });
    }

    fs.writeFileSync('./src/routes/carrito.json', JSON.stringify(carts, null, 2));
    res.json(cart.products);
  } else {
    res.status(404).json({ message: 'Carrito no encontrado' });
  }
});

module.exports = router;
