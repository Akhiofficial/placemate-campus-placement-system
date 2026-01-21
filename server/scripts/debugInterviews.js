const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Interview = require('../models/Interview');
const Application = require('../models/Application');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const debugInterviews = async () => {
    await connectDB();

    try {
        // 1. Find the student "Aniket Bhoyar"
        const studentName = "Aniket Bhoyar";
        const student = await User.findOne({ name: new RegExp(studentName, 'i') });

        if (!student) {
            console.log(`Student "${studentName}" not found.`);
            // List all students
            const students = await User.find({ role: 'student' }).select('name email');
            console.log("Available Students:", students.map(s => `${s.name} (${s._id})`));
        } else {
            console.log(`Found Student: ${student.name} (${student._id})`);

            // 2. Find Interviews for this student
            const interviews = await Interview.find({ student: student._id });
            console.log(`Found ${interviews.length} interviews for this student.`);

            interviews.forEach(i => {
                console.log(`- Interview ID: ${i._id}`);
                console.log(`  Company: ${i.company}`);
                console.log(`  Role: ${i.role}`);
                console.log(`  Status: ${i.status}`);
                console.log(`  Date: ${i.date}`);
                console.log(`  Meeting Link: ${i.meetingLink}`);
                console.log('---');
            });

            // 3. Check for ANY scheduled interviews in the system
            const allInterviews = await Interview.find({});
            console.log(`\nTotal Interviews in System: ${allInterviews.length}`);
            if (interviews.length === 0 && allInterviews.length > 0) {
                console.log("Sampling first 3 interviews in system:");
                allInterviews.slice(0, 3).forEach(i => {
                    console.log(`- Student ID: ${i.student} | Status: ${i.status}`);
                });
            }
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        mongoose.connection.close();
    }
};

debugInterviews();
