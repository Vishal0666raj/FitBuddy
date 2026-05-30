const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) { res.status(401); throw new Error('Not authorized, no token'); }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) { res.status(401); throw new Error('User not found'); }
    req.user = user;
    next();
  } catch (e) {
    res.status(401);
    throw new Error('Invalid or expired token');
  }
});

module.exports = { protect };
