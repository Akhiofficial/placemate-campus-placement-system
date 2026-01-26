// server/controllers/adminController.js
const User = require('../models/User');
const AdminRequest = require('../models/AdminRequest');
const Application = require('../models/Application');
const CompanyProfile = require('../models/CompanyProfile');
const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job'); // Kept from original
const SystemSettings = require('../models/SystemSettings');
const Notification = require('../models/Notification');
const mongoose = require('mongoose'); // Kept from original
const crypto = require('crypto');

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
        const offers = await Application.find({ status: { $in: ['Offer', 'Hired'] } }).populate('job');
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
                let avgJobPackage = 0;
                // Try min/max first (saved as numbers)
                if ((app.job.salaryMin > 0 || app.job.salaryMax > 0)) {
                    avgJobPackage = (app.job.salaryMin + app.job.salaryMax) / 2;
                }
                // Fallback: Parse string if min/max are missing (e.g. old jobs)
                else if (app.job.salary) {
                    // Extract numbers from string (e.g. "6-9 LPA", "$5000", "12 LPA")
                    const numbers = app.job.salary.match(/(\d+(\.\d+)?)/g);
                    if (numbers && numbers.length > 0) {
                        const nums = numbers.map(n => parseFloat(n));
                        // If multiple numbers (range), average them. If single, use it.
                        const sum = nums.reduce((a, b) => a + b, 0);
                        avgJobPackage = sum / nums.length;
                    }
                }

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
            status: { $in: ['Offer', 'Hired'] },
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

        const CompanyProfile = require('../models/CompanyProfile');

        // Need to add applicants count to each job and real company logo
        // This could be N+1 query problem, but for 5 items it's fine.
        const jobsWithStats = await Promise.all(recentJobs.map(async (job) => {
            const applicantCount = await Application.countDocuments({ job: job._id });

            // Try to fetch company profile for logo if user is linked
            let companyLogo = job.companyLogo;
            if (job.postedBy) {
                // console.log(`Processing job: ${job.title}, postedBy: ${job.postedBy}`);
                const profile = await CompanyProfile.findOne({ company: job.postedBy });
                if (profile) {
                    // console.log(`Found profile for ${job.postedBy}:`, profile.logo);
                    if (profile.logo) {
                        companyLogo = profile.logo;
                    }
                }
            }

            // Normalize logo URL
            if (companyLogo && !companyLogo.startsWith('http') && !companyLogo.startsWith('data:')) {
                // If it's a local path, prepend server URL
                const path = companyLogo.startsWith('/') ? companyLogo.substring(1) : companyLogo;
                companyLogo = `${req.protocol}://${req.get('host')}/${path}`;
            }

            return {
                ...job,
                applicants: applicantCount,
                companyLogo: companyLogo, // ensure latest logo is used
                // formatting date
                date: new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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

// @desc    Get Super Admin Stats (Requests & Admins count)
// @route   GET /api/admin/super-admin-stats
// @access  Private (Super Admin only)
exports.getSuperAdminStats = async (req, res) => {
    try {
        const totalAdmins = await User.countDocuments({ role: 'admin' });
        const pendingRequests = await AdminRequest.countDocuments({ status: 'pending' });

        const activeInstitutions = totalAdmins;

        res.json({
            totalAdmins,
            pendingRequests,
            activeInstitutions
        });
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

// @desc    Get all students with their stats for Admin Student Directory
// @route   GET /api/admin/students-with-stats
// @access  Private (Admin only)
exports.getStudentsWithStats = async (req, res) => {
    try {
        // 1. Fetch all student Users
        const students = await User.find({ role: 'student' }).select('name email createdAt isBlocked');

        // 2. Fetch all Student Profiles
        const profiles = await StudentProfile.find().select('user cgpa department skills experience projects');

        // 3. Fetch all 'Offer' applications to determine placement status
        const placedApplications = await Application.find({ status: 'Offer' }).select('student');
        const placedStudentIds = new Set(placedApplications.map(app => app.student.toString()));

        // --- Data Merging & Processing ---

        let totalCGPA = 0;
        let cgpaCount = 0;
        const departmentCounts = {};
        const skillCounts = {};

        const studentDirectory = students.map(student => {
            const profile = profiles.find(p => p.user.toString() === student._id.toString());
            const isPlaced = placedStudentIds.has(student._id.toString());

            // Extract Stats Data
            const cgpa = profile?.cgpa || 0;
            if (cgpa > 0) {
                totalCGPA += cgpa;
                cgpaCount++;
            }

            let dept = profile?.department || 'Unspecified';
            dept = dept.trim().toUpperCase(); // Normalize to Uppercase to merge 'Ai', 'AI', 'cse', 'CSE'

            departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;

            if (Array.isArray(profile?.skills)) {
                profile.skills.forEach(skill => {
                    skillCounts[skill] = (skillCounts[skill] || 0) + 1;
                });
            }

            return {
                _id: student._id,
                name: student.name,
                email: student.email,
                joinedAt: student.createdAt,
                department: dept,
                cgpa: cgpa,
                status: isPlaced ? 'Placed' : 'Seeking', // Simple status logic
                skills: profile?.skills || [],
                profileId: profile?._id,
                isBlocked: student.isBlocked
            };
        });

        // --- Statistics Calculation ---

        // 1. Dashboard Cards
        const totalStudents = students.length;
        const placedCount = placedStudentIds.size;
        const seekingCount = totalStudents - placedCount;
        const averageCGPA = cgpaCount > 0 ? (totalCGPA / cgpaCount).toFixed(2) : 0;

        // 2. Demographics Chart
        const demographics = Object.entries(departmentCounts).map(([label, value]) => ({ label, value }));

        // 3. Top Skills Chart (Top 5)
        const topSkills = Object.entries(skillCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([label, value]) => ({ label, value }));

        // 4. Placement Distribution
        const placementStats = {
            placed: placedCount,
            seeking: seekingCount
        };

        res.json({
            studentData: studentDirectory,
            dashboardStats: {
                totalStudents,
                placedStudents: placedCount,
                seekingStudents: seekingCount,
                averageCGPA
            },
            demographics,
            topSkills,
            placementStats
        });

    } catch (err) {
        console.error("Error in getStudentsWithStats:", err);
        res.status(500).send('Server error');
    }
};

// @desc    Delete a student and all related data
// @route   DELETE /api/admin/students/:id
// @access  Private (Admin only)
exports.deleteStudent = async (req, res) => {
    try {
        const studentId = req.params.id;

        // Check if student exists
        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        // 1. Delete Student Profile
        await StudentProfile.findOneAndDelete({ user: studentId });

        // 2. Delete Applications
        await Application.deleteMany({ student: studentId });

        // 3. Delete User Account
        await User.findByIdAndDelete(studentId);

        res.json({ msg: 'Student deleted successfully' });
    } catch (err) {
        console.error("Error deleting student:", err);
        res.status(500).send('Server error');
    }
};

// @desc    Update student status (Block/Unblock)
// @route   PUT /api/admin/students/:id/status
// @access  Private (Admin only)
exports.updateStudentStatus = async (req, res) => {
    try {
        const { isBlocked } = req.body;
        const student = await User.findByIdAndUpdate(
            req.params.id,
            { isBlocked },
            { new: true }
        ).select('name email isBlocked');

        if (!student) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        res.json(student);
    } catch (err) {
        console.error("Error updating student status:", err);
        res.status(500).send('Server error');
    }
};

// @desc    Update student details (Admin override)
// @route   PUT /api/admin/students/:id
// @access  Private (Admin only)
exports.updateStudentDetails = async (req, res) => {
    try {
        const { name, email, department, cgpa, skills } = req.body;
        const studentId = req.params.id;

        // 1. Update User (Name, Email)
        const user = await User.findById(studentId);
        if (!user) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();

        // 2. Update Profile (Department, CGPA)
        let profile = await StudentProfile.findOne({ user: studentId });

        if (profile) {
            if (department) profile.department = department;
            if (cgpa !== undefined) profile.cgpa = cgpa;
            if (skills) profile.skills = skills;

            await profile.save();
        }

        res.json({ msg: 'Student updated successfully', user });
    } catch (err) {
        console.error("Error updating student details:", err);
        res.status(500).send('Server error');
    }
};

// @desc    Create a new student (manual)
// @route   POST /api/admin/students
// @access  Private (Admin only)
exports.createStudent = async (req, res) => {
    try {
        const { name, email, password, department, universityRollNo } = req.body;

        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // 2. Create User
        user = new User({
            name,
            email,
            password, // Mongoose pre-save will hash this
            role: 'student',
            isApproved: true // Admin created, so auto-approved
        });
        await user.save();

        // 3. Create Profile
        const profile = new StudentProfile({
            user: user._id,
            department: department ? department.toUpperCase() : undefined,
            universityRollNo // Unique field, ensure handled in frontend or catch duplication error
        });
        await profile.save();

        res.status(201).json({ msg: 'Student created successfully', user });
    } catch (err) {
        console.error("Error creating student:", err);
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Duplicate key error (e.g., Roll No or Email already exists)' });
        }
        res.status(500).send('Server error');
    }
};

// @desc    Import students from CSV
// @route   POST /api/admin/students/import
// @access  Private (Admin only)
exports.importStudents = async (req, res) => {
    try {
        const { students } = req.body; // Array of student objects

        if (!Array.isArray(students) || students.length === 0) {
            return res.status(400).json({ msg: 'No student data provided' });
        }

        const results = {
            success: 0,
            failed: 0,
            errors: []
        };

        for (const stud of students) {
            try {
                const { name, email, password, department, universityRollNo } = stud;

                if (!email || !password || !name) {
                    results.failed++;
                    results.errors.push({ email, msg: 'Missing required fields' });
                    continue;
                }

                let user = await User.findOne({ email });
                if (user) {
                    results.failed++;
                    results.errors.push({ email, msg: 'User already exists' });
                    continue;
                }

                user = new User({
                    name,
                    email,
                    password,
                    role: 'student',
                    isApproved: true
                });
                await user.save();

                const profile = new StudentProfile({
                    user: user._id,
                    department: department ? department.toUpperCase() : undefined,
                    universityRollNo
                });
                await profile.save();

                results.success++;
            } catch (err) {
                results.failed++;
                if (err.code === 11000) {
                    results.errors.push({ email: stud.email, msg: 'Duplicate entry (Roll No or Email)' });
                } else {
                    results.errors.push({ email: stud.email, msg: err.message });
                }
            }
        }

        res.json({ msg: 'Import process completed', results });

    } catch (err) {
        console.error("Error importing students:", err);
        res.status(500).send('Server error');
    }
};

// @desc    Create a new company
// @route   POST /api/admin/companies
// @access  Private (Admin only)
exports.createCompany = async (req, res) => {
    try {
        const { name, email, password, location, website } = req.body;

        // 1. Check if user exists

        let user = await User.findOne({ email });
        if (user) {

            return res.status(400).json({ msg: `User already exists (Role: ${user.role})` });
        }

        // 2. Create User
        user = new User({
            name,
            email,
            password,
            role: 'company',
            isApproved: true,
            companyName: name
        });
        await user.save();

        // 3. Create Company Profile
        const profile = new CompanyProfile({
            company: user._id,
            name,
            location,
            website
        });
        await profile.save();

        res.status(201).json({ msg: 'Company created successfully', user });
    } catch (err) {
        console.error("Error creating company:", err);
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Email already exists' });
        }
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

// @desc    Create a new job (Admin)
// @route   POST /api/admin/jobs
// @access  Private (Admin only)
exports.createJob = async (req, res) => {
    try {
        // Admin can specify 'companyName' text for simple listing or link to existing company?
        // For MVP, if admin creates, they might just want to list a job from an external company or ghost post.
        // However, 'postedBy' ref is User. 
        // If we want to link to a real company, we need that company's ID. 
        // Or we can just let Admin own the post. 

        const {
            title,
            company,
            companyId, // Add this
            description,
            location,
            type,
            salary,
            requirements,
            deadline,
            eligibility
        } = req.body;

        let companyName = company;
        if (!companyName && companyId) {
            const companyUser = await User.findById(companyId);
            if (companyUser) {
                companyName = companyUser.companyName || companyUser.name;
            }
        }

        const job = new Job({
            title,
            company: companyName || 'Unknown Company', // Text name of company
            description,
            location, // Ensure location is passed
            type,
            salary,
            requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map(s => s.trim()) : []),
            deadline,
            eligibility,
            postedBy: companyId || req.user.userId, // Link to company if provided, else Admin
            status: req.body.status ? (req.body.status === 'Active' ? 'Open' : req.body.status) : 'Open',
            workMode: req.body.workMode,
            department: req.body.team, // 'team' from frontend -> 'department' in schema
            tags: req.body.skills ? (Array.isArray(req.body.skills) ? req.body.skills : req.body.skills.split(',').map(s => s.trim())) : []
        });

        await job.save();

        res.status(201).json({ msg: 'Job created successfully', job });
    } catch (err) {
        console.error("Error creating job:", err);
        res.status(500).send('Server error');
    }
};
// @desc    Get all companies with stats
// @route   GET /api/admin/companies
// @access  Private (Admin only)
exports.getAllCompanies = async (req, res) => {
    try {
        // 1. Get all company users
        const companyUsers = await User.find({ role: 'company' }).select('-password');

        // 2. Hydrate with profile and job stats
        const companies = await Promise.all(companyUsers.map(async (user) => {
            const profile = await CompanyProfile.findOne({ company: user._id });
            const jobCount = await Job.countDocuments({ postedBy: user._id, status: 'Open' });

            return {
                id: user._id,
                name: user.companyName || user.name,
                email: user.email,
                location: profile?.location || 'N/A',
                industry: profile?.industry || 'Technology', // Default if missing
                contactName: user.name, // The user account name is often the contact
                contactEmail: user.email,
                jobs: jobCount,
                status: user.isApproved ? 'Approved' : 'Pending', // Simplified status mapping
                // status logic: if isApproved is true -> Approved. If we had a 'blocked' status in User schema we'd check that.
                // User model has isApproved. 
                // Let's assume: isApproved=true -> Approved, isApproved=false -> Pending.
                // If we want 'Blocked', we might need another field or check exists.
                // For now, simplify.
                logo: profile?.logo || '',
                createdAt: user.createdAt,
                isBlocked: user.isBlocked
            };
        }));

        res.json(companies);
    } catch (err) {
        console.error("Error fetching companies:", err);
        res.status(500).send('Server error');
    }
};

// @desc    Delete a company and all related data
// @route   DELETE /api/admin/companies/:id
// @access  Private (Admin only)
exports.deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;

        // Check if company exists
        const company = await User.findById(companyId);
        if (!company) {
            return res.status(404).json({ msg: 'Company not found' });
        }

        // 1. Delete Company Profile
        await CompanyProfile.findOneAndDelete({ company: companyId });

        // 2. Delete Jobs posted by this company
        await Job.deleteMany({ postedBy: companyId });

        // 3. Delete User Account
        await User.findByIdAndDelete(companyId);

        res.json({ msg: 'Company deleted successfully' });
    } catch (err) {
        console.error("Error deleting company:", err);
        res.status(500).send('Server error');
    }
};

// @desc    Update company status (Block/Unblock)
// @route   PUT /api/admin/companies/:id/status
// @access  Private (Admin only)
exports.updateCompanyStatus = async (req, res) => {
    try {
        const { isBlocked } = req.body;
        const company = await User.findByIdAndUpdate(
            req.params.id,
            { isBlocked },
            { new: true }
        ).select('name email isBlocked role');

        if (!company) {
            return res.status(404).json({ msg: 'Company not found' });
        }

        res.json(company);
    } catch (err) {
        console.error("Error updating company status:", err);
        res.status(500).send('Server error');
    }
};

// @desc    Get Job Page Analytics (Stats, Trends, Popular Roles)
// @route   GET /api/admin/job-analytics
// @access  Private (Admin only)
exports.getJobAnalytics = async (req, res) => {
    try {
        // 1. Stats Cards
        const totalJobs = await Job.countDocuments({});
        const activeOpenings = await Job.countDocuments({ status: 'Open' });
        const pendingApproval = await Job.countDocuments({ status: 'Pending' });

        // Total Applications
        const totalApplications = await Application.countDocuments({});

        // 2. Job Posting Trends (Last 6 Months)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const trendLabels = [];
        const trendData = [];

        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            trendLabels.push(months[d.getMonth()]);

            const start = new Date(d.getFullYear(), d.getMonth(), 1);
            const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);

            const count = await Job.countDocuments({
                createdAt: { $gte: start, $lte: end }
            });
            trendData.push(count);
        }

        // 3. Popular Roles (by Application volume)
        const popularRolesAgg = await Application.aggregate([
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
                    from: 'jobs',
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

        const popularRoles = popularRolesAgg.map((item, index) => ({
            role: item.role,
            count: item.count,
            // simplistic logic for demo, calculating % relative to total applications might be small if many other jobs
            // let's just send count and handle % on UI or here if we want absolute % of total apps
            percent: totalApplications > 0 ? Math.round((item.count / totalApplications) * 100) : 0,
            color: ['bg-blue-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-teal-500', 'bg-gray-400'][index] || 'bg-gray-400'
        }));

        res.json({
            stats: [
                { label: 'Total Jobs', value: totalJobs.toString(), subtext: 'Total posted', icon: 'Briefcase', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                { label: 'Active Openings', value: activeOpenings.toString(), subtext: 'Currently live', icon: 'CheckCircle', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
                { label: 'Pending Approval', value: pendingApproval.toString(), subtext: 'Needs attention', icon: 'Clock', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                { label: 'Total Applications', value: totalApplications > 1000 ? (totalApplications / 1000).toFixed(1) + 'k' : totalApplications.toString(), subtext: 'All time', icon: 'FileText', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' }
            ],
            trends: {
                labels: trendLabels,
                datasets: [{
                    label: 'Jobs Posted',
                    data: trendData,
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)', // simplified for API, UI will handle gradient
                    tension: 0.4,
                    fill: true
                }]
            },
            popularRoles
        });

    } catch (err) {
        console.error("Error fetching job analytics:", err);
        res.status(500).send('Server error');
    }
};

// @desc    Get All Jobs for Admin (with filters & pagination)
// @route   GET /api/admin/jobs-list
// @access  Private (Admin only)
exports.getAllJobsAdmin = async (req, res) => {
    try {
        const { status, search, company, sort, page = 1, limit = 10 } = req.query;

        const query = {};

        // Filter by Status
        if (status && status !== 'All Jobs') {
            if (status === 'Active') query.status = 'Open';
            else if (status === 'Drafts') query.status = 'Draft';
            else query.status = status;
        }

        // Search (Title or Company)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } } // Assuming company is string in Job model
            ];
        }

        // Sort
        let sortOption = { createdAt: -1 };
        if (sort === 'oldest') sortOption = { createdAt: 1 };

        const skip = (page - 1) * limit;

        const jobs = await Job.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Job.countDocuments(query);

        // Enhance with stats (applicants count)
        const jobsWithStats = await Promise.all(jobs.map(async (job) => {
            const applicantsCount = await Application.countDocuments({ job: job._id });

            let logo = job.companyLogo;
            // If no logo, use DiceBear with company name seed
            if (!logo) logo = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(job.company)}`;

            return {
                _id: job._id,
                id: job._id,
                title: job.title,
                company: job.company,
                type: job.type,
                location: job.location,
                posted: new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                applicants: applicantsCount,
                status: job.status === 'Open' ? 'Active' : job.status,
                statusColor: job.status === 'Open'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : job.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-gray-600 text-gray-100 dark:bg-gray-700 dark:text-gray-300',
                logo: logo,
                description: job.description,
                requirements: job.requirements,
                salary: job.salary,
                skills: job.tags ? job.tags.join(', ') : '', // Flatten tags to string for frontend input
                workMode: job.workMode,
                deadline: job.deadline,
                eligibility: job.eligibility,
                team: job.department // Map department to team for frontend
            };
        }));

        res.json({
            jobs: jobsWithStats,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (err) {
        console.error("Error fetching admin jobs:", err);
        res.status(500).send('Server error');
    }
};

// @desc    Delete a Job
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin only)
exports.deleteJobAdmin = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });

        await Application.deleteMany({ job: req.params.id });
        await Job.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update Job Status
// @route   PUT /api/admin/jobs/:id/status
// @access  Private (Admin only)
exports.updateJobStatusAdmin = async (req, res) => {
    try {
        const { status } = req.body;

        let job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });

        job.status = status;
        await job.save();

        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update Job Details (Admin)
// @route   PUT /api/admin/jobs/:id
// @access  Private (Admin only)
exports.updateJobAdmin = async (req, res) => {
    try {
        const {
            title,
            company,
            description,
            location,
            type,
            salary,
            requirements,
            deadline,
            eligibility,
            status,
            workMode,
            skills,
            team // 'team' might map to 'department' in schema or need new field. Schema has 'department'.
        } = req.body;

        let job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });

        // Update fields
        if (title) job.title = title;
        if (company) job.company = company;
        if (description) job.description = description;
        if (location) job.location = location;
        if (type) job.type = type;
        if (salary) job.salary = salary;
        if (status) job.status = status === 'Active' ? 'Open' : status;
        if (workMode) job.workMode = workMode;
        if (eligibility) job.eligibility = eligibility;
        if (deadline) job.deadline = deadline;

        // Map 'team' to 'department' if that's the intention, or use department directly
        if (team) job.department = team; // EditJobModal uses 'team'

        // Handle array fields
        if (requirements) {
            job.requirements = Array.isArray(requirements) ? requirements : requirements.split(',').map(s => s.trim()).filter(Boolean);
        }

        // Schema has 'tags' but EditJobModal sends 'skills'. Let's save skills to tags or similar.
        // Job model has 'tags'. Let's map skills string to tags array.
        if (skills) {
            job.tags = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
        }

        await job.save();

        res.json(job);
    } catch (err) {
        console.error("Error updating job:", err);
        res.status(500).send('Server error');
    }
};

// @desc    Export Jobs as CSV
// @route   GET /api/admin/jobs/export
// @access  Private (Admin only)
exports.exportJobsCSV = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });

        // Simple CSV generation
        const headers = ['Job ID', 'Title', 'Company', 'Type', 'Status', 'Location', 'Salary', 'Posted Date'];
        let csvContent = headers.join(',') + '\n';

        jobs.forEach(job => {
            const row = [
                job._id,
                `"${job.title.replace(/"/g, '""')}"`, // Escape quotes
                `"${job.company.replace(/"/g, '""')}"`,
                job.type,
                job.status,
                `"${job.location ? job.location.replace(/"/g, '""') : ''}"`,
                `"${job.salary ? job.salary.replace(/"/g, '""') : ''}"`,
                new Date(job.createdAt).toLocaleDateString()
            ];
            csvContent += row.join(',') + '\n';
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=jobs_report.csv');
        res.status(200).send(csvContent);

    } catch (err) {
        console.error("Error exporting jobs:", err);
        res.status(500).send('Server error');
    }
};

// @desc    Get Application Stats (Admin)
// @route   GET /api/admin/application-stats
// @access  Private (Admin only)
exports.getApplicationStats = async (req, res) => {
    try {
        const totalApplications = await Application.countDocuments();
        const pendingReview = await Application.countDocuments({ status: { $in: ['Applied', 'Shortlisted'] } });

        // Count interviews scheduled for next 7 days
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const interviewsScheduled = await Application.countDocuments({
            status: 'Interview',
            interviewDate: {
                $gte: new Date(),
                $lte: nextWeek
            }
        });

        const placedCandidates = await Application.countDocuments({ status: 'Hired' });

        // Status Distribution
        const statusDistribution = await Application.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Top Companies Demand
        const companyDemand = await Application.aggregate([
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobDetails'
                }
            },
            {
                $unwind: { path: '$jobDetails', preserveNullAndEmptyArrays: true }
            },
            {
                $group: {
                    _id: { $ifNull: ['$jobDetails.company', 'Unknown'] },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 4 }
        ]);

        res.json({
            stats: {
                totalApplications,
                pendingReview,
                interviewsScheduled,
                placedCandidates
            },
            statusDistribution,
            companyDemand
        });

    } catch (error) {
        console.error('Error fetching application stats:', error);
        res.status(500).json({ message: 'Server error fetching application stats' });
    }
};

// @desc    Get All Applications extended (Admin)
// @route   GET /api/admin/applications
// @access  Private (Admin only)
exports.getAllApplications = async (req, res) => {
    try {
        const { search, status, company, sort, startDate, endDate } = req.query;
        let query = {};

        // Build Aggregate Pipeline
        const pipeline = [
            // Lookup Student User (for name)
            {
                $lookup: {
                    from: 'users',
                    localField: 'student',
                    foreignField: '_id',
                    as: 'studentUser'
                }
            },
            { $unwind: { path: '$studentUser', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'studentprofiles',
                    localField: 'student',
                    foreignField: 'user',
                    as: 'studentProfile'
                }
            },
            { $unwind: { path: '$studentProfile', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'job'
                }
            },
            { $unwind: { path: '$job', preserveNullAndEmptyArrays: true } }
        ];

        // Match Stage
        let matchStage = {};

        if (status && status !== 'All Statuses') {
            matchStage['status'] = status;
        }

        if (company && company !== 'All Companies') {
            matchStage['job.company'] = company;
        }

        if (startDate && endDate) {
            matchStage['createdAt'] = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (search) {
            matchStage['$or'] = [
                { 'studentUser.name': { $regex: search, $options: 'i' } },
                { 'studentProfile.universityRollNo': { $regex: search, $options: 'i' } },
                { 'job.title': { $regex: search, $options: 'i' } },
                { 'job.company': { $regex: search, $options: 'i' } }
            ];
        }

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        // Sort Stage - Default newest first
        pipeline.push({ $sort: { createdAt: -1 } });

        // Project Stage
        pipeline.push({
            $project: {
                _id: 1,
                student: 1,
                status: 1,
                appliedDate: '$createdAt',
                'studentUser.name': { $ifNull: ['$studentUser.name', 'Unknown Student'] },
                'studentProfile.universityRollNo': { $ifNull: ['$studentProfile.universityRollNo', 'N/A'] },
                'studentProfile.profilePictureUrl': 1,
                'job.title': { $ifNull: ['$job.title', 'Unknown Job'] },
                'job.company': { $ifNull: ['$job.company', 'Unknown Company'] }
            }
        });

        const applications = await Application.aggregate(pipeline);

        res.json(applications);

    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Server error fetching applications' });
    }
};

// @desc    Export Applications as CSV
// @route   GET /api/admin/applications/export
// @access  Private (Admin only)
exports.exportApplicationsCSV = async (req, res) => {
    try {
        // Fetch all applications with details
        const applications = await Application.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'student',
                    foreignField: '_id',
                    as: 'studentUser'
                }
            },
            { $unwind: { path: '$studentUser', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'studentprofiles',
                    localField: 'student',
                    foreignField: 'user',
                    as: 'studentProfile'
                }
            },
            { $unwind: { path: '$studentProfile', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'job'
                }
            },
            { $unwind: { path: '$job', preserveNullAndEmptyArrays: true } }
        ]);

        const headers = ['Application ID', 'Student Name', 'University Roll No', 'Job Title', 'Company', 'Status', 'Applied Date'];
        let csvContent = headers.join(',') + '\n';

        applications.forEach(app => {
            const studentName = app.studentUser?.name || 'Unknown';
            const rollNo = app.studentProfile?.universityRollNo || 'N/A';
            const jobTitle = app.job?.title || 'Unknown';
            const companyName = app.job?.company || 'Unknown';
            const status = app.status;
            const appliedDate = new Date(app.createdAt).toLocaleDateString();

            const row = [
                app._id,
                `"${studentName.replace(/"/g, '""')}"`,
                `"${rollNo.replace(/"/g, '""')}"`,
                `"${jobTitle.replace(/"/g, '""')}"`,
                `"${companyName.replace(/"/g, '""')}"`,
                status,
                appliedDate
            ];
            csvContent += row.join(',') + '\n';
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=applications_report.csv');
        res.status(200).send(csvContent);

    } catch (err) {
        console.error("Error exporting applications:", err);
        res.status(500).send('Server error');
    }
};

// @desc    Get Student Full Profile (Admin)
// @route   GET /api/admin/students/:id/profile
// @access  Private (Admin only)
exports.getStudentFullProfile = async (req, res) => {
    try {
        const studentId = req.params.id; // This is the User ID

        const profile = await StudentProfile.findOne({ user: studentId }).populate('user', 'name email role');

        if (!profile) {
            // Even if profile is missing, return basic user info if user exists
            const user = await User.findById(studentId).select('name email role');
            if (!user) {
                return res.status(404).json({ message: 'Student not found' });
            }
            return res.json({ user, profile: null });
        }

        res.json(profile);
    } catch (err) {
        console.error('Error fetching student profile:', err);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
};

// @desc    Update Application Status (Admin)
// @route   PUT /api/admin/applications/:id/status
// @access  Private (Admin only)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Hired', 'Rejected'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status;

        // If status is interview, we might want to ensure interviewDate is set, but kept optional here
        if (status === 'Interview' && req.body.interviewDate) {
            application.interviewDate = req.body.interviewDate;
        }

        await application.save();

        // Create Notification for the student
        let notificationMessage = `Your application status for ${application.job ? application.job.title : 'a job'} at ${application.job ? application.job.company : 'a company'} has been updated to ${status}.`;
        let notificationType = 'info';

        if (status === 'Shortlisted' || status === 'Interview') notificationType = 'success';
        if (status === 'Offer' || status === 'Hired') notificationType = 'success';
        if (status === 'Rejected') notificationType = 'error';
        if (status === 'Pending' || status === 'Applied') notificationType = 'info';

        await Notification.create({
            recipient: application.student,
            type: notificationType,
            message: notificationMessage,
            relatedId: application._id,
            onModel: 'Application'
        });

        res.json(application);

    } catch (err) {
        console.error('Error updating application status:', err);
        res.status(500).json({ message: 'Server error updating status' });
    }
};

// @desc    Get Application Details (Full Profile for Admin)
// @route   GET /api/admin/applications/:id/details
// @access  Private (Admin)
exports.getApplicationDetails = async (req, res) => {
    try {
        const applicationId = req.params.id;

        const application = await Application.findById(applicationId)
            .populate('job', 'title company location type salary')
            .populate('student', 'name email');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (!application.student) {
            return res.status(404).json({ message: 'Student not found for this application' });
        }

        // Fetch Student Profile
        const profile = await StudentProfile.findOne({ user: application.student._id });

        res.json({
            application,
            profile: profile || {}
        });
    } catch (err) {
        console.error('Error fetching application details:', err);
        res.status(500).json({ message: 'Server error fetching application details' });
    }
};

// @desc    Get Admin Profile
// @route   GET /api/admin/profile
// @access  Private (Admin)
exports.getAdminProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('name email role jobTitle notificationPreferences employeeId profileImage');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching admin profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update Admin Profile
// @route   PUT /api/admin/profile
// @access  Private (Admin)
exports.updateAdminProfile = async (req, res) => {
    try {
        const { name, email, jobTitle, notificationPreferences } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (jobTitle) user.jobTitle = jobTitle;
        if (req.body.employeeId) user.employeeId = req.body.employeeId;
        if (req.body.profileImage) user.profileImage = req.body.profileImage;
        if (notificationPreferences) {
            user.notificationPreferences = {
                ...user.notificationPreferences,
                ...notificationPreferences
            };
        }

        await user.save();
        res.json(user);
    } catch (err) {
        console.error('Error updating admin profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get System Settings
// @route   GET /api/admin/settings
// @access  Private (Admin)
exports.getSystemSettings = async (req, res) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = await SystemSettings.create({
                updatedBy: req.user.userId
            });
        }
        res.json(settings);
    } catch (err) {
        console.error('Error fetching system settings:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update System Settings
// @route   PUT /api/admin/settings
// @access  Private (Admin)
exports.updateSystemSettings = async (req, res) => {
    try {
        const { academicYear, placementSeasonStart, placementSeasonEnd, openRegistration } = req.body;

        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings();
        }

        if (academicYear) settings.academicYear = academicYear;
        if (placementSeasonStart) settings.placementSeasonStart = placementSeasonStart;
        if (placementSeasonEnd) settings.placementSeasonEnd = placementSeasonEnd;
        if (typeof openRegistration === 'boolean') settings.openRegistration = openRegistration;
        if (typeof req.body.maintenanceMode === 'boolean') settings.maintenanceMode = req.body.maintenanceMode;

        settings.updatedBy = req.user.userId;

        await settings.save();
        res.json(settings);
    } catch (err) {
        console.error('Error updating system settings:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Upload Admin Avatar
// @route   POST /api/admin/upload-avatar
// @access  Private (Admin)
exports.uploadAdminAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;

        // Update user profile directly
        const user = await User.findById(req.user.userId);
        if (user) {
            user.profileImage = imageUrl;
            await user.save();
        }

        res.json({ imageUrl, msg: 'Avatar uploaded successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
