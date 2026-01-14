const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const connectDB = require('../config/db');
require('dotenv').config();

const seedStudents = async () => {
    try {
        await connectDB();
        console.log('🌱 Seeding Students...');

        // Clean up previous test students (optional, but good for idempotent runs if we filter by email pattern)
        // For now, let's just append to avoid deleting the main dashboard seed data if possible,
        // or just accept we are enriching the DB.

        const departments = ['CS', 'IT', 'ECE', 'MECH', 'CIVIL'];
        const skillsPool = ['Python', 'Java', 'React', 'Node.js', 'AWS', 'Figma', 'C++', 'SQL'];
        const statuses = ['Placed', 'Seeking', 'Interning', 'Not Eligible'];

        const createStudent = async (i) => {
            const name = `Student ${i}`;
            const email = `student${i}@campus.edu`;
            const dept = departments[Math.floor(Math.random() * departments.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            // Random Skills
            const studentSkills = [];
            const numSkills = Math.floor(Math.random() * 4) + 2;
            for (let j = 0; j < numSkills; j++) {
                const s = skillsPool[Math.floor(Math.random() * skillsPool.length)];
                if (!studentSkills.includes(s)) studentSkills.push(s);
            }

            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    name,
                    email,
                    password: 'Student@123',
                    role: 'student',
                    isApproved: true
                });
            }

            // Check if profile exists
            let profile = await StudentProfile.findOne({ user: user._id });
            if (!profile) {
                await StudentProfile.create({
                    user: user._id,
                    department: dept,
                    universityRollNo: `${dept}-2024-${100 + i}`,
                    cgpa: (Math.random() * (9.5 - 6.5) + 6.5).toFixed(1),
                    skills: studentSkills,
                    placementStatus: status,
                    profilePictureUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
                    isOpenToWork: status === 'Seeking'
                });
            } else {
                // Update existing profile with status if missing
                profile.placementStatus = status;
                profile.skills = studentSkills; // Refresh skills for demo
                await profile.save();
            }
        };

        // Create 20 random students
        for (let i = 1; i <= 20; i++) {
            await createStudent(i);
        }

        console.log('✅ Students seeded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding students:', error);
        process.exit(1);
    }
};

seedStudents();
