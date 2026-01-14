const mongoose = require('mongoose');
const User = require('../models/User');
const CompanyProfile = require('../models/CompanyProfile');
const Job = require('../models/Job');
const connectDB = require('../config/db');
require('dotenv').config();

const seedCompanies = async () => {
    try {
        await connectDB();
        console.log('🏢 Seeding Companies...');

        const companyData = [
            { name: 'TechCorp Inc.', industry: 'Technology', status: 'Approved', jobs: 5 },
            { name: 'Innovate Systems', industry: 'Consulting', status: 'Pending', jobs: 0 },
            { name: 'FinSafe Bank', industry: 'Finance', status: 'Approved', jobs: 2 },
            { name: 'Grid Energy', industry: 'Energy', status: 'Blocked', jobs: 1 },
            { name: 'HealthPlus', industry: 'Healthcare', status: 'Approved', jobs: 3 },
            { name: 'AutoMotive X', industry: 'Automotive', status: 'Pending', jobs: 0 },
            { name: 'SkyHigh Airlines', industry: 'Aviation', status: 'Approved', jobs: 1 },
            { name: 'Retail Giant', industry: 'Retail', status: 'Blocked', jobs: 0 },
        ];

        for (const data of companyData) {
            const email = `contact@${data.name.replace(/\s+/g, '').toLowerCase()}.com`;

            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    name: data.name,
                    email,
                    password: 'Company@123',
                    role: 'company',
                    isApproved: data.status === 'Approved' || data.status === 'Blocked', // Blocked ones must have been approved once usually
                    isBlocked: data.status === 'Blocked'
                });
            } else {
                // Update status if exists
                user.isApproved = data.status === 'Approved' || data.status === 'Blocked';
                user.isBlocked = data.status === 'Blocked';
                await user.save();
            }

            // Create/Update Profile
            let profile = await CompanyProfile.findOne({ user: user._id });
            if (!profile) {
                await CompanyProfile.create({
                    user: user._id,
                    companyName: data.name,
                    industry: data.industry,
                    location: 'Silicon Valley, CA',
                    profileCompletion: 80,
                    logo: `https://ui-avatars.com/api/?name=${data.name}&background=random&color=fff`
                });
            }

            // Create dummy jobs if needed
            if (data.jobs > 0) {
                const existingJobs = await Job.countDocuments({ postedBy: user._id });
                if (existingJobs < data.jobs) {
                    for (let j = 0; j < data.jobs; j++) {
                        await Job.create({
                            company: data.name,
                            title: `Software Engineer ${j + 1}`,
                            description: 'Great job opportunity.',
                            postedBy: user._id,
                            status: 'Open',
                            salaryMax: 20 + j
                        });
                    }
                }
            }
        }

        console.log('✅ Companies seeded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding companies:', error);
        process.exit(1);
    }
};

seedCompanies();
