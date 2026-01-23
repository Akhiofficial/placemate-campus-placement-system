// server/controllers/adminController.js
const User = require('../models/User');
const AdminRequest = require('../models/AdminRequest');
const Application = require('../models/Application');
const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Stats Cards
        // Total Students
        const totalStudents = await User.countDocuments({ role: 'student' });

        // Total Offers & Placed Students
        // Assuming 'Offer' status means placed.
        const offers = await Application.find({ status: 'Offer' }).populate('job');
        const totalOffers = offers.length;

        // Count unique students with offers
        const placedStudentIds = new Set(offers.map(app => app.student.toString()));
        const placedStudents = placedStudentIds.size;

        // Avg Package
        // Calculate average of (min + max) / 2 for all accepted offers
        let totalPackage = 0;
        let packageCount = 0;

        offers.forEach(app => {
            if (app.job) {
                const avgJobPackage = (app.job.salaryMin + app.job.salaryMax) / 2;
                if (!isNaN(avgJobPackage) && avgJobPackage > 0) {
                    totalPackage += avgJobPackage;
                    packageCount++;
                }
            }
        });

        // format to string like "12LPA" or "$120k" - for now just number
        // Assuming salary is in LPA
        const avgPackageVal = packageCount > 0 ? (totalPackage / packageCount).toFixed(1) : 0;
        const avgPackage = `${avgPackageVal} LPA`;

        // 2. Charts Data

        // Placement by Department
        // We need student profiles of placed students
        const placedProfiles = await StudentProfile.find({ user: { $in: Array.from(placedStudentIds) } });

        const deptCounts = {};
        placedProfiles.forEach(profile => {
            const dept = profile.department || 'Unknown';
            deptCounts[dept] = (deptCounts[dept] || 0) + 1;
        });

        const placementByDept = {
            labels: Object.keys(deptCounts),
            data: Object.values(deptCounts)
        };

        // Offers Trend (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // Go back 5 months + current month = 6
        sixMonthsAgo.setDate(1); // Start of that month

        const recentOffers = await Application.find({
            status: 'Offer',
            createdAt: { $gte: sixMonthsAgo }
        }).sort('createdAt');

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Initialize last 6 months buckets
        const trendDataMap = {};
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${months[d.getMonth()]} ${d.getFullYear()}`; // e.g. "Jan 2026" works but let's just use Month for labels
            // Store with a sortable key or just rely on order. 
            // Only need labels like ["Aug", "Sep" ...]
        }

        // Easier way: generate labels for last 6 months chronologically
        const trendLabels = [];
        const trendCounts = [];

        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthName = months[d.getMonth()];
            trendLabels.push(monthName);

            // Count offers in this month
            // Start of Month
            const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
            // End of Month
            const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0);

            const count = recentOffers.filter(o =>
                o.createdAt >= startOfMonth && o.createdAt <= endOfMonth
            ).length;

            trendCounts.push(count);
        }

        const offersTrend = {
            labels: trendLabels,
            data: trendCounts
        };

        // 3. Recent Job Postings
        const recentJobs = await Job.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(); // lean for better performance

        // Need to add applicants count to each job
        // This could be N+1 query problem, but for 5 items it's fine.
        // Better: aggregation. But let's stick to simple loops for MVP.
        const jobsWithStats = await Promise.all(recentJobs.map(async (job) => {
            const applicantCount = await Application.countDocuments({ job: job._id });
            return {
                ...job,
                applicants: applicantCount,
                // formatting date
                date: new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                // mock logo if empty - maybe handle in frontend
            };
        }));


        res.json({
            stats: [
                { title: 'Total Students', value: totalStudents.toLocaleString(), change: '+5%', color: 'bg-blue-100 text-blue-700' },
                { title: 'Placed Students', value: placedStudents.toLocaleString(), change: '+12%', color: 'bg-green-100 text-green-700', progress: totalStudents > 0 ? (placedStudents / totalStudents) * 100 : 0 },
                { title: 'Total Offers', value: totalOffers.toLocaleString(), change: '+8%', color: 'bg-purple-100 text-purple-700' },
                { title: 'Avg Package', value: avgPackage, change: '+10%', color: 'bg-yellow-100 text-yellow-700' },
            ],
            placementByDept,
            offersTrend,
            recentJobs: jobsWithStats
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

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
