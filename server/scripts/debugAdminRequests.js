const mongoose = require('mongoose');
const AdminRequest = require('../models/AdminRequest');
const connectDB = require('../config/db');
require('dotenv').config();

const checkRequests = async () => {
    try {
        await connectDB();
        console.log('🔍 Checking AdminRequest Collection...');

        const requests = await AdminRequest.find({});
        console.log(`Found ${requests.length} requests.`);

        if (requests.length > 0) {
            console.log(JSON.stringify(requests, null, 2));
        } else {
            console.log('No admin requests found. Did you run the POST /api/auth/request-admin endpoint?');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkRequests();
