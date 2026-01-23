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
    scheduleInterview,
    updateInterviewStatus,
    getInterviewById,
    updateInterview,
    deleteInterview,
    getCompanyProfile,
    updateCompanyProfile,
    getApplicantDetails,

    createJob,
    updateJob,
    getCompanyPublicProfile
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const uploadImage = require('../middleware/uploadImage');

const router = express.Router();

// Public/Shared Routes (Still Protected by Login)
router.use(protect);

// @route   GET /api/company/public/:id
// @desc    Get public company profile (accessible by students)
// @access  Private (All Roles)
router.get('/public/:id', getCompanyPublicProfile);

// Company Only Routes
router.use(authorize('company'));

// @route   GET /api/company/dashboard-stats
// @desc    Get stats for company dashboard
// @access  Private (Company)
router.get('/dashboard-stats', getDashboardStats);

// @route   POST /api/company/jobs
// @desc    Create a new job posting
// @access  Private (Company)
router.post('/jobs', createJob);

// @route   PUT /api/company/jobs/:id
// @desc    Update a job posting
// @access  Private (Company)
router.put('/jobs/:id', updateJob);

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
// @desc    Get all applications for company jobs
// @access  Private (Company)
router.get('/applications', getCompanyApplications);

// @route   GET /api/company/applications/:id
// @desc    Get single application details with full student profile
// @access  Private (Company)
router.get('/applications/:id', getApplicantDetails);

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



// @route   PUT /api/company/interviews/:id/status
// @desc    Update interview status
// @access  Private (Company)
router.put('/interviews/:id/status', updateInterviewStatus);

// @route   GET /api/company/interviews/:id
// @desc    Get single interview details
// @access  Private (Company)
router.get('/interviews/:id', getInterviewById);

// @route   PUT /api/company/interviews/:id
// @desc    Update interview details
// @access  Private (Company)
router.put('/interviews/:id', updateInterview);

// @route   DELETE /api/company/interviews/:id
// @desc    Delete interview
// @access  Private (Company)
router.delete('/interviews/:id', deleteInterview);

// @route   GET /api/company/profile
// @desc    Get company profile
// @access  Private (Company)
router.get('/profile', getCompanyProfile);

// @route   PUT /api/company/profile
// @desc    Update company profile
// @access  Private (Company)
router.put('/profile', protect, authorize('company'), uploadImage.fields([{ name: 'logo', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), updateCompanyProfile);


module.exports = router;
