const express = require('express');
const Product = require('../models/Product');
const Router = express.Router();
const {
  verifyTokenAndAuthorize,
  verifyTokenAndAdmin,
} = require('./verifyToken');

//CREATE PRODUCT
Router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(200).json({ newProduct, msg: 'Product added' });
});

//UPDATE PRODUCT
Router.patch('/:id', verifyTokenAndAdmin, async (req, res) => {
  const updatedProduct = await Product.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ updatedProduct, msg: 'Product updated' });
});

//DELETE PRODUCT
Router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  await Product.findOneAndDelete({ _id: req.params.id });
  res.status(200).json({ msg: 'Product deleted' });
});

//GET PRODUCT
Router.get('/:id', async (req, res) => {
  const fetchedProduct = await Product.findOne({ _id: req.params.id });
  res.status(200).json({ fetchedProduct, msg: 'Product fetched' });
});

//GET ALL PRODUCTS
Router.get('/', async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  let products;
  if (qNew) {
    products = await Product.find().sort({ createdAt: -1 }).limit(5);
  } else if (qCategory) {
    products = await Product.find({ categories: { $in: [qCategory] } });
  } else {
    products = await Product.find();
  }

  res.status(200).json({ products, msg: 'Products fetched' });
});

module.exports = Router;
