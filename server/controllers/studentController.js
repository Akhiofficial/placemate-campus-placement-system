const StudentProfile = require('../models/StudentProfile');
const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');

// @desc    Get student dashboard stats & recent activities
// @route   GET /api/student/dashboard
// @access  Private (Student only)
exports.getDashboard = async (req, res) => {
    try {
        const studentId = req.user.userId; // user id from token

        // 0. Get User Details (Name, Email)
        const user = await User.findById(studentId).select('name email role');

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

        // 4. Get Recommended Jobs (For now just getting 4 latest open jobs)
        // In future, we can filter by skills matching
        const recommendedJobs = await Job.find({ status: 'Open' })
            .sort({ createdAt: -1 })
            .limit(4);

        res.json({
            user,
            stats: {
                totalApplications,
                interviewsScheduled,
                offersReceived
            },
            recentApplications,
            profileComplete,
            profile,
            recommendedJobs
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
            // If profile doesn't exist, return basic user info so the frontend can still display name/email
            const user = await User.findById(req.user.userId).select('name email role');
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
            // Return a structure that allows the frontend to access user safely
            return res.json({ user });
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
        // User Details
        firstName, lastName, email,
        // Personal Details
        dateOfBirth, gender, permanentAddress, phone, location, profilePictureUrl, isOpenToWork,
        // Academic Info
        universityRollNo, currentSemester, backlogs, attendance,
        cgpa, graduationYear, department, major,
        // Professional & Skills
        resumeUrl, skills, bio, portfolioUrl, linkedinUrl,
        // Settings
        notificationPreferences
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.userId;

    // Notification Preferences
    if (notificationPreferences) {
        profileFields.notificationPreferences = notificationPreferences;
    }

    // Update User Model (Name & Email)
    if (firstName || lastName || email) {
        try {
            const user = await User.findById(req.user.userId);
            if (user) {
                if (firstName || lastName) {
                    // If only one is provided, use existing to avoid "undefined"
                    const currentParts = user.name.split(' ');
                    const first = firstName || currentParts[0] || '';
                    const last = lastName || currentParts.slice(1).join(' ') || '';
                    user.name = `${first} ${last}`.trim();
                }
                if (email) user.email = email;
                await user.save();
            }
        } catch (err) {
            console.error("Error updating user details:", err.message);
            // Continue even if user update fails? Probably safest to log and continue, or fail?
            // Let's fail if critical user info fails, but usually validation catches it.
        }
    }

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
    if (typeof skills !== 'undefined' && skills !== null) {
        // splits comma-separated strings if sent as string, otherwise assumes array
        if (Array.isArray(skills)) {
            profileFields.skills = skills;
        } else {
            profileFields.skills = skills.toString().trim().length > 0 ? skills.toString().split(',').map(skill => skill.trim()) : [];
        }
    }
    if (bio) profileFields.bio = bio;
    if (portfolioUrl) profileFields.portfolioUrl = portfolioUrl;
    if (linkedinUrl) profileFields.linkedinUrl = linkedinUrl;

    // Experience & Projects
    if (req.body.experience) {
        profileFields.experience = req.body.experience;
    }
    if (req.body.projects) {
        profileFields.projects = req.body.projects;
    }

    try {
        let profile = await StudentProfile.findOne({ user: req.user.userId });

        if (profile) {
            // Update
            profile = await StudentProfile.findOneAndUpdate(
                { user: req.user.userId },
                { $set: profileFields },
                { new: true, runValidators: true }
            );
        } else {
            // Create
            profile = new StudentProfile(profileFields);
            await profile.save();
        }

        // Return profile WITH populated user data so frontend gets updated name/email
        const fullProfile = await StudentProfile.findById(profile._id).populate('user', 'name email role');
        res.json(fullProfile);

    } catch (err) {
        console.error("Update Profile Error:", err);
        // Expose the actual error message to the frontend
        res.status(500).json({ msg: err.message });
    }
};

// @desc    Upload student resume
// @route   POST /api/student/resume
// @access  Private (Student only)
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        // Construct URL
        const resumeUrl = `${req.protocol}://${req.get('host')}/uploads/resumes/${req.file.filename}`;

        // Find and update profile
        let profile = await StudentProfile.findOne({ user: req.user.userId });

        if (profile) {
            profile.resumeUrl = resumeUrl;
            await profile.save();
            return res.json({ resumeUrl, msg: 'Resume uploaded successfully' });
        } else {
            // If profile doesn't exist, create it with just the resume
            const newProfile = new StudentProfile({
                user: req.user.userId,
                resumeUrl: resumeUrl
            });
            await newProfile.save();
            return res.json({ resumeUrl, msg: 'Resume uploaded successfully', profile: newProfile });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Upload student profile image or cover image
// @route   POST /api/student/upload-image
// @access  Private (Student only)
exports.uploadStudentImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const type = req.body.type; // 'profile' or 'cover'
        if (!type || !['profile', 'cover'].includes(type)) {
            return res.status(400).json({ msg: 'Invalid image type' });
        }

        // Construct URL
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/images/${req.file.filename}`;

        // Find and update profile
        let profile = await StudentProfile.findOne({ user: req.user.userId });

        if (!profile) {
            profile = new StudentProfile({ user: req.user.userId });
        }

        if (type === 'profile') {
            profile.profilePictureUrl = imageUrl;
        } else if (type === 'cover') {
            profile.coverImageUrl = imageUrl;
        }

        await profile.save();
        return res.json({ imageUrl, msg: 'Image uploaded successfully', profile });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
