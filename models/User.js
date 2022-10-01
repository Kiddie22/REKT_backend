const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
      unique: [true, 'username already exists'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: [true, 'email already exists'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
