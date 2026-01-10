const express = require('express');
const { getDashboard, getProfile, updateProfile } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and for students only
router.use(protect);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
