require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');

const MONGO_URI = process.env.MONGO_URI;

const debugStats = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const users = await User.find({ role: 'company' });

        console.log(`Found ${users.length} company users.`);

        for (const user of users) {
            const jobCount = await Job.countDocuments({ postedBy: user._id });
            const openJobCount = await Job.countDocuments({ postedBy: user._id, status: 'Open' });

            console.log(`User: ${user.name} (${user.email})`);
            if (user.name === 'google') {
                const jobs = await Job.find({ postedBy: user._id });
                jobs.forEach(j => console.log(` - Job: ${j.title}, Status: "${j.status}"`));
            }
            console.log(`   ID: ${user._id}`);
            console.log(`   Total Jobs: ${jobCount}`);
            console.log(`   Open Jobs: ${openJobCount}`);
            console.log('---');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debugStats();
