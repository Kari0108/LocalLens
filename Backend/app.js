const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db'); // Import your existing database connection

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Import routes
const collaborationRoutes = require('./routes/collaboration');
app.use('/api/collaboration', collaborationRoutes);
console.log('✅ Collaboration routes loaded');

const contactRoutes = require('./routes/contact');
app.use('/api/contact', contactRoutes);
console.log('✅ Contact routes loaded');

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
console.log('✅ Auth routes loaded');

// Modified catch-all route - using a more specific path instead of '*'
app.get('/', (req, res) => {
  console.log('Serving index.html for root path');
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Handle specific paths instead of using wildcard
app.use((req, res) => {
  console.log(`Serving index.html for path: ${req.path}`);
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🔍 Health check available at http://localhost:${PORT}/api/health`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Try a different port.`);
  } else {
    console.error('❌ Server error:', error.message);
  }
});