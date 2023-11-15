const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");



const Product = require ("../dao/models/productModel.js");

const router = express.Router();

const filePath = path.resolve(__dirname, "productos.json");

router.post('/crear-producto', async (req, res) => {
  try {
    

    var nuevoProducto = new Product(req.body);
    

    
    const productoGuardado = await nuevoProducto.save();

    res.status(201).json({ message: 'Producto creado con éxito', producto: productoGuardado });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

module.exports = router;