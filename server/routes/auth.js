// server/routes/auth.js
const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/signup
router.post('/signup', signup);

// @route   POST /api/auth/login
router.post('/login', login);

module.exports = router;
