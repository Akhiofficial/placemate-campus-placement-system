const { getDashboard, getProfile, updateProfile, uploadResume, uploadStudentImage } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const uploadImage = require('../middleware/uploadImage');
const express = require('express');

const router = express.Router();

// All routes are protected and for students only
router.use(protect);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/resume', upload.single('resume'), uploadResume);
router.post('/upload-image', uploadImage.single('image'), uploadStudentImage);

module.exports = router;
