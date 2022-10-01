const express = require('express');
const Order = require('../models/Order');
const Router = express.Router();
const {
  verifyTokenAndAuthorize,
  verifyTokenAndAdmin,
} = require('./verifyToken');

//CREATE ORDER
Router.post('/', verifyTokenAndAuthorize, async (req, res) => {
  const newOrder = await Order.create(req.body);
  res.status(200).json({ newOrder, msg: 'Orders added' });
});

//UPDATE ORDER
Router.patch('/:id', verifyTokenAndAdmin, async (req, res) => {
  const updatedCart = await Order.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ updatedCart, msg: 'Orders updated' });
});

//DELETE ORDER
Router.delete('/:id', verifyTokenAndAuthorize, async (req, res) => {
  await Order.findOneAndDelete({ _id: req.params.id });
  res.status(200).json({ msg: 'Orders deleted' });
});

//GET MONTHLY STATS
Router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  const income = await Order.aggregate([
    { $match: { createdAt: { $gte: previousMonth } } },
    {
      $project: {
        month: { $month: '$createdAt' },
        sales: '$amount',
      },
    },
    {
      $group: {
        _id: '$month',
        total: { $sum: '$sales' },
      },
    },
  ]);

  res.status(200).json(income);
});

//GET USER ORDERS
Router.get('/:id', verifyTokenAndAuthorize, async (req, res) => {
  const fetchedOrders = await Order.find({ userId: req.params.id });
  res.status(200).json({ fetchedOrders, msg: 'Orders fetched' });
});

//GET ALL
Router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const orders = await Order.find();
  res.status(200).json({ orders, msg: 'Orders fetched' });
});

module.exports = Router;
