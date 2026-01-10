const express = require('express');
const { applyForJob, getMyApplications, getApplicationStats } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes protected
router.use(protect);
router.use(authorize('student')); // Only students can apply

router.get('/stats', getApplicationStats); // New Stats Endpoint
router.post('/:jobId', applyForJob); // Apply to a job
router.get('/my', getMyApplications); // Get my application history

module.exports = router;
