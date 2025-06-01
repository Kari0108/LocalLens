const express = require('express');
const router = express.Router();
const db = require('../db');

// Login route
router.post('/login', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: 'Please provide username, password and role' });
  }

  // Query to check if user exists with given credentials
  const query = 'SELECT * FROM users WHERE username = ? AND password = ? AND role = ?';

  db.query(query, [username, password, role], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error. Please try again later.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // User found - return user data (except password)
    const user = results[0];
    delete user.password;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user
    });
  });
});

// Signup route
router.post('/signup', (req, res) => {
  const { fullname, username, email, location, password, role } = req.body;

  // Validate input
  if (!fullname || !username || !email || !location || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Check if username already exists
  const checkUsernameQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUsernameQuery, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ success: false, message: 'Database error. Please try again later.' });
    }

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: 'Username already exists. Please choose another one.' });
    }

    // Check if email already exists
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error. Please try again later.' });
      }

      if (results.length > 0) {
        return res.status(409).json({ success: false, message: 'Email already exists. Please use another email address.' });
      }

      // Create new user
      const createUserQuery = 'INSERT INTO users (fullname, username, email, location, password, role) VALUES (?, ?, ?, ?, ?, ?)';

      db.query(createUserQuery, [fullname, username, email, location, password, role], (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ success: false, message: 'Database error. Please try again later.' });
        }

        // User created successfully
        return res.status(201).json({
          success: true,
          message: 'User registered successfully',
          userId: results.insertId
        });
      });
    });
  });
});

module.exports = router;