// scripts/createSuperAdmin.js
// Run this script once to create the first Super Admin account
// Usage: node scripts/createSuperAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const createSuperAdmin = async () => {
    try {
        await connectDB();

        // Check if Super Admin already exists
        const existingAdmin = await User.findOne({ email: 'superadmin@placemate.com' });
        if (existingAdmin) {
            console.log('Super Admin already exists! Updating password...');
            existingAdmin.password = 'SuperAdmin@123';
            await existingAdmin.save();
            console.log('✅ Super Admin password updated to: SuperAdmin@123');
            process.exit(0);
        }

        // Create Super Admin
        const superAdmin = new User({
            name: 'Super Admin',
            email: 'superadmin@placemate.com',
            password: 'SuperAdmin@123', // Change this to a secure password
            role: 'admin',
            isApproved: true,
            approvedAt: new Date(),
        });

        await superAdmin.save();

        console.log('✅ Super Admin created successfully!');
        console.log('Email: superadmin@placemate.com');
        console.log('Password: SuperAdmin@123');
        console.log('\n⚠️  IMPORTANT: Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error creating Super Admin:', error.message);
        process.exit(1);
    }
};

createSuperAdmin();
