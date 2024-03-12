const mongoose = require('mongoose');

/** 
 * User Schema definition for MongoDB database
 * {Object} User
 * {string} name
 * {string} email
 * {string} password
 *  */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
