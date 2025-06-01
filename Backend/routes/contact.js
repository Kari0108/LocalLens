const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/submit', (req, res) => {
  console.log('🚀 Contact route hit!');
  console.log('📩 Form data:', req.body);

  const { name, email, subject, message } = req.body;

  // Check if all required fields are present
  if (!name || !email || !subject || !message) {
    console.error('❌ Missing required fields');
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }

  const sql = `
    INSERT INTO contact_messages (name, email, subject, message)
    VALUES (?, ?, ?, ?)
  `;

  console.log('🔍 Executing SQL:', sql);
  console.log('📊 Parameters:', [name, email, subject, message]);

  db.query(sql, [name, email, subject, message], (err, result) => {
    if (err) {
      console.error('❌ MySQL insert error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error: ' + err.message
      });
    }

    console.log('✅ Data inserted:', result);
    console.log('🔢 Inserted ID:', result.insertId);

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
      id: result.insertId
    });
  });
});

// Test route to verify database connection and table
router.get('/test', (req, res) => {
  console.log('Testing database connection...');

  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Database connection test failed:', err);
      return res.status(500).json({ success: false, message: 'Database connection failed' });
    }

    console.log('Database connection test successful:', results);

    // Now test the table
    db.query('SHOW CREATE TABLE contact_messages', (tableErr, tableResults) => {
      if (tableErr) {
        console.error('Table check failed:', tableErr);
        return res.status(500).json({
          success: false,
          message: 'Table does not exist or cannot be accessed',
          error: tableErr.message
        });
      }

      console.log('Table exists:', tableResults);
      res.status(200).json({
        success: true,
        message: 'Database and table connection successful',
        tableInfo: tableResults
      });
    });
  });
});

module.exports = router;