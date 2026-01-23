
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const collection = mongoose.connection.collection('companyprofiles');

        // List indexes
        const indexes = await collection.indexes();
        console.log('Current Indexes:', indexes);

        // Drop user_1 index if it exists
        const userIndex = indexes.find(idx => idx.name === 'user_1');
        if (userIndex) {
            console.log('Found incorrect index "user_1". Dropping it...');
            await collection.dropIndex('user_1');
            console.log('Dropped "user_1" index.');
        } else {
            console.log('Index "user_1" not found.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixIndexes();
