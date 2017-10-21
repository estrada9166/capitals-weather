const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please supply an email address'
  },
  password: {
    type: String,
    required: 'Please supply a password'
  },
  token: {
    type: String,
    required: 'Please supply a token',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
