// server/controllers/authController.js
const User = require('../models/User');
const AdminRequest = require('../models/AdminRequest');
const jwt = require('jsonwebtoken');

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please provide name, email and password' });
    }

    // Block direct admin signup
    if (role === 'admin') {
        return res.status(403).json({
            msg: 'Direct admin signup is not allowed. Please use the admin request endpoint.',
            endpoint: '/api/auth/request-admin'
        });
    }

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        // Create user (student or company only)
        user = new User({ name, email, password, role: role || 'student' });
        await user.save();
        // Generate token
        const payload = { userId: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Request admin access
// @route   POST /api/auth/request-admin
// @access  Public (with admin key)
exports.requestAdminAccess = async (req, res) => {
    const { name, email, password, adminKey } = req.body;

    if (!name || !email || !password || !adminKey) {
        return res.status(400).json({ msg: 'Please provide name, email, password, and admin key' });
    }

    // Validate admin creation key
    if (adminKey !== process.env.ADMIN_CREATION_KEY) {
        return res.status(403).json({ msg: 'Invalid admin creation key' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        // Check if request already exists
        const existingRequest = await AdminRequest.findOne({ email });
        if (existingRequest) {
            return res.status(400).json({
                msg: 'Admin request already submitted',
                status: existingRequest.status
            });
        }

        // Create admin request (password will be hashed by pre-save hook)
        const adminRequest = new AdminRequest({ name, email, password });
        await adminRequest.save();

        res.status(201).json({
            msg: 'Admin access request submitted successfully. Awaiting Super Admin approval.',
            requestId: adminRequest.id
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if admin is approved
        if (user.role === 'admin' && !user.isApproved) {
            return res.status(403).json({
                msg: 'Admin account is pending approval. Please wait for Super Admin to activate your account.'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { userId: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private (authenticated users)
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    // Validation
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ msg: 'Please provide both old and new password' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ msg: 'New password must be at least 6 characters long' });
    }

    if (oldPassword === newPassword) {
        return res.status(400).json({ msg: 'New password must be different from old password' });
    }

    try {
        // Get user from database (req.user is set by protect middleware)
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Verify old password
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Old password is incorrect' });
        }

        // Update password
        user.password = newPassword;
        await user.save(); // Pre-save hook will hash the new password

        res.json({ msg: 'Password changed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
