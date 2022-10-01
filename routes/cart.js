const express = require('express');
const Cart = require('../models/Cart');
const Router = express.Router();
const {
  verifyTokenAndAuthorize,
  verifyTokenAndAdmin,
} = require('./verifyToken');

//CREATE CART
Router.post('/', verifyTokenAndAuthorize, async (req, res) => {
  const newCart = await Cart.create(req.body);
  res.status(200).json({ newCart, msg: 'Cart added' });
});

//UPDATE CART
Router.patch('/:id', verifyTokenAndAuthorize, async (req, res) => {
  const updatedCart = await Cart.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ updatedCart, msg: 'Cart updated' });
});

//DELETE CART
Router.delete('/:id', verifyTokenAndAuthorize, async (req, res) => {
  await Cart.findOneAndDelete({ _id: req.params.id });
  res.status(200).json({ msg: 'Cart deleted' });
});

//GET USER CART
Router.get('/:id', verifyTokenAndAuthorize, async (req, res) => {
  const fetchedCart = await Cart.findOne({ userId: req.params.id });
  res.status(200).json({ fetchedCart, msg: 'Cart fetched' });
});

//GET ALL
Router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const carts = await Cart.find();
  res.status(200).json({ carts, msg: 'Carts fetched' });
});

module.exports = Router;
