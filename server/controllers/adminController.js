// server/controllers/adminController.js
const User = require('../models/User');
const AdminRequest = require('../models/AdminRequest');

// @desc    Get all pending admin requests
// @route   GET /api/admin/admin-requests
// @access  Private (Super Admin only)
exports.getPendingAdminRequests = async (req, res) => {
    try {
        const requests = await AdminRequest.find({ status: 'pending' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Approve admin request and create user account
// @route   PUT /api/admin/admin-requests/:id/approve
// @access  Private (Super Admin only)
exports.approveAdminRequest = async (req, res) => {
    try {
        const request = await AdminRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ msg: 'Admin request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ msg: `Request already ${request.status}` });
        }

        // Check if user already exists (shouldn't happen, but add safety check)
        const existingUser = await User.findOne({ email: request.email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        // Create admin user account
        const adminUser = new User({
            name: request.name,
            email: request.email,
            password: request.password, // Already hashed by AdminRequest pre-save hook
            role: 'admin',
            isApproved: true,
            approvedBy: req.user.id,
            approvedAt: new Date(),
        });

        // Save without hashing again (password is already hashed)
        adminUser.isModified = () => false; // Trick to bypass pre-save hook
        await adminUser.save();

        // Update request status
        request.status = 'approved';
        request.reviewedBy = req.user.id;
        request.reviewedAt = new Date();
        await request.save();

        res.json({
            msg: 'Admin request approved successfully',
            user: {
                id: adminUser.id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Reject admin request
// @route   PUT /api/admin/admin-requests/:id/reject
// @access  Private (Super Admin only)
exports.rejectAdminRequest = async (req, res) => {
    const { reason } = req.body;

    try {
        const request = await AdminRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ msg: 'Admin request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ msg: `Request already ${request.status}` });
        }

        request.status = 'rejected';
        request.reviewedBy = req.user.id;
        request.reviewedAt = new Date();
        request.rejectionReason = reason || 'No reason provided';
        await request.save();

        res.json({ msg: 'Admin request rejected', request });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all admin requests (pending, approved, rejected)
// @route   GET /api/admin/admin-requests/all
// @access  Private (Super Admin only)
exports.getAllAdminRequests = async (req, res) => {
    try {
        const requests = await AdminRequest.find()
            .select('-password')
            .populate('reviewedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
