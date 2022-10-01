const express = require('express');
const User = require('../models/User');
const Router = express.Router();
const {
  verifyTokenAndAuthorize,
  verifyTokenAndAdmin,
} = require('./verifyToken');

//UPDATE USER
Router.patch('/:id', verifyTokenAndAuthorize, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString();
  }

  const updatedUser = await User.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  const { password, ...response } = updatedUser._doc;
  res.status(200).json(response);
});

//DELETE USER
Router.delete('/:id', verifyTokenAndAuthorize, async (req, res) => {
  const deletedUser = await User.findOneAndDelete({ _id: req.params.id });
  res.status(200).json({ msg: 'User deleted' });
});

//GET USER
Router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  const fetchedUser = await User.findOne({ _id: req.params.id });
  const { password, ...response } = fetchedUser._doc;
  res.status(200).json({ response, msg: 'User fetched' });
});

//GET ALL USERS
Router.get('/find', verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  const fetchedUsers = query
    ? await User.find().sort({ _id: -1 }).limit(5)
    : await User.find();
  res.status(200).json({ fetchedUsers, msg: 'User fetched' });
});

//GET USER STATS
Router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  const data = await User.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    {
      $project: {
        month: { $month: '$createdAt' },
      },
    },
    {
      $group: {
        _id: '$month',
        total: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json(data);
});

module.exports = Router;
