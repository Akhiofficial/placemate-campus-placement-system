const mongoose = require('mongoose');
const Application = require('./server/models/Application');
const Job = require('./server/models/Job');
const User = require('./server/models/User');
const StudentProfile = require('./server/models/StudentProfile');

// Connect to DB (copy from server.js or .env)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/placemate');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const debugData = async () => {
    await connectDB();

    console.log('--- Debugging Data ---');

    // 1. Check Applications
    const apps = await Application.find();
    console.log(`Total Applications: ${apps.length}`);

    if (apps.length === 0) {
        console.log('No applications found. Exiting.');
        process.exit();
    }

    for (const app of apps) {
        console.log(`\nApp ID: ${app._id}`);
        console.log(`  Student Ref: ${app.student}`);
        console.log(`  Job Ref: ${app.job}`);

        // Check Student User
        const studentUser = await User.findById(app.student);
        console.log(`  Student User Found: ${!!studentUser} ${studentUser ? '(' + studentUser.name + ')' : ''}`);

        // Check Job
        const job = await Job.findById(app.job);
        console.log(`  Job Found: ${!!job} ${job ? '(' + job.title + ')' : ''}`);

        if (job) {
            console.log(`  Job Company: ${job.company}`);
        }
    }

    // 2. Test Aggregation (App Stats)
    console.log('\n--- Testing Company Demand Aggregation ---');
    const companyDemand = await Application.aggregate([
        {
            $lookup: {
                from: 'jobs',
                localField: 'job',
                foreignField: '_id',
                as: 'jobDetails'
            }
        },
        { $unwind: '$jobDetails' },
        {
            $group: {
                _id: '$jobDetails.company',
                count: { $sum: 1 }
            }
        }
    ]);
    console.log('Company Demand Result:', JSON.stringify(companyDemand, null, 2));

    process.exit();
};

debugData();
