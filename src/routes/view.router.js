const express = require('express');
const router = express.Router();


const Product = require("../dao/models/productModel.js");


router.get('/', async (req, res) => {

  var productos = await Product.find();

  console.log(productos);

  res.render('index', { productos });
});





module.exports = router;

