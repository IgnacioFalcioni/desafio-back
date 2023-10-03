const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Ruta raíz GET para listar todos los productos
router.get('/', (req, res) => {
  // Implementa la lógica para leer productos desde 'productos.json'
  const products = JSON.parse(fs.readFileSync('./src/routes/productos.json', 'utf-8'));

  res.json(products);
});

// Ruta GET para obtener un producto por ID
router.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  // Implementa la lógica para buscar un producto por su ID en 'productos.json'
  const products = JSON.parse(fs.readFileSync('./src/routes/productos.json', 'utf-8'));

  const product = products.find((p) => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Ruta POST para agregar un nuevo producto
router.post('/', (req, res) => {
  const newProduct = {
    id: uuidv4(),
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: req.body.price,
    status: true,
    stock: req.body.stock,
    category: req.body.category,
    thumbnails: req.body.thumbnails || [],
  };

  // Implementa la lógica para agregar un nuevo producto a 'productos.json'
  const products = JSON.parse(fs.readFileSync('./src/routes/productos.json', 'utf-8'));

  products.push(newProduct);
  fs.writeFileSync('./src/routes/productos.json', JSON.stringify(products, null, 2));

  res.json(newProduct);
});

// Ruta PUT para actualizar un producto por ID
router.put('/:pid', (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;

  // Implementa la lógica para actualizar un producto en 'productos.json'
  const products = JSON.parse(fs.readFileSync('./src/routes/productos.json', 'utf-8'));
  const existingProductIndex = products.findIndex((p) => p.id === productId);

  if (existingProductIndex !== -1) {
    products[existingProductIndex] = { ...products[existingProductIndex], ...updatedProduct };
    fs.writeFileSync('./src/routes/productos.json', JSON.stringify(products, null, 2));
    res.json(products[existingProductIndex]);
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

// Ruta DELETE para eliminar un producto por ID
router.delete('/:pid', (req, res) => {
  const productId = req.params.pid;

  // Implementa la lógica para eliminar un producto en 'productos.json'
  const products = JSON.parse(fs.readFileSync('./src/routes/productos.json', 'utf-8'));
  const updatedProducts = products.filter((p) => p.id !== productId);

  if (products.length !== updatedProducts.length) {
    fs.writeFileSync('./src/routes/productos.json', JSON.stringify(updatedProducts, null, 2));
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
});

module.exports = router;
