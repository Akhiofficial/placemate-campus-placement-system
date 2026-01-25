// server/routes/admin.js
const express = require('express');
const {
    getPendingAdminRequests,
    approveAdminRequest,
    rejectAdminRequest,
    getAllAdminRequests,
    getDashboardStats,
    getSuperAdminStats,
    getStudentsWithStats,
    deleteStudent,
    updateStudentStatus,
    updateStudentDetails,
    createStudent,
    importStudents,
    createCompany,
    createJob,
    getAllCompanies,
    deleteCompany,
    updateCompanyStatus,
    getJobAnalytics,
    getAllJobsAdmin,
    deleteJobAdmin,
    updateJobStatusAdmin,
    updateJobAdmin,
    exportJobsCSV,
    getApplicationStats,
    getAllApplications,
    exportApplicationsCSV,
    getStudentFullProfile,
    updateApplicationStatus,
    getApplicationDetails,
    getAdminProfile,
    updateAdminProfile,
    getSystemSettings,
    updateSystemSettings,
    uploadAdminAvatar
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const uploadImage = require('../middleware/uploadImage');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin', 'superadmin'));

// Get pending admin requests
router.get('/admin-requests', getPendingAdminRequests);

// Get dashboard stats
router.get('/dashboard-stats', getDashboardStats);

// Get Job Page Analytics
router.get('/job-analytics', getJobAnalytics);

// Get Application Stats
router.get('/application-stats', getApplicationStats);

// Get All Applications (Admin Table)
router.get('/applications', getAllApplications);

// Export Jobs CSV
router.get('/jobs/export', exportJobsCSV);

// Export Applications CSV
router.get('/applications/export', exportApplicationsCSV);

// Get Student Full Profile
router.get('/students/:id/profile', getStudentFullProfile);

// Get Application Details
router.get('/applications/:id/details', getApplicationDetails);

// Update Application Status
router.put('/applications/:id/status', updateApplicationStatus);

// Admin Profile
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);
router.post('/upload-avatar', uploadImage.single('image'), uploadAdminAvatar);

// System Settings
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

// Get all admin requests (including approved/rejected)
router.get('/admin-requests/all', getAllAdminRequests);

// Get Super Admin Stats
router.get('/super-admin-stats', getSuperAdminStats);

// Get Student Directory with Stats
router.get('/students-with-stats', getStudentsWithStats);

// Create Student (Manual)
router.post('/students', createStudent);

// Import Students (CSV)
router.post('/students/import', importStudents);

// Create Company (Manual)
router.post('/companies', createCompany);

// Get All Companies
router.get('/companies', getAllCompanies);

// Create Job (Manual)
router.post('/jobs', createJob);

// Get All Jobs (List with filters)
router.get('/jobs-list', getAllJobsAdmin);

// Delete Job
router.delete('/jobs/:id', deleteJobAdmin);

// Update Job Status
router.put('/jobs/:id/status', updateJobStatusAdmin);

// Update Job Details
router.put('/jobs/:id', updateJobAdmin);

// Delete Company
router.delete('/companies/:id', deleteCompany);

// Update Company Status (Block/Unblock)
router.put('/companies/:id/status', updateCompanyStatus);

// Delete Student
router.delete('/students/:id', deleteStudent);

// Update Student Status (Block/Unblock)
router.put('/students/:id/status', updateStudentStatus);

// Update Student Details
router.put('/students/:id', updateStudentDetails);

// Approve admin request
router.put('/admin-requests/:id/approve', approveAdminRequest);

// Reject admin request
router.put('/admin-requests/:id/reject', rejectAdminRequest);

module.exports = router;
