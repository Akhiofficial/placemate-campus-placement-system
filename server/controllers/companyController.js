const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Notification = require('../models/Notification');
const CompanyProfile = require('../models/CompanyProfile');
const crypto = require('crypto');

// @desc    Get Company Dashboard Stats
// @route   GET /api/company/dashboard-stats
// @access  Private (Company)
// @desc    Get Company Dashboard Stats
// @route   GET /api/company/dashboard-stats
// @access  Private (Company)
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. Active Jobs
        const activeJobsCount = await Job.countDocuments({
            postedBy: userId,
            status: 'Open'
        });

        // 2. Get all Job IDs for this company to filter applications
        const companyJobs = await Job.find({ postedBy: userId }).select('_id');
        const jobIds = companyJobs.map(job => job._id);

        // 3. Total Applicants
        const totalApplicants = await Application.countDocuments({
            job: { $in: jobIds }
        });

        // 4. Offers Released
        const offersReleased = await Application.countDocuments({
            job: { $in: jobIds },
            status: 'Offer'
        });

        // 5. Interviews Scheduled
        const interviewsScheduled = await Interview.countDocuments({
            job: { $in: jobIds },
            status: 'Scheduled'
        });

        res.json({
            activeJobs: activeJobsCount,
            totalApplicants,
            interviews: interviewsScheduled,
            offersReleased
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// @desc    Get Recent Job Postings with applicant counts
// @route   GET /api/company/recent-postings
// @access  Private (Company)
exports.getRecentPostings = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(5);

        // Fetch applicant counts for these jobs
        const jobsWithStats = await Promise.all(jobs.map(async (job) => {
            const applicantsCount = await Application.countDocuments({ job: job._id });
            return {
                ...job.toObject(),
                applicantsCount
            };
        }));

        res.json(jobsWithStats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get Company Jobs (Detailed List for Job Postings Page)
// @route   GET /api/company/jobs
// @access  Private (Company)
exports.getCompanyJobs = async (req, res) => {
    try {
        const { search, status, type, sortBy } = req.query;
        let query = { postedBy: req.user.userId };

        if (status && status !== 'All') {
            query.status = status;
        }

        if (type && type !== 'All') {
            query.type = type;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { _id: isValidObjectId(search) ? search : null } // Allow search by ID
            ].filter(c => c._id !== null || !c._id);
        }

        const jobs = await Job.find(query).sort({ createdAt: -1 });

        // Augment with stats
        const jobsWithStats = await Promise.all(jobs.map(async (job) => {
            // Count applications by status
            const stats = await Application.aggregate([
                { $match: { job: job._id } },
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]);

            let appliedCount = 0;
            let reviewCount = 0;
            let interviewCount = 0;
            let totalApplicants = 0;

            stats.forEach(s => {
                totalApplicants += s.count;
                if (s._id === 'Applied') appliedCount = s.count;
                if (s._id === 'In Review') reviewCount = s.count;
                if (s._id === 'Interview') interviewCount = s.count;
            });

            return {
                ...job.toObject(),
                applicantsCount: totalApplicants,
                appliedCount,
                reviewCount,
                interviewCount
            };
        }));

        res.json(jobsWithStats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get Global Job Postings Stats
// @route   GET /api/company/job-stats
// @access  Private (Company)
exports.getJobPostingsStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. Total Active Jobs
        const activeJobs = await Job.countDocuments({ postedBy: userId, status: 'Open' });

        // 2. Get Job IDs
        const jobs = await Job.find({ postedBy: userId }).select('_id');
        const jobIds = jobs.map(j => j._id);

        // 3. Total Applicants
        const totalApplicants = await Application.countDocuments({ job: { $in: jobIds } });

        // 4. Pending Reviews (Applied + In Review)
        const pendingReviews = await Application.countDocuments({
            job: { $in: jobIds },
            status: { $in: ['Applied', 'In Review'] }
        });

        res.json({
            activeJobs,
            totalApplicants,
            pendingReviews
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update Job Status (Publish/Close)
// @route   PUT /api/company/jobs/:id/status
// @access  Private (Company)
exports.updateJobStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'Open', 'Closed', 'Draft'

        let job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });

        if (job.postedBy.toString() !== req.user.userId) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        job.status = status;
        await job.save();

        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// @desc    Get Applications Page Stats
// @route   GET /api/company/applications-stats
// @access  Private (Company)
exports.getApplicationsStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get Job IDs
        const jobs = await Job.find({ postedBy: userId }).select('_id');
        const jobIds = jobs.map(j => j._id);

        // 1. Total Applicants
        const totalApplicants = await Application.countDocuments({ job: { $in: jobIds } });

        // 2. Shortlisted Candidates
        const shortlisted = await Application.countDocuments({
            job: { $in: jobIds },
            status: 'Shortlisted'
        });

        // 3. Avg Resume Score
        const scoreStats = await Application.aggregate([
            { $match: { job: { $in: jobIds }, aiScore: { $exists: true, $ne: null } } },
            { $group: { _id: null, avgScore: { $avg: '$aiScore' } } }
        ]);

        const avgScore = scoreStats.length > 0 ? Math.round(scoreStats[0].avgScore) : 0;

        res.json({
            totalApplicants,
            shortlisted,
            avgScore
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get Company Applications (Filtered & Paginated)
// @route   GET /api/company/applications
// @access  Private (Company)
exports.getCompanyApplications = async (req, res) => {
    try {
        const { search, role, cgpa, status, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const userId = req.user.userId;

        // Get company job IDs first
        const companyJobs = await Job.find({ postedBy: userId }).select('_id title');
        const jobIds = companyJobs.map(j => j._id);
        const jobTitleMap = {};
        companyJobs.forEach(j => jobTitleMap[j._id] = j.title);

        // Build Aggregation Pipeline
        const pipeline = [
            // 1. Match Applications for company jobs
            { $match: { job: { $in: jobIds } } },

            // 2. Lookup Job details (for Role filter)
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobDetails'
                }
            },
            { $unwind: '$jobDetails' },

            // 3. Lookup User details (for Search by Name/Email)
            {
                $lookup: {
                    from: 'users',
                    localField: 'student',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },

            // 4. Lookup Student Profile (for CGPA, Skills, Degree)
            {
                $lookup: {
                    from: 'studentprofiles',
                    localField: 'student',
                    foreignField: 'user',
                    as: 'profileDetails'
                }
            },
            { $unwind: { path: '$profileDetails', preserveNullAndEmptyArrays: true } }
        ];

        // 5. Apply Filters
        const matchStage = {};

        // Filter by Role (Job Title)
        if (role && role !== 'All') {
            matchStage['jobDetails.title'] = role;
        }

        // Filter by Status
        if (status && status !== 'All') {
            // Map UI 'Pending' to 'Applied' if needed, or stick to exact matches
            matchStage['status'] = status;
        }

        // Filter by CGPA (Greater than or equal)
        if (cgpa) {
            // Assuming format like "> 8.0" or just "8.0"
            const cgpaValue = parseFloat(cgpa.replace(/[^0-9.]/g, ''));
            if (!isNaN(cgpaValue)) {
                matchStage['profileDetails.cgpa'] = { $gte: cgpaValue };
            }
        }

        // Search (Name, RollNo, Skills)
        if (search) {
            matchStage.$or = [
                { 'userDetails.name': { $regex: search, $options: 'i' } },
                { 'userDetails.email': { $regex: search, $options: 'i' } },
                { 'profileDetails.universityRollNo': { $regex: search, $options: 'i' } },
                { 'profileDetails.skills': { $elemMatch: { $regex: search, $options: 'i' } } }
            ];
        }

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        // 6. Pagination & Formatting
        // We need total count for pagination, so we use $facet
        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $sort: { createdAt: -1 } },
                    { $skip: parseInt(skip) },
                    { $limit: parseInt(limit) },
                    {
                        $project: {
                            _id: 1,
                            status: 1,
                            aiScore: 1,
                            createdAt: 1,
                            'student': {
                                _id: '$userDetails._id',
                                name: '$userDetails.name',
                                email: '$userDetails.email',
                                avatar: '$profileDetails.profilePictureUrl' // Assuming avatar in profile
                            },
                            'job': {
                                _id: '$jobDetails._id',
                                title: '$jobDetails.title'
                            },
                            'degree': '$profileDetails.degree', // e.g. B.Tech
                            'branch': '$profileDetails.department', // e.g. CS
                            'cgpa': '$profileDetails.cgpa',
                            'skills': '$profileDetails.skills'
                        }
                    }
                ]
            }
        });

        const result = await Application.aggregate(pipeline);

        const data = result[0].data;
        const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;

        res.json({
            applications: data,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// @desc    Update Application Status (Shortlist/Reject/etc)
// @route   PUT /api/company/applications/:id/status
// @access  Private (Company)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        const userId = req.user.userId;

        // Validate status
        const validStatuses = ['Applied', 'Pending', 'In Review', 'Shortlisted', 'Interview', 'Offer', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ msg: 'Invalid status value' });
        }

        // Find application
        const application = await Application.findById(applicationId).populate('job');
        if (!application) {
            return res.status(404).json({ msg: 'Application not found' });
        }

        // Verify company owns the job
        if (application.job.postedBy.toString() !== userId) {
            return res.status(401).json({ msg: 'Not authorized to update this application' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


function isValidObjectId(id) {
    if (mongoose.Types.ObjectId.isValid(id)) {
        if ((String)(new mongoose.Types.ObjectId(id)) === id)
            return true;
        return false;
    }
    return false;
}

// @desc    Get Interview Stats
// @route   GET /api/company/interviews-stats
// @access  Private (Company)
exports.getInterviewStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Get Job IDs for this company
        const jobs = await Job.find({ postedBy: userId }).select('_id');
        const jobIds = jobs.map(j => j._id);

        // 1. Interviews Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const interviewsToday = await Interview.countDocuments({
            job: { $in: jobIds },
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        // 2. Pending Feedback
        // Interviews that are completed but no feedback, or specifically flagged 'Pending' feedback
        // For simplicity, using feedbackStatus field
        const pendingFeedback = await Interview.countDocuments({
            job: { $in: jobIds },
            feedbackStatus: 'Pending',
            date: { $lt: new Date() } // Only count past interviews for feedback
        });

        // 3. Total Shortlisted (Reused from Application Stats)
        const totalShortlisted = await Application.countDocuments({
            job: { $in: jobIds },
            status: 'Shortlisted'
        });

        res.json({
            interviewsToday,
            pendingFeedback,
            totalShortlisted
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get Company Interviews (Filtered & Paginated)
// @route   GET /api/company/interviews
// @access  Private (Company)
exports.getCompanyInterviews = async (req, res) => {
    try {
        const { search, status, role, type, page = 1, limit = 10 } = req.query;
        // type: 'Upcoming', 'Past', 'All'

        const skip = (page - 1) * limit;
        const userId = req.user.userId;

        // Get Job IDs
        const jobs = await Job.find({ postedBy: userId }).select('_id');
        const jobIds = jobs.map(j => j._id);

        const query = { job: { $in: jobIds } };

        // Date Filter (Upcoming vs Past)
        const now = new Date();
        if (type === 'Upcoming') {
            query.date = { $gte: now };
        } else if (type === 'Past') {
            query.date = { $lt: now };
        }

        // Status Filter
        if (status && status !== 'All Statuses') {
            query.status = status;
        }

        // Role Filter (Job Title in User Request, but Job Title in DB)
        // We can't filter by Job Title easily without aggregation or pre-fetching job Ids.
        // If 'role' is provided, we filter the jobIds list.
        if (role && role !== 'All Roles') {
            // Find jobs with this title first
            const matchingJobs = await Job.find({
                postedBy: userId,
                title: role
            }).select('_id');
            const matchingJobIds = matchingJobs.map(j => j._id);

            // Intersect with existing jobIds
            // Actually, we can just overwrite the job filter if we want strictly this role
            query.job = { $in: matchingJobIds };
        }

        // Search Filter (Candidate Name)
        // Needs Aggregation or we rely on populate match?
        // Let's use Aggregation for search/sort/pagination with joins.

        const pipeline = [
            { $match: query },
            { $sort: { date: type === 'Past' ? -1 : 1 } }, // Past: Newest first, Upcoming: Soonest first

            // Join Student
            {
                $lookup: {
                    from: 'users',
                    localField: 'student',
                    foreignField: '_id',
                    as: 'studentDetails'
                }
            },
            { $unwind: '$studentDetails' },

            // Join Job
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobDetails'
                }
            },
            { $unwind: '$jobDetails' },

            // Join Student Profile for Avatar
            {
                $lookup: {
                    from: 'studentprofiles',
                    localField: 'student',
                    foreignField: 'user',
                    as: 'profileDetails'
                }
            },
            { $unwind: { path: '$profileDetails', preserveNullAndEmptyArrays: true } }
        ];

        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { 'studentDetails.name': { $regex: search, $options: 'i' } },
                        { 'studentDetails.email': { $regex: search, $options: 'i' } },
                        { 'jobDetails.title': { $regex: search, $options: 'i' } }
                    ]
                }
            });
        }

        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $skip: parseInt(skip) },
                    { $limit: parseInt(limit) },
                    {
                        $project: {
                            _id: 1,
                            date: 1,
                            time: 1,
                            platform: 1,
                            status: 1,
                            meetingLink: 1,
                            'candidate': {
                                name: '$studentDetails.name',
                                email: '$studentDetails.email',
                                avatar: '$profileDetails.profilePictureUrl'
                            },
                            'role': '$jobDetails.title',
                            'department': '$jobDetails.department'
                        }
                    }
                ]
            }
        });

        const result = await Interview.aggregate(pipeline);
        const data = result[0].data;
        const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;

        res.json({
            interviews: data,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


// @desc    Schedule Interview (WebRTC)
// @route   POST /api/company/schedule-interview
// @access  Private (Company)
exports.scheduleInterview = async (req, res) => {
    try {
        const {
            applicationId,
            date,
            time,
            duration,
            type,
            platform,
            round,
            notes
        } = req.body;

        const userId = req.user.userId;

        // 1. Verify Application & Job Ownership
        const application = await Application.findById(applicationId).populate('job student');
        if (!application) {
            return res.status(404).json({ msg: 'Application not found' });
        }

        if (application.job.postedBy.toString() !== userId) {
            return res.status(401).json({ msg: 'Not authorized to interview for this job' });
        }

        // 2. Generate Meeting Link (WebRTC Room ID)
        // If platform is WebRTC or not provided, generate a unique room ID
        let meetingLink = '';
        if (platform === 'WebRTC' || !platform || platform === 'Custom Video') {
            meetingLink = crypto.randomUUID(); // Unique Room ID for WebRTC
        } else {
            // If using external like Zoom, link should be provided in body (omitted here for simplicity, assuming WebRTC focus)
            meetingLink = `https://meet.google.com/${crypto.randomBytes(4).toString('hex')}-${crypto.randomBytes(2).toString('hex')}`; // Placeholder for external
            if (platform === 'WebRTC') meetingLink = crypto.randomUUID();
        }

        // 3. Create Interview
        const interview = new Interview({
            student: application.student._id,
            job: application.job._id,
            application: applicationId,
            company: application.job.company,
            role: application.job.title,
            date,
            time,
            duration,
            type: type || 'Virtual',
            platform: platform || 'WebRTC',
            meetingLink,
            round,
            status: 'Scheduled',
            logo: application.job.companyLogo
        });

        await interview.save();

        // 4. Update Application Status
        application.status = 'Interview';
        await application.save();

        // 5. Send Notification to Student
        const notification = new Notification({
            recipient: application.student._id,
            type: 'info',
            message: `You have an interview scheduled for ${application.job.title} at ${application.job.company}. Check your dashboard.`,
            relatedId: interview._id,
            onModel: 'Interview'
        });
        await notification.save();

        res.json({ msg: 'Interview scheduled successfully', interview });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get Company Profile
// @route   GET /api/company/profile
// @access  Private (Company)
exports.getCompanyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        let profile = await CompanyProfile.findOne({ user: userId });

        if (!profile) {
            // Return empty profile with user ID initialized if feasible, or just null
            // For frontend ease, let's return a default object structure relative to the model
            return res.json({
                companyName: '',
                logo: '',
                description: '',
                socialLinks: {},
                values: []
            });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update/Create Company Profile
// @route   PUT /api/company/profile
// @access  Private (Company)
exports.updateCompanyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            companyName,
            logo,
            coverImage,
            description,
            website,
            location,
            headquarters,
            industry,
            companySize,
            foundedYear,
            socialLinks,
            values
        } = req.body;

        // Build profile object
        const profileFields = {
            user: userId
        };

        if (companyName) profileFields.companyName = companyName;
        if (logo) profileFields.logo = logo;
        if (coverImage) profileFields.coverImage = coverImage;
        if (description) profileFields.description = description;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (headquarters) profileFields.headquarters = headquarters;
        if (industry) profileFields.industry = industry;
        if (companySize) profileFields.companySize = companySize;
        if (foundedYear) profileFields.foundedYear = foundedYear;
        if (socialLinks) profileFields.socialLinks = socialLinks;
        if (values) profileFields.values = values;

        // Using findOneAndUpdate with upsert to handle both Create and Update
        const profile = await CompanyProfile.findOneAndUpdate(
            { user: userId },
            { $set: profileFields },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const mongoose = require('mongoose');
