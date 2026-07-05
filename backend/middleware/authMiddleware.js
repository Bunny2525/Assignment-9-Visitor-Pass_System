const jwt = require('jsonwebtoken');

// 1. Authentication: Who are you?
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded payload (userId, role) to the request object
      req.user = decoded;
      
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// 2. Authorization: What are you allowed to do? (The missing RBAC feature)
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user was populated by the protect function right before this ran
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access denied: No role assigned' });
    }

    // Check if the user's role exists in the array of allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: Your role (${req.user.role}) is not authorized to access this route.` 
      });
    }

    // If they pass the check, move to the controller
    next();
  };
};

// Export both middlewares
module.exports = { protect, authorizeRoles };