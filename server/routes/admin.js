// server/routes/admin.js
const express = require('express');
const {
    getPendingAdminRequests,
    approveAdminRequest,
    rejectAdminRequest,
    getAllAdminRequests
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Get pending admin requests
router.get('/admin-requests', getPendingAdminRequests);

// Get all admin requests (including approved/rejected)
router.get('/admin-requests/all', getAllAdminRequests);

// Approve admin request
router.put('/admin-requests/:id/approve', approveAdminRequest);

// Reject admin request
router.put('/admin-requests/:id/reject', rejectAdminRequest);

module.exports = router;
