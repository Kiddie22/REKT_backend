const express = require('express');
const Router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);

Router.post('/payment', (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: 'usd',
    },
    (stripeError, stripeRes) => {
      if (stripeError) {
        res.status(500).json({ msg: stripeError });
      } else {
        res.status(200).json({ msg: stripeRes });
      }
    }
  );
});

module.exports = Router;
