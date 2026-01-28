const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        console.log('Clearing existing identical test data if exists...');
        const existingCompany = await User.findOne({ email: 'recruiter@techcorp.ai' });
        if (existingCompany) {
            await Job.deleteMany({ company: 'TechCorp AI' }); // Delete jobs by this company
            await User.deleteOne({ _id: existingCompany._id });
        }

        const existingStudent = await User.findOne({ email: 'alice@student.com' });
        if (existingStudent) {
            await Application.deleteMany({ student: existingStudent._id });
            await StudentProfile.deleteMany({ user: existingStudent._id });
            await User.deleteOne({ _id: existingStudent._id });
        }

        console.log('Creating Company User...');
        const companyUser = new User({
            name: 'Recruiter Bob',
            email: 'recruiter@techcorp.ai',
            password: 'password123',
            role: 'company',
            companyName: 'TechCorp AI',
            isApproved: true
        });
        await companyUser.save();
        console.log('Company User created: recruiter@techcorp.ai / password123');

        console.log('Creating Job...');
        const job = new Job({
            company: companyUser.companyName,
            title: 'Junior AI Engineer',
            description: 'We are looking for a Junior AI Engineer with experience in Python, TensorFlow, and React. Good collaborative skills required.',
            requirements: ['Python', 'TensorFlow', 'React', 'Machine Learning', 'Node.js'],
            location: 'Remote',
            type: 'Full-time',
            workMode: 'Remote',
            salary: '10-15 LPA',
            eligibility: 'B.Tech/BE',
            postedBy: companyUser._id,
            status: 'Open',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        });
        await job.save();
        console.log(`Job Created: ${job.title}`);

        console.log('Creating Student User...');
        const studentUser = new User({
            name: 'Alice AI',
            email: 'alice@student.com',
            password: 'password123',
            role: 'student',
            isApproved: true
        });
        await studentUser.save();
        console.log('Student User created: alice@student.com / password123');

        console.log('Creating Student Profile...');
        const studentProfile = new StudentProfile({
            user: studentUser._id,
            university: 'Tech University',
            universityRollNo: 'AI101',
            department: 'Computer Science',
            cgpa: 9.2,
            skills: ['Python', 'TensorFlow', 'React', 'Node.js', 'MongoDB', 'Express'],
            projects: [
                {
                    title: 'AI Chatbot',
                    description: 'Built an AI chatbot using Python and TensorFlow and integrated it with a React frontend to answer customer queries.',
                    technologies: ['Python', 'TensorFlow', 'React'],
                    startDate: new Date('2025-01-01'),
                    endDate: new Date('2025-03-01')
                }
            ],
            experience: [
                {
                    title: 'AI Intern',
                    company: 'Startup Inc',
                    description: 'Worked on ML models using Python to optimize data processing pipelines.',
                    location: 'New York',
                    startDate: new Date('2024-06-01'),
                    endDate: new Date('2024-08-01'),
                    current: false
                }
            ],
            bio: 'Passionate AI enthusiast with full-stack skills.',
            location: 'Remote',
            isOpenToWork: true
        });
        await studentProfile.save();
        console.log('Student Profile Created');

        console.log('Creating Application...');
        // Clear existing applications if any (though clearing user/job helps)
        await Application.deleteMany({ student: studentUser._id });

        const application = new Application({
            student: studentUser._id,
            job: job._id,
            applicationId: `APP-${Date.now()}`,
            status: 'Applied',
            aiScore: 85, // Pre-populating a score solely for immediate visibility, though real logic might overwrite it
            notes: 'Auto-generated seed application'
        });
        await application.save();
        console.log('Application Created: Alice -> Junior AI Engineer');

        console.log('Done!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
