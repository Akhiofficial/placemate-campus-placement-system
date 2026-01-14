// scripts/seedDashboard.js
// Usage: node scripts/seedDashboard.js

require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const User = require('../models/User');
const Notification = require('../models/Notification');
const connectDB = require('../config/db');

const seedData = async () => {
    try {
        await connectDB();

        console.log('🧹 Clearing existing data...');
        await Job.deleteMany({});
        await Application.deleteMany({});
        await Interview.deleteMany({});
        await Notification.deleteMany({});
        await require('../models/StudentProfile').deleteMany({});

        // 1. Get or Create Student
        let student = await User.findOne({ email: 'alex@student.com' });
        if (!student) {
            console.log('👤 Creating demo student Alex...');
            student = await User.create({
                name: 'Alex Morgan',
                email: 'alex@student.com',
                password: 'Student@123',
                role: 'student',
                isApproved: true
            });
        }
        console.log(`✅ Student ready: ${student.email}`);

        // 2. Create Jobs (UI Matching)
        console.log('💼 Seeding Jobs...');
        const jobsData = [
            {
                company: 'Tech Corp Inc.',
                companyLogo: 'https://via.placeholder.com/150/007bff/ffffff?text=TechCorp',
                title: 'Junior Developer',
                description: 'Join our dev team to build scalable web apps.',
                status: 'Open',
                type: 'Full-time',
                workMode: 'On-site',
                location: 'Bangalore',
                salary: '12 - 15 LPA',
                salaryMax: 15,
                requirements: ['B.Tech'],
                tags: ['New']
            },
            {
                company: 'Creative Studio Agency',
                companyLogo: 'https://via.placeholder.com/150/e83e8c/ffffff?text=Creative',
                title: 'UX Designer',
                description: 'Design intuitive and beautiful user interfaces.',
                status: 'Open',
                type: 'Full-time',
                workMode: 'Remote',
                location: 'Remote',
                salary: '8 - 12 LPA',
                salaryMax: 12
            },
            {
                company: 'DataFlow Analytics',
                companyLogo: 'https://via.placeholder.com/150/28a745/ffffff?text=DataFlow',
                title: 'Data Scientist',
                description: 'Analyze large datasets to extract meaningful insights.',
                status: 'Open',
                type: 'Full-time',
                workMode: 'Hybrid',
                location: 'Hyderabad',
                salary: '15 - 20 LPA',
                salaryMax: 20
            },
            {
                company: 'AutoMech Ind.',
                companyLogo: 'https://via.placeholder.com/150/secondary/ffffff?text=AutoMech',
                title: 'Mechanical Engineer',
                description: 'Core mechanical engineering role.',
                status: 'Closed',
                type: 'Full-time',
                workMode: 'On-site',
                location: 'Pune',
                salary: '6 - 8 LPA',
                salaryMax: 8
            }
        ];
        const createdJobs = await Job.insertMany(jobsData);
        console.log('✅ Jobs seeded!');

        // Helpers to find jobs
        const techJob = createdJobs.find(j => j.company === 'Tech Corp Inc.');
        const creativeJob = createdJobs.find(j => j.company === 'Creative Studio Agency');
        const dataJob = createdJobs.find(j => j.company === 'DataFlow Analytics');
        const autoJob = createdJobs.find(j => j.company === 'AutoMech Ind.');

        // Helpers to create students
        const createStudent = async (name, email, dept) => {
            let s = await User.findOne({ email });
            if (!s) {
                s = await User.create({
                    name, email, password: 'Student@123', role: 'student', isApproved: true
                });
            }
            // Create Profile
            await require('../models/StudentProfile').create({
                user: s._id,
                department: dept,
                course: 'B.Tech',
                cgpa: 8.5
            });
            return s;
        };

        const studentBob = await createStudent('Bob Builder', 'bob@student.com', 'CS');
        const studentCharlie = await createStudent('Charlie Mech', 'charlie@student.com', 'MECH');
        const studentDana = await createStudent('Dana Data', 'dana@student.com', 'CS');

        // 3. Create Applications
        console.log('📝 Seeding Applications...');
        const appsData = [
            {
                student: student._id,
                job: techJob._id,
                status: 'Interview',
                applicationId: 'APP-1001'
            },
            {
                student: student._id,
                job: creativeJob._id,
                status: 'Interview',
                applicationId: 'APP-1002'
            },
            {
                student: student._id,
                job: dataJob._id,
                status: 'Interview',
                applicationId: 'APP-1003'
            },
            // Placed Students
            {
                student: studentBob._id,
                job: techJob._id,
                status: 'Offer',
                applicationId: 'APP-2001'
            },
            {
                student: studentCharlie._id,
                job: autoJob._id,
                status: 'Offer',
                applicationId: 'APP-2002'
            },
            {
                student: studentDana._id,
                job: dataJob._id,
                status: 'Offer', // 20 LPA
                applicationId: 'APP-2003'
            }
        ];
        const createdApps = await Application.insertMany(appsData);
        console.log('✅ Applications seeded!');

        // 4. Create Interviews (UI Matching)
        console.log('📅 Seeding Interviews...');
        const today = new Date();
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
        const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);

        const interviewsData = [
            {
                student: student._id,
                job: techJob._id,
                application: createdApps[0]._id,
                company: 'Tech Corp Inc.',
                role: 'Junior Developer',
                date: tomorrow,
                time: '10:00 AM',
                duration: '45 mins',
                type: 'Virtual',
                platform: 'Custom Video', // For our WebRTC
                meetingLink: `/meeting/${techJob._id}`, // Mock link
                status: 'Scheduled',
                logo: techJob.companyLogo
            },
            {
                student: student._id,
                job: creativeJob._id,
                application: createdApps[1]._id,
                company: 'Creative Studio Agency',
                role: 'UX Designer',
                date: dayAfter,
                time: '02:30 PM',
                duration: '60 mins',
                type: 'Virtual',
                round: 'Round 2',
                status: 'Scheduled',
                logo: creativeJob.companyLogo
            },
            {
                student: student._id,
                job: dataJob._id,
                application: createdApps[2]._id,
                company: 'DataFlow Analytics',
                role: 'Data Scientist',
                date: new Date(today.setDate(today.getDate() + 5)),
                time: '11:15 AM',
                duration: '30 mins',
                type: 'Virtual',
                round: 'HR Round',
                platform: 'Google Meet',
                status: 'Scheduled',
                logo: dataJob.companyLogo
            }
        ];
        await Interview.insertMany(interviewsData);
        console.log('✅ Interviews seeded matching UI!');

        // 5. Create Notifications
        console.log('🔔 Seeding Notifications...');
        const notificationsData = [
            {
                recipient: student._id,
                type: 'info',
                message: 'Your interview with Tech Corp Inc. is scheduled for tomorrow at 10:00 AM.',
                onModel: 'Interview'
            },
            {
                recipient: student._id,
                type: 'success',
                message: 'Your application for Junior Developer has been shortlisted!',
                relatedId: createdApps[0]._id,
                onModel: 'Application'
            },
            {
                recipient: student._id,
                type: 'warning',
                message: 'Please complete your profile to improve visibility to recruiters.',
                read: true
            }
        ];
        await Notification.insertMany(notificationsData);
        console.log('✅ Notifications seeded!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
