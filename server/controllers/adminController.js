// server/controllers/adminController.js
const User = require('../models/User');
const AdminRequest = require('../models/AdminRequest');
const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const CompanyProfile = require('../models/CompanyProfile');

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

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Total Students
        const totalStudents = await StudentProfile.countDocuments();

        // 2. Placed Students (Unique students with at least one 'Offer')
        const placedStudentIds = await Application.distinct('student', { status: 'Offer' });
        const placedStudentsCount = placedStudentIds.length;

        // 3. Total Offers
        const totalOffers = await Application.countDocuments({ status: 'Offer' });

        // 4. Average Package (Approximation based on Job salaryMax)
        // Find all applications with status 'Offer', populate job to get salaryMax
        const offerApps = await Application.find({ status: 'Offer' }).populate('job', 'salaryMax');

        let totalPackage = 0;
        let offersWithSalary = 0;

        offerApps.forEach(app => {
            if (app.job && app.job.salaryMax) {
                totalPackage += app.job.salaryMax;
                offersWithSalary++;
            }
        });

        const avgPackage = offersWithSalary > 0
            ? (totalPackage / offersWithSalary).toFixed(1) + ' LPA'
            : '0 LPA';

        // 5. Placement by Department (Distribution of Offers)
        // We need to look up StudentProfile for the students who got offers
        // Aggregation pipeline:
        // Match applications with status 'Offer'
        // Lookup student profile to get department
        // Group by department
        const placementByDept = await Application.aggregate([
            { $match: { status: 'Offer' } },
            {
                $lookup: {
                    from: 'studentprofiles',
                    localField: 'student',
                    foreignField: 'user',
                    as: 'studentProfile'
                }
            },
            { $unwind: '$studentProfile' },
            {
                $group: {
                    _id: '$studentProfile.department',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format for frontend: { label: 'CS', value: 10 }
        const formattedPlacementByDept = placementByDept.map(item => ({
            department: item._id || 'Unknown',
            count: item.count
        }));


        // 6. Offers Trend (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); // Start of that month

        const offersTrend = await Application.aggregate([
            {
                $match: {
                    status: 'Offer',
                    updatedAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$updatedAt' },
                        year: { $year: '$updatedAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Map month numbers to names
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const formattedOffersTrend = offersTrend.map(item => ({
            month: monthNames[item._id.month - 1],
            year: item._id.year,
            count: item.count
        }));




        // Helper to calculate percentage growth (mock logic for now if no historical data exists)
        const calculateGrowth = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        // --- Growth Metrics (Mocked/Estimated for now as we lack historical snapshots) ---
        // In a real app, you'd query data created last month vs this month.
        // Simplified Logic: Count docs created > 30 days ago as "previous"
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const prevStudents = await StudentProfile.countDocuments({ createdAt: { $lt: thirtyDaysAgo } });
        const studentGrowth = calculateGrowth(totalStudents, prevStudents);

        const prevOffers = await Application.countDocuments({ status: 'Offer', updatedAt: { $lt: thirtyDaysAgo } });
        const offerGrowth = calculateGrowth(totalOffers, prevOffers);

        // Placed Students Growth
        const prevPlacedIds = await Application.distinct('student', { status: 'Offer', updatedAt: { $lt: thirtyDaysAgo } });
        const prevPlacedCount = prevPlacedIds.length;
        const placedGrowth = calculateGrowth(placedStudentsCount, prevPlacedCount);

        // Avg Package Growth (Mocked as it's hard to reconstruct exact historic avg without snapshots)
        const avgPackageGrowth = 10; // Hardcoded for demo matching the UI (+10%)


        // 7. Recent Job Postings with Top Applicants
        const recentJobs = await Job.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // Get applicant count & avatars for each job
        const jobsWithStats = await Promise.all(recentJobs.map(async (job) => {
            const applications = await Application.find({ job: job._id })
                .sort({ createdAt: -1 })
                .select('student')
                .populate({
                    path: 'student',
                    select: '_id', // Get user ID
                })
                .lean();

            const applicantsCount = applications.length;

            // Get avatars for top 3 applicants
            // We need to fetch StudentProfiles for these users
            const topApplicantUserIds = applications.slice(0, 3).map(app => app.student?._id).filter(id => id);

            const topProfiles = await StudentProfile.find({ user: { $in: topApplicantUserIds } })
                .select('profilePictureUrl');

            const avatars = topProfiles.map(p => p.profilePictureUrl || '').filter(url => url);

            return {
                ...job,
                applicants: applicantsCount,
                applicantAvatars: avatars
            };
        }));

        res.json({
            totalStudents: { value: totalStudents, growth: studentGrowth },
            placedStudents: { value: placedStudentsCount, growth: placedGrowth },
            totalOffers: { value: totalOffers, growth: offerGrowth },
            avgPackage: { value: avgPackage, growth: avgPackageGrowth },
            placementByDept: formattedPlacementByDept,
            offersTrend: formattedOffersTrend,
            recentJobs: jobsWithStats
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get student statistics for Students Page
// @route   GET /api/admin/students/stats
// @access  Private (Admin only)
exports.getStudentStats = async (req, res) => {
    try {
        const totalRegistered = await StudentProfile.countDocuments();

        // Stats by Status
        const statusStats = await StudentProfile.aggregate([
            {
                $group: {
                    _id: '$placementStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        const getCount = (status) => {
            const found = statusStats.find(s => s._id === status);
            return found ? found.count : 0;
        };

        const placedCount = getCount('Placed');
        const lookingCount = getCount('Seeking');
        const interningCount = getCount('Interning'); // Can calculate total working if needed

        // Avg CGPA
        const avgCgpaResult = await StudentProfile.aggregate([
            {
                $group: {
                    _id: null,
                    avg: { $avg: '$cgpa' }
                }
            }
        ]);
        const avgCGPA = avgCgpaResult.length > 0 ? avgCgpaResult[0].avg.toFixed(1) : 0;

        // Demographics (Dept)
        const demographics = await StudentProfile.aggregate([
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 }
                }
            }
        ]);
        const formattedDemographics = demographics.map(d => ({
            department: d._id || 'Unknown',
            count: d.count
        }));

        // Top Skills
        const topSkills = await StudentProfile.aggregate([
            { $unwind: '$skills' },
            {
                $group: {
                    _id: '$skills',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]);
        const formattedTopSkills = topSkills.map(s => ({
            skill: s._id,
            count: s.count
        }));

        res.json({
            totalRegistered,
            placedStudents: placedCount,
            lookingForJob: lookingCount,
            avgCGPA,
            demographics: formattedDemographics,
            topSkills: formattedTopSkills,
            statusDistribution: statusStats.map(s => ({ status: s._id, count: s.count }))
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all students with filtering
// @route   GET /api/admin/students
// @access  Private (Admin only)
exports.getAllStudents = async (req, res) => {
    try {
        const { search, department, status, page = 1, limit = 10 } = req.query;

        let query = {};

        if (department && department !== 'All Depts') {
            query.department = department;
        }

        if (status && status !== 'All Status') {
            query.placementStatus = status;
        }

        // Search by Name (via User) or RollNo
        // Since Name is in User model, we might need a separate query or aggregation.
        // For simplicity and speed in MONGOOSE, we can fetch matching Users first if search is present.
        if (search) {
            const userIds = await User.find({
                name: { $regex: search, $options: 'i' },
                role: 'student'
            }).distinct('_id');

            query.$or = [
                { user: { $in: userIds } },
                { universityRollNo: { $regex: search, $options: 'i' } }
            ];
        }

        const stats = await StudentProfile.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await StudentProfile.countDocuments(query);

        const students = stats.map(profile => ({
            _id: profile._id,
            userId: profile.user?._id,
            name: profile.user?.name || 'N/A',
            email: profile.user?.email || 'N/A',
            rollNo: profile.universityRollNo || 'N/A',
            department: profile.department || 'N/A',
            cgpa: profile.cgpa,
            skills: profile.skills,
            placementStatus: profile.placementStatus,
            profilePictureUrl: profile.profilePictureUrl
        }));

        res.json({
            students,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalStudents: count
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get company statistics
// @route   GET /api/admin/companies/stats
// @access  Private (Admin only)
exports.getCompanyStats = async (req, res) => {
    try {
        const totalCompanies = await User.countDocuments({ role: 'company' });
        const pendingApproval = await User.countDocuments({ role: 'company', isApproved: false });
        const blockedCompanies = await User.countDocuments({ role: 'company', isBlocked: true });

        // Active Hiring: Companies with at least one Open job
        const activeRecruiters = await Job.distinct('postedBy', { status: 'Open' });
        const activeHiringCount = activeRecruiters.length;

        // Industry Distribution
        const industryStats = await CompanyProfile.aggregate([
            {
                $group: {
                    _id: '$industry',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]);

        const formattedIndustryStats = industryStats.map(i => ({
            industry: i._id || 'Unspecified',
            count: i.count
        }));

        // Growth Trend (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const growthTrend = await User.aggregate([
            {
                $match: {
                    role: 'company',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedTrend = growthTrend.map(item => ({
            month: monthNames[item._id.month - 1],
            year: item._id.year,
            count: item.count
        }));

        res.json({
            totalCompanies: { value: totalCompanies, trend: +12 },
            pendingApproval: { value: pendingApproval },
            activeHiring: { value: activeHiringCount },
            blockedCompanies: { value: blockedCompanies },
            industryDistribution: formattedIndustryStats,
            growthTrend: formattedTrend
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all companies with filtering
// @route   GET /api/admin/companies
// @access  Private (Admin only)
exports.getAllCompanies = async (req, res) => {
    try {
        const { search, industry, status, page = 1, limit = 10 } = req.query;

        let query = { role: 'company' };

        if (status === 'Pending') query.isApproved = false;
        if (status === 'Approved') { query.isApproved = true; query.isBlocked = false; }
        if (status === 'Blocked') query.isBlocked = true;

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (industry && industry !== 'All Industries') {
            const profiles = await CompanyProfile.find({ industry }).select('user');
            const userIds = profiles.map(p => p.user);
            if (query.name) {
                query._id = { $in: userIds, ...query };
            } else {
                query._id = { $in: userIds };
            }
        }

        const companies = await User.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await User.countDocuments(query);

        const enrichedCompanies = await Promise.all(companies.map(async (user) => {
            const profile = await CompanyProfile.findOne({ user: user._id }).select('companyName industry logo location');
            const activeJobs = await Job.countDocuments({ postedBy: user._id, status: 'Open' });

            let statusLabel = 'Pending';
            if (user.isBlocked) statusLabel = 'Blocked';
            else if (user.isApproved) statusLabel = 'Approved';

            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                companyName: profile?.companyName || user.name,
                industry: profile?.industry || 'N/A',
                logo: profile?.logo,
                location: profile?.location || 'N/A',
                activeJobs,
                status: statusLabel,
                joinedDate: user.createdAt
            };
        }));

        res.json({
            companies: enrichedCompanies,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalCompanies: count
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Approve company
// @route   PUT /api/admin/companies/:id/approve
// @access  Private (Admin only)
exports.approveCompany = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== 'company') {
            return res.status(404).json({ msg: 'Company not found' });
        }

        user.isApproved = true;
        user.approvedBy = req.user.id;
        user.approvedAt = new Date();
        await user.save();

        res.json({ msg: 'Company approved successfully' });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// @desc    Toggle block status
// @route   PUT /api/admin/companies/:id/toggle-block
// @access  Private (Admin only)
exports.toggleBlockCompany = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== 'company') {
            return res.status(404).json({ msg: 'Company not found' });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({ msg: `Company ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, isBlocked: user.isBlocked });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

// @desc    Get job statistics
// @route   GET /api/admin/jobs/stats
// @access  Private (Admin only)
exports.getJobStats = async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments();
        const activeOpenings = await Job.countDocuments({ status: 'Open' });
        const pendingApproval = await Job.countDocuments({ status: 'Pending' });
        const totalApplications = await Application.countDocuments();

        // Job Posting Trends (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const postingTrend = await Job.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedTrend = postingTrend.map(item => ({
            month: monthNames[item._id.month - 1],
            year: item._id.year,
            count: item.count
        }));

        // Popular Roles (by application volume)
        const popularRoles = await Application.aggregate([
            {
                $group: {
                    _id: '$job',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'jobs', // Collection name usually plural lowercased
                    localField: '_id',
                    foreignField: '_id',
                    as: 'jobDetails'
                }
            },
            { $unwind: '$jobDetails' },
            {
                $project: {
                    role: '$jobDetails.title',
                    count: 1
                }
            }
        ]);


        res.json({
            totalJobs: { value: totalJobs, growth: +12 },
            activeOpenings: { value: activeOpenings, subText: 'Closing soon: 5' },
            pendingApproval: { value: pendingApproval, status: 'Needs attention' },
            totalApplications: { value: totalApplications, growth: +18 },
            postingTrend: formattedTrend,
            popularRoles: popularRoles.map(r => ({ role: r.role, percentage: 0 })) // Percentage calc requires total logic if needed, simplify for now
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get all jobs with filtering
// @route   GET /api/admin/jobs
// @access  Private (Admin only)
exports.getAllJobs = async (req, res) => {
    try {
        const { search, company, status, page = 1, limit = 10, sort = 'newest' } = req.query;

        let query = {};

        if (status && status !== 'All Jobs') {
            // Map UI filter to DB status
            if (status === 'Active') query.status = 'Open';
            else if (status === 'Drafts') query.status = 'Draft';
            else if (status === 'Closed') query.status = 'Closed';
            else query.status = status;
        }

        if (company) {
            query.company = { $regex: company, $options: 'i' };
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        let sortOption = { createdAt: -1 };
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        // Add more sort options if needed

        const jobs = await Job.find(query)
            .populate('postedBy', 'name email') // Get details of poster
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await Job.countDocuments(query);

        // Enrich with Application data
        const enrichedJobs = await Promise.all(jobs.map(async (job) => {
            const applicationCount = await Application.countDocuments({ job: job._id });

            // Get avatars of recent applicants
            const recentApplications = await Application.find({ job: job._id })
                .sort({ createdAt: -1 })
                .limit(3)
                .populate({
                    path: 'student',
                    select: 'name' // We need to reach StudentProfile for image, this is User. 
                    // Reaching Profile from User is tricky in simple populate without virtuals.
                    // Let's do a second lookup for Profile.
                });

            const applicantAvatars = await Promise.all(recentApplications.map(async (app) => {
                const profile = await StudentProfile.findOne({ user: app.student._id }).select('profilePictureUrl');
                return profile?.profilePictureUrl || '';
            }));

            return {
                _id: job._id,
                title: job.title,
                company: job.company,
                type: job.type,
                postedDate: job.createdAt,
                applicants: applicationCount,
                applicantAvatars,
                status: job.status === 'Open' ? 'Active' : job.status // Map Open -> Active for UI consistency if needed
            };
        }));

        res.json({
            jobs: enrichedJobs,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalJobs: count
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
