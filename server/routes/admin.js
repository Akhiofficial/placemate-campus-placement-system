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
    updateCompanyStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin', 'superadmin'));

// Get pending admin requests
router.get('/admin-requests', getPendingAdminRequests);

// Get dashboard stats
router.get('/dashboard-stats', getDashboardStats);

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
