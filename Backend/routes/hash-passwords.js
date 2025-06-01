// hash-passwords.js
// Simple utility to hash passwords manually for setup

const bcrypt = require('bcrypt');

// Function to hash a password
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    return null;
  }
}

// Sample passwords from login.html
const passwords = [
  'sarawalker123',
  'priyasharma123',
  'rahulsharma123'
];

// Hash all passwords
async function hashAll() {
  for (const password of passwords) {
    const hashedPassword = await hashPassword(password);
    console.log(`Password: ${password} => Hashed: ${hashedPassword}`);
  }
}

// Run the hashing
hashAll();

/*
To run this utility:
1. Save this file as hash-passwords.js
2. Run it with Node.js: node hash-passwords.js
3. Copy the hashed values to use in your SQL insert statements
*/