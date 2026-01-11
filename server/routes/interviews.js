const express = require('express');
const { getMyInterviews, getInterviewById, rescheduleInterview, syncCalendar } = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes protected
router.use(protect);
router.use(authorize('student'));

router.get('/', getMyInterviews); // Get list
router.get('/sync/ics', syncCalendar); // Sync Calendar (ICS)
router.get('/:id', getInterviewById); // Get details
router.post('/:id/reschedule', rescheduleInterview); // Reschedule

module.exports = router;
