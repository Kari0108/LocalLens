const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/submit', (req, res) => {
  const {
    title, brand, type, location,
    description, option, email, phone
  } = req.body;

  const sql = `
    INSERT INTO collaboration_offers
    (title, brand_name, collaboration_type, location, description, collaboration_option, contact_email, contact_phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, brand, type, location, description, option, email, phone], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.status(200).json({ success: true, message: 'Collaboration listed successfully!' });
  });
});

module.exports = router;

