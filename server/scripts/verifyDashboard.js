const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
require('dotenv').config();

const verifyStats = async () => {
    try {
        await connectDB();
        console.log('🔍 Verifying Dashboard Stats...');

        // 1. Total Students
        const totalStudents = await StudentProfile.countDocuments();
        console.log(`Total Students: ${totalStudents} (Expected ~3)`);

        // Mock Growth Check (Assuming logic works, but verification mainly checks structure)

        // 2. Placed Students
        const placedStudentIds = await Application.distinct('student', { status: 'Offer' });
        console.log(`Placed Students: ${placedStudentIds.length} (Expected 3)`);

        // 3. Total Offers
        const totalOffers = await Application.countDocuments({ status: 'Offer' });
        console.log(`Total Offers: ${totalOffers} (Expected 3)`);

        // 4. Avg Package
        const offerApps = await Application.find({ status: 'Offer' }).populate('job', 'salaryMax');
        let totalPackage = 0;
        let offersWithSalary = 0;
        offerApps.forEach(app => {
            if (app.job && app.job.salaryMax) {
                totalPackage += app.job.salaryMax;
                offersWithSalary++;
            }
        });
        const avgPkg = offersWithSalary > 0 ? (totalPackage / offersWithSalary).toFixed(1) : 0;
        console.log(`Avg Package: ${avgPkg} LPA (Expected ~14.3)`);

        // 5. Dept Stats
        const placementByDept = await Application.aggregate([
            { $match: { status: 'Offer' } },
            {
                $lookup: {
                    from: 'studentprofiles',
                    localField: 'student',
                    foreignField: 'user',
                    as: 'studentProfile'
                }
            },
            { $unwind: '$studentProfile' },
            {
                $group: {
                    _id: '$studentProfile.department',
                    count: { $sum: 1 }
                }
            }
        ]);
        console.log('Placement by Dept:', placementByDept);

        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyStats();
