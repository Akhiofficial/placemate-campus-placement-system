const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const aiController = require('../controllers/aiController');
const multer = require('multer');
const path = require('path');

// Configure Multer for temp storage
const upload = multer({
    dest: 'uploads/temp/', // Temporary execution folder
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    // Allow all files here, validate in controller to ensure we return JSON 200
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

router.post('/chat', protect, aiController.chat);
router.post('/resume-analyze', protect, aiController.resumeAnalyze);
router.post('/job-match', protect, aiController.jobMatch);
router.post('/career-roadmap', protect, aiController.careerRoadmap);

// New Robust Document Upload Route
router.post('/upload-document', protect, upload.single('file'), aiController.uploadDocument);

module.exports = router;
