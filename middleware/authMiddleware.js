import jwt from 'jsonwebtoken';

// Verify JWT token and attach user to request
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Check if user is student
export const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Access denied. Student only.' });
  }
  next();
};

// Check if user is admin or the user themselves
export const isAdminOrSelf = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.id === req.params.id) {
    return next();
  }
  return res.status(403).json({ message: 'Access denied.' });
};
