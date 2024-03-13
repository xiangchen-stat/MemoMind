const mongoose = require('mongoose');

/**
 * User Schema definition for MongoDB database.
 * Includes fields for name, email, and password.
 * @typedef {Object} User
 * @property {string} name - The user's name.
 * @property {string} email - The user's email address. Must be unique.
 * @property {string} password - The user's password.

 * @author Albert Le
 * 
 */
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
