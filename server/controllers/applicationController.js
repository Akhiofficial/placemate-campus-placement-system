const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Notification = require('../models/Notification');

// Helper to generate Application ID
const generateApplicationId = () => {
    return 'APP-' + Math.floor(1000 + Math.random() * 9000);
};

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Student only)
exports.applyForJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const studentId = req.user.userId;

        console.log(`[DEBUG] applyForJob called. JobId: ${jobId}, StudentId: ${studentId}`);

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            console.log(`[DEBUG] Job not found for ID: ${jobId}`);
            return res.status(404).json({ msg: 'Job not found' });
        }

        if (job.status !== 'Open') {
            return res.status(400).json({ msg: 'This job is no longer accepting applications' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({ student: studentId, job: jobId });
        if (existingApplication) {
            return res.status(400).json({ msg: 'You have already applied for this job' });
        }

        // Create application
        const application = new Application({
            student: studentId,
            job: jobId,
            applicationId: generateApplicationId()
        });

        await application.save();

        // Create Notification for the Company
        try {
            await Notification.create({
                recipient: job.postedBy, // The company who posted the job
                type: 'info',
                message: `New applicant for ${job.title}: ${req.user.name || 'A student'} has applied.`,
                relatedId: application._id,
                onModel: 'Application'
            });
        } catch (notifErr) {
            console.error("Failed to create notification:", notifErr.message);
            // Don't fail the application process just because notification failed
        }

        res.json({ msg: 'Application submitted successfully', application });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get my applications with filters & pagination
// @route   GET /api/applications/my
// @access  Private (Student only)
exports.getMyApplications = async (req, res) => {
    try {
        const { search, status, sort, page = 1, limit = 10 } = req.query;
        const studentId = req.user.userId;

        let query = { student: studentId };

        // Filter by Status
        if (status && status !== 'All') {
            query.status = status;
        }

        // Search by company or role (Requires population look-up, but Mongoose doesn't support deep query in `find` effectively without aggregate)
        // For simplicity in MVP: specific search isn't trivial without aggregation pipeline. 
        // We will fetch populated first then filter in memory (not efficient for large data, but okay for MVP < 100 apps).
        // OR better: use Aggregate.

        // Let's use Aggregate for proper search inside populated 'job'
        const pipeline = [
            { $match: { student: new mongoose.Types.ObjectId(studentId) } },
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'job',
                    foreignField: '_id',
                    as: 'jobDetails'
                }
            },
            { $unwind: '$jobDetails' },
        ];

        // Status Filter
        if (status && status !== 'All') {
            pipeline.push({ $match: { status: status } });
        }

        // Search Filter (Company or Title)
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { 'jobDetails.company': { $regex: search, $options: 'i' } },
                        { 'jobDetails.title': { $regex: search, $options: 'i' } }
                    ]
                }
            });
        }

        // Sorting
        let sortStage = { createdAt: -1 }; // Default Newest
        if (sort === 'Oldest') sortStage = { createdAt: 1 };
        pipeline.push({ $sort: sortStage });

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Count total before pagination for UI
        // We need 2 pipelines: one for data, one for count, or use $facet
        pipeline.push({
            $facet: {
                metadata: [{ $count: "total" }],
                data: [{ $skip: skip }, { $limit: parseInt(limit) }]
            }
        });

        const result = await Application.aggregate(pipeline);

        const data = result[0].data.map(app => ({
            _id: app._id,
            applicationId: app.applicationId,
            status: app.status,
            createdAt: app.createdAt,
            job: app.jobDetails
        }));

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

// @desc    Get Application Stats
// @route   GET /api/applications/stats
// @access  Private (Student only)
exports.getApplicationStats = async (req, res) => {
    try {
        const studentId = req.user.userId;

        const stats = await Application.aggregate([
            { $match: { student: new mongoose.Types.ObjectId(studentId) } },
            {
                $group: {
                    _id: null,
                    totalApplied: { $sum: 1 },
                    shortlisted: {
                        $sum: { $cond: [{ $eq: ["$status", "In Review"] }, 1, 0] } // Mapping 'In Review' -> Shortlisted for UI
                    },
                    interviews: {
                        $sum: { $cond: [{ $eq: ["$status", "Interview"] }, 1, 0] }
                    },
                    offers: {
                        $sum: { $cond: [{ $eq: ["$status", "Offer"] }, 1, 0] }
                    }
                }
            }
        ]);

        const defaultStats = { totalApplied: 0, shortlisted: 0, interviews: 0, offers: 0 };
        res.json(stats[0] || defaultStats);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
