const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Get all jobs with search & filters
// @route   GET /api/jobs
// @access  Private
exports.getAllJobs = async (req, res) => {
    try {
        const { search, type, location, minSalary, maxSalary, workMode } = req.query;

        let query = { status: 'Open' };

        // Search (Role, Company, or Skills/Tags)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { requirements: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by Job Type
        if (type) {
            query.type = type;
        }

        // Filter by Location
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Filter by Work Mode
        if (workMode) {
            query.workMode = workMode;
        }

        // Filter by Salary Range
        if (minSalary || maxSalary) {
            query.salaryMin = {};
            if (minSalary) query.salaryMin.$gte = parseInt(minSalary);
            // Assuming we filter jobs that offer *at least* this max salary, OR jobs fit within user's range
            // For simplicity: jobs where max salary offered is <= user's max filter (budget constraint)
            // OR broader: typically users filter for "Jobs paying > X".
            // Let's implement: Jobs paying >= minSalary.
            // If maxSalary provided, Jobs paying <= maxSalary.
        }
        // Cleanup salary query if not fully formed
        if (query.salaryMin && Object.keys(query.salaryMin).length === 0) {
            delete query.salaryMin;
        }


        const jobs = await Job.find(query).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Private
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.status(500).send('Server error');
    }
};



// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Company)
exports.createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            department,
            location,
            type,
            workMode,
            salary,
            salaryMin,
            salaryMax,
            requirements,
            eligibility,
            tags,
            deadline,
            companyLogo,
            status
        } = req.body;

        // Fetch user to get the name
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const newJob = new Job({
            company: user.name,
            companyLogo: companyLogo || '',
            title,
            description,
            department,
            location,
            type,
            workMode,
            salary,
            salaryMin,
            salaryMax,
            requirements,
            eligibility,
            tags,
            deadline,
            postedBy: user.id,
            status: status || 'Open'
        });

        const job = await newJob.save();
        res.json(job);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Company)
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Check user
        if (job.postedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        job = await Job.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Delete (Close) a job
// @route   DELETE /api/jobs/:id
// @access  Private (Company)
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Check user
        if (job.postedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await job.deleteOne();
        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @desc    Get jobs posted by current company
// @route   GET /api/jobs/my-jobs
// @access  Private (Company)
exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.userId }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
