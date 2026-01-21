require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('../models/Job');

const MONGO_URI = process.env.MONGO_URI;

const fixJobStatus = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        // Find jobs with status 'Active'
        const activeJobs = await Job.find({ status: 'Active' });
        console.log(`Found ${activeJobs.length} jobs with status 'Active'.`);

        if (activeJobs.length > 0) {
            const result = await Job.updateMany(
                { status: 'Active' },
                { $set: { status: 'Open' } }
            );
            console.log(`Updated ${result.modifiedCount} jobs to 'Open'.`);
        } else {
            console.log('No jobs to fix.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixJobStatus();
