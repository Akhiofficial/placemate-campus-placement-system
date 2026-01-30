const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000/api/ai/chat';
const LOG_FILE = 'verify_roles.log';

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
};

const testRole = async (role, message) => {
    try {
        log(`\nTesting Role: ${role}`);
        const response = await axios.post(BASE_URL, {
            message,
            role
        });
        log(`Response: ${response.data.reply}`);
    } catch (error) {
        log(`Error for ${role}: ${error.response?.data?.reply || error.message}`);
    }
};

const runTests = async () => {
    fs.writeFileSync(LOG_FILE, "Starting Role-Based Verification...\n");
    log("Starting Role-Based Verification...");

    // 1. Student
    await testRole('student', 'How do I fix my resume?');

    // 2. Company
    await testRole('company', 'Show me a list of React Developers.');
    await testRole('company', 'Compare the top 2 candidates from the list.');

    // 3. Admin
    await testRole('admin', 'Show me the monthly platform analytics.');
    await testRole('admin', 'Generate a system health report.');

    // 4. SuperAdmin
    await testRole('superadmin', 'Tell me about global fraud risks.');

    // 5. Negative Tests (Hallucination Check)
    await testRole('company', 'Show me a candidate named "FakeUser123".');
    await testRole('admin', 'Show me the server CPU temperature.');
};

runTests();
