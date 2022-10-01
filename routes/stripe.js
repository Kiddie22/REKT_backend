const express = require('express');
const Router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

Router.post('/payment', (req, res) => {
  stripe.charges(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: 'usd',
    },
    (err, res) => {
      if (err) {
        res.status(500).json({ msg: err });
      } else {
        res.status(200).json({ msg: res });
      }
    }
  );
});

module.exports = Router;
