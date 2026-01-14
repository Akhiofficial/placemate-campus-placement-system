const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const connectDB = require('../config/db');
require('dotenv').config();

const seedJobs = async () => {
    try {
        await connectDB();
        console.log('💼 Seeding Jobs...');

        // Fetch some companies or create dummy ones implicitly by string
        const companies = ['TechCorp Inc.', 'Innovate Systems', 'FinSafe Bank', 'Grid Energy', 'HealthPlus', 'AutoMotive X'];
        const types = ['Full-time', 'Internship', 'Contract'];
        const statuses = ['Open', 'Pending', 'Closed', 'Draft'];

        // Find a valid user to be the poster (e.g. admin or create one)
        let poster = await User.findOne({ role: 'admin' });
        if (!poster) {
            poster = await User.findOne({ role: 'company' });
        }

        if (!poster) {
            console.log('No user found to associate jobs with. Using a placeholder ID.');
        }

        const jobTitles = [
            'Software Engineer', 'Data Analyst', 'Product Manager', 'UI/UX Designer',
            'Marketing Intern', 'DevOps Engineer', 'QA Tester', 'Business Analyst'
        ];

        for (let i = 0; i < 30; i++) {
            const company = companies[Math.floor(Math.random() * companies.length)];
            const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            // Random date in last 6 months
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 180));

            const job = await Job.create({
                company,
                title,
                description: `Description for ${title} at ${company}.`,
                department: 'Engineering',
                location: 'Remote',
                type: types[Math.floor(Math.random() * types.length)],
                salary: '$80k - $120k',
                requirements: ['React', 'Node.js', 'MongoDB'],
                status,
                eligibility: 'B.Tech',
                postedBy: poster ? poster._id : new mongoose.Types.ObjectId(),
                createdAt: date
            });

            // Create random applications for this job
            const appCount = Math.floor(Math.random() * 10);
            // We need student IDs. Let's assume some exist or just skip app creation if no students.
            const students = await User.find({ role: 'student' }).limit(5);

            if (students.length > 0) {
                for (let j = 0; j < Math.min(appCount, students.length); j++) {
                    try {
                        await Application.create({
                            student: students[j]._id,
                            job: job._id,
                            applicationId: `APP-${job._id.toString().substr(-4)}-${j}`,
                            status: 'Applied'
                        });
                    } catch (err) {
                        // Ignore dupes
                    }
                }
            }
        }

        console.log('✅ Jobs seeded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding jobs:', error);
        process.exit(1);
    }
};

seedJobs();
