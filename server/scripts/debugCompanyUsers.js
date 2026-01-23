
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const debugUserData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const users = await User.find({ role: 'company' });
        console.log('Company Users:', JSON.stringify(users.map(u => ({
            id: u._id,
            name: u.name,
            companyName: u.companyName,
            email: u.email
        })), null, 2));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

debugUserData();
