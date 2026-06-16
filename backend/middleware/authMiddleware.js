const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

const parseCookies = (cookieHeader = '') =>
  cookieHeader.split(';').reduce((cookies, cookie) => {
    const [name, ...rest] = cookie.split('=');
    if (!name || rest.length === 0) return cookies;
    cookies[name.trim()] = decodeURIComponent(rest.join('=').trim());
    return cookies;
  }, {});

/**
 * Protect Middleware
 * Verifies JWT token from Authorization header or HttpOnly cookie
 * Attaches authenticated user object to req.user
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Prefer Bearer token if provided
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers.cookie) {
    const cookies = parseCookies(req.headers.cookie);
    token = cookies.token;
  }

  // If no token found, deny access
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided. Please login.',
    });
  }

  try {
    // Verify token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request object (excluding password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid. User no longer exists.',
      });
    }

    next();
  } catch (error) {
    // Handle token verification errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Please login again.',
    });
  }
});

module.exports = { protect };
