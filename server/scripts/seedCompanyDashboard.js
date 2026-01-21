// scripts/seedCompanyDashboard.js
// Usage: node scripts/seedCompanyDashboard.js

require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile'); // Assuming this exists for avatar/details
const Notification = require('../models/Notification');
const connectDB = require('../config/db');
const crypto = require('crypto');

const seedData = async () => {
    try {
        await connectDB();

        console.log('🧹 Clearing existing data...');
        // Optional: clear everything to ensure clean state for demo
        // await User.deleteMany({});
        await Job.deleteMany({});
        await Application.deleteMany({});
        await Interview.deleteMany({});
        await Notification.deleteMany({});

        // 1. Create or Get Company User
        let companyUser = await User.findOne({ email: 'demo@company.com' });
        if (!companyUser) {
            console.log('🏢 Creating demo company user...');
            companyUser = await User.create({
                name: 'John Doe',
                email: 'demo@company.com',
                password: 'Company@123',
                role: 'company',
                companyName: 'TechCorp Inc.',
                isApproved: true
            });
        } else {
            // Update existing user to ensure new fields are populated
            companyUser.name = 'John Doe';
            companyUser.companyName = 'TechCorp Inc.';
            await companyUser.save();
        }
        console.log(`✅ Company ready: ${companyUser.email}`);

        // 2. Create or Get Student User
        let studentUser = await User.findOne({ email: 'student@demo.com' });
        if (!studentUser) {
            console.log('👤 Creating demo student user...');
            studentUser = await User.create({
                name: 'Rahul Sharma',
                email: 'student@demo.com',
                password: 'Student@123',
                role: 'student',
                isApproved: true
            });

            // Create Profile for student to have avatar/details
            await StudentProfile.create({
                user: studentUser._id,
                universityRollNo: 'UE223045',
                course: 'B.Tech',
                department: 'CSE',
                cgpa: 8.5,
                skills: ['React', 'Node.js', 'MongoDB'],
                profilePictureUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul'
            });
        }
        console.log(`✅ Student ready: ${studentUser.email}`);

        // 3. Create Jobs
        console.log('💼 Seeding Jobs...');
        const jobsData = [
            {
                company: 'TechCorp Inc.', // specific to our logged in user
                postedBy: companyUser._id,
                title: 'Senior Frontend Engineer',
                description: 'We are looking for an experienced React developer.',
                department: 'Engineering',
                location: 'Bangalore',
                type: 'Full-time',
                workMode: 'Hybrid',
                status: 'Open',
                salary: '18 - 25 LPA',
                requirements: ['React', 'Redux', 'TypeScript'],
                tags: ['High Priority']
            },
            {
                company: 'TechCorp Inc.',
                postedBy: companyUser._id,
                title: 'Product Designer',
                description: 'Design intuitive user experiences.',
                department: 'Design',
                location: 'Remote',
                type: 'Full-time',
                workMode: 'Remote',
                status: 'Open',
                salary: '12 - 18 LPA',
                requirements: ['Figma', 'UI/UX'],
                tags: ['Design']
            },
            {
                company: 'TechCorp Inc.',
                postedBy: companyUser._id,
                title: 'Backend Developer Intern',
                description: 'Learn and grow with our backend team.',
                department: 'Engineering',
                location: 'Bangalore',
                type: 'Internship',
                workMode: 'On-site',
                status: 'Closed',
                salary: '25k / month',
                requirements: ['Node.js', 'SQL'],
                tags: ['Internship']
            }
        ];

        const createdJobs = await Job.insertMany(jobsData);
        console.log(`✅ ${createdJobs.length} Jobs seeded!`);

        // 4. Create Applications
        console.log('📝 Seeding Applications...');
        const job1 = createdJobs[0]; // Frontend
        const job2 = createdJobs[1]; // Designer

        const appsData = [
            {
                student: studentUser._id,
                job: job1._id,
                status: 'Interview', // In Interview stage
                aiScore: 85,
                resumeUrl: 'https://example.com/resume.pdf',
                applicationId: `APP-${Date.now()}-1`
            },
            {
                student: studentUser._id,
                job: job2._id,
                status: 'Applied', // Just applied
                aiScore: 72,
                resumeUrl: 'https://example.com/resume2.pdf',
                applicationId: `APP-${Date.now()}-2`
            }
        ];

        // Create a few more dummy applications for stats
        // We'll just reuse the student for now, or create on the fly if needed. 
        // For simplicity, multiple apps from same student to different jobs is fine.

        const createdApps = await Application.insertMany(appsData);
        console.log(`✅ ${createdApps.length} Applications seeded!`);

        // 5. Create Interviews
        console.log('📅 Seeding Interviews...');
        const today = new Date();
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

        const interviewsData = [
            {
                student: studentUser._id,
                job: job1._id,
                application: createdApps[0]._id,
                company: 'TechCorp Inc.',
                role: 'Senior Frontend Engineer',
                date: today, // Today's interview
                time: '14:00', // 2 PM
                duration: 60,
                type: 'Virtual',
                platform: 'WebRTC',
                meetingLink: crypto.randomUUID(),
                status: 'Scheduled',
                round: 'Technical Round 1'
            }
        ];

        await Interview.insertMany(interviewsData);
        console.log(`✅ ${interviewsData.length} Interviews seeded!`);

        console.log('\n-----------------------------------');
        console.log('🎉 SEEDING COMPLETE');
        console.log('-----------------------------------');
        console.log('👉 Login as Company: demo@company.com / Company@123');
        console.log('👉 Login as Student: student@demo.com / Student@123');
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
