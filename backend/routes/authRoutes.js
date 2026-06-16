const express = require('express');
const router = express.Router();

const { register, login, logout, getMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');
const { protect } = require('../middleware/authMiddleware');

/**
 * Auth Routes
 * Base path: /api/auth
 */

// @route  POST /api/auth/register
// @desc   Register a new user
// @access Public
router.post('/register', validateRegister, register);

// @route  POST /api/auth/login
// @desc   Login user and return JWT cookie
// @access Public
router.post('/login', validateLogin, login);

// @route  POST /api/auth/logout
// @desc   Logout user and clear auth cookie
// @access Public
router.post('/logout', logout);

// @route  GET /api/auth/me
// @desc   Get currently logged-in user profile
// @access Private
router.get('/me', protect, getMe);

module.exports = router;
