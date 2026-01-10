// server/routes/auth.js
const express = require('express');
const { signup, login, requestAdminAccess, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/request-admin', requestAdminAccess);

// Protected route - change password (requires authentication)
router.put('/change-password', protect, changePassword);

module.exports = router;
