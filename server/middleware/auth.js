// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify token middleware
exports.protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.userId).select('-password');

        // Ensure user actually exists in DB
        if (!req.user) {
            return res.status(401).json({ msg: 'User validation failed: User not found' });
        }

        // Manually add userId since Mongoose document object uses _id
        req.user.userId = req.user._id;

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Role based access control
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: 'User role not authorized' });
        }
        next();
    };
};
