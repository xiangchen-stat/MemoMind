/**
 * Express router for handling user authentication and registration.
 * Signup and login with bcrypt for password hashing
 * 
 * @author Albert Le
 */

const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Handles new user registration.
 * 
 * Accepts a POST request with user's name, email, and password, checks if a user with the same email
 * already exists, hashes the password using bcrypt, and creates a new user in the database.
 * 
 */

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

/**
 * Handles user login.
 * 
 * Accepts a POST request with user's name, email, and password, finds the user by email, compares the
 * submitted password with the hashed password stored in the database, then either displays a confirmation or an error.
 * 
 */

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
