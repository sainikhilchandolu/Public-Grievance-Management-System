const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 * Signs a JWT token with the user's ID
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {string} - Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = generateToken;
