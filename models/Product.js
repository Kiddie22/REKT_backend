const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true, unique: true },
    categories: { type: Array },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const productModel = mongoose.model('product', productSchema);

module.exports = productModel;
