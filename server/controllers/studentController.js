const StudentProfile = require('../models/StudentProfile');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Get student dashboard stats & recent activities
// @route   GET /api/student/dashboard
// @access  Private (Student only)
exports.getDashboard = async (req, res) => {
    try {
        const studentId = req.user.userId; // user id from token

        // 1. Get stats
        const totalApplications = await Application.countDocuments({ student: studentId });
        const interviewsScheduled = await Application.countDocuments({ student: studentId, status: 'Interview' });
        const offersReceived = await Application.countDocuments({ student: studentId, status: 'Offer' });

        // 2. Get recent applications (limit 5)
        // Populate job details to show company name and role
        const recentApplications = await Application.find({ student: studentId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('job', 'company title type');

        // 3. Get profile completion status (basic check)
        const profile = await StudentProfile.findOne({ user: studentId });
        const profileComplete = !!(profile && profile.cgpa && profile.resumeUrl);

        res.json({
            stats: {
                totalApplications,
                interviewsScheduled,
                offersReceived
            },
            recentApplications,
            profileComplete,
            profile // sending profile summary if needed
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private (Student only)
exports.getProfile = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.userId }).populate('user', 'name email role');
        if (!profile) {
            return res.status(404).json({ msg: 'Profile not found' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Create or update student profile
// @route   PUT /api/student/profile
// @access  Private (Student only)
exports.updateProfile = async (req, res) => {
    const {
        // Personal Details
        dateOfBirth, gender, permanentAddress, phone, location, profilePictureUrl, isOpenToWork,
        // Academic Info
        universityRollNo, currentSemester, backlogs, attendance,
        cgpa, graduationYear, department, major,
        // Professional & Skills
        resumeUrl, skills, bio, portfolioUrl, linkedinUrl
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.userId;

    // Personal Details
    if (dateOfBirth) profileFields.dateOfBirth = dateOfBirth;
    if (gender) profileFields.gender = gender;
    if (permanentAddress) profileFields.permanentAddress = permanentAddress;
    if (phone) profileFields.phone = phone;
    if (location) profileFields.location = location;
    if (profilePictureUrl) profileFields.profilePictureUrl = profilePictureUrl;
    if (typeof isOpenToWork !== 'undefined') profileFields.isOpenToWork = isOpenToWork;

    // Academic Info
    if (universityRollNo) profileFields.universityRollNo = universityRollNo;
    if (currentSemester) profileFields.currentSemester = currentSemester;
    if (typeof backlogs !== 'undefined') profileFields.backlogs = backlogs;
    if (typeof attendance !== 'undefined') profileFields.attendance = attendance;
    if (cgpa) profileFields.cgpa = cgpa;
    if (graduationYear) profileFields.graduationYear = graduationYear;
    if (department) profileFields.department = department;
    if (major) profileFields.major = major;

    // Professional & Skills
    if (resumeUrl) profileFields.resumeUrl = resumeUrl;
    if (skills) {
        // splits comma-separated strings if sent as string, otherwise assumes array
        profileFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());
    }
    if (bio) profileFields.bio = bio;
    if (portfolioUrl) profileFields.portfolioUrl = portfolioUrl;
    if (linkedinUrl) profileFields.linkedinUrl = linkedinUrl;

    try {
        let profile = await StudentProfile.findOne({ user: req.user.userId });

        if (profile) {
            // Update
            profile = await StudentProfile.findOneAndUpdate(
                { user: req.user.userId },
                { $set: profileFields },
                { new: true, runValidators: true }
            );
            return res.json(profile);
        }

        // Create
        profile = new StudentProfile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
