// server/routes/admin.js
const express = require('express');
const {
    getPendingAdminRequests,
    approveAdminRequest,
    rejectAdminRequest,
    getAllAdminRequests,
    getDashboardStats,
    getStudentStats,
    getAllStudents,
    getCompanyStats,
    getAllCompanies,
    approveCompany,
    toggleBlockCompany,
    getJobStats,
    getAllJobs
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Get pending admin requests
router.get('/admin-requests', getPendingAdminRequests);

// Get dashboard statistics
router.get('/dashboard-stats', getDashboardStats);

// Student Management Routes
router.get('/students/stats', getStudentStats);
router.get('/students', getAllStudents);

// Company Management Routes
router.get('/companies/stats', getCompanyStats);
router.get('/companies', getAllCompanies);
router.put('/companies/:id/approve', approveCompany);
router.put('/companies/:id/toggle-block', toggleBlockCompany);

// Job Management Routes
router.get('/jobs/stats', getJobStats);
router.get('/jobs', getAllJobs);

// Get all admin requests (including approved/rejected)
router.get('/admin-requests/all', getAllAdminRequests);

// Approve admin request
router.put('/admin-requests/:id/approve', approveAdminRequest);

// Reject admin request
router.put('/admin-requests/:id/reject', rejectAdminRequest);

module.exports = router;
