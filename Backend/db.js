const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',               // your MySQL username
  password: 'suraj@123',   // your MySQL password
  database: 'PROJECT'    // the database where your table exists
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ MySQL connected');
});

module.exports = db;

