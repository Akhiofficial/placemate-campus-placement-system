const express = require('express');
const {
    getDashboardStats,
    getRecentPostings,
    getCompanyJobs,
    getJobPostingsStats,
    updateJobStatus,
    getApplicationsStats,
    getCompanyApplications,
    updateApplicationStatus,
    getInterviewStats,
    getCompanyInterviews,
    scheduleInterview
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes protected and restricted to company role
router.use(protect);
router.use(authorize('company'));

// @route   GET /api/company/dashboard-stats
// @desc    Get stats for company dashboard
// @access  Private (Company)
router.get('/dashboard-stats', getDashboardStats);

// @route   GET /api/company/recent-postings
// @desc    Get recent job postings for company dashboard
// @access  Private (Company)
router.get('/recent-postings', getRecentPostings);

// Job Postings Page
// @route   GET /api/company/jobs
// @desc    Get all company jobs with detailed stats
// @access  Private (Company)
router.get('/jobs', getCompanyJobs);

// @route   GET /api/company/job-stats
// @desc    Get aggregate stats for job postings page
// @access  Private (Company)
router.get('/job-stats', getJobPostingsStats);

// @route   PUT /api/company/jobs/:id/status
// @desc    Update job status
// @access  Private (Company)
router.put('/jobs/:id/status', updateJobStatus);

// Applications Management Page
// @route   GET /api/company/applications-stats
// @desc    Get aggregate stats for applications page
// @access  Private (Company)
router.get('/applications-stats', getApplicationsStats);

// @route   GET /api/company/applications
// @desc    Get all applications for company jobs
// @access  Private (Company)
router.get('/applications', getCompanyApplications);

// @route   PUT /api/company/applications/:id/status
// @desc    Update application status (Shortlist, Reject, etc.)
// @access  Private (Company)
router.put('/applications/:id/status', updateApplicationStatus);

// Interview Schedule Page
// @route   GET /api/company/interviews-stats
// @desc    Get interview stats
// @access  Private (Company)
router.get('/interviews-stats', getInterviewStats);

// @route   GET /api/company/interviews
// @desc    Get company interviews
// @access  Private (Company)
router.get('/interviews', getCompanyInterviews);

// @route   POST /api/company/schedule-interview
// @desc    Schedule interview & notify student
// @access  Private (Company)
router.post('/schedule-interview', scheduleInterview);



module.exports = router;
