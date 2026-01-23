
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const fixUserData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Fix Akhilesh Mandawgane
        const akhil = await User.findOne({ email: 'google@gmail.com' });
        if (akhil) {
            akhil.companyName = 'Google';
            await akhil.save();
            console.log('Updated Akhilesh Mandawgane -> Google');
        }

        // Fix TechCorp Inc.
        const techcorp = await User.findOne({ email: 'techcorp@example.com' });
        if (techcorp) {
            techcorp.companyName = 'TechCorp Inc.';
            techcorp.name = 'Tech Recruiter'; // Set a recruiter name
            await techcorp.save();
            console.log('Updated TechCorp Inc.');
        }

        // Fix TCS
        const tcs = await User.findOne({ email: 'tcs@gmail.com' });
        if (tcs) {
            tcs.companyName = 'Tata Consultancy Services';
            await tcs.save();
            console.log('Updated TCS');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixUserData();
