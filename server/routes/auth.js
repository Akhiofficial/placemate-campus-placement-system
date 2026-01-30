// server/routes/auth.js
const express = require('express');
const { signup, login, requestAdminAccess, changePassword, forgotPassword, resetPassword, updateDetails, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/request-admin', requestAdminAccess);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

// Protected route - change password (requires authentication)
router.put('/change-password', protect, changePassword);
router.put('/update-details', protect, updateDetails);
router.get('/me', protect, getMe);

// Social Auth Routes
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Google
router.get('/google', (req, res, next) => {
    let role = req.query.role;
    if (role !== 'student' && role !== 'company') {
        role = 'student';
    }
    passport.authenticate('google', { scope: ['profile', 'email'], state: role })(req, res, next);
});

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=GoogleAuthFailed` }),
    (req, res) => {
        const payload = { userId: req.user.id, role: req.user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/success?token=${token}`);
    }
);

module.exports = router;
