const jwt = require('jsonwebtoken');

// Use the same JWT secret approach as in auth routes
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add user from payload
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid' });
  }
};

// Role-based access middleware
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const hasRole = roles.includes(req.user.role);
    if (!hasRole) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

module.exports = { verifyToken, checkRole };