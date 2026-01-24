// server/controllers/adminController.js
const User = require('../models/User');
const AdminRequest = require('../models/AdminRequest');
const Application = require('../models/Application');
const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');

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
        console.log(`[createCompany] Checking for user with email: '${email}'`);
        let user = await User.findOne({ email });
        if (user) {
            console.log(`[createCompany] Found existing user: ID=${user._id}, Role=${user.role}, Email=${user.email}`);
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
            description,
            location,
            type,
            salary,
            requirements,
            deadline,
            eligibility
        } = req.body;

        const job = new Job({
            title,
            company, // Text name of company
            description,
            location,
            type,
            salary,
            requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map(s => s.trim()) : []),
            deadline,
            eligibility,
            postedBy: req.user.userId, // Admin is the poster
            status: 'Open'
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
