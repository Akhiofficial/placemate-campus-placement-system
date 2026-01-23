
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';

const reproduceError = async () => {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'google@gmail.com',
            password: 'password123' // Assuming default password, might need to check logic
        });
        const token = loginRes.data.token;
        console.log('Logged in. Token acquired.');

        // 2. Prepare FormData
        const form = new FormData();
        form.append('name', 'Google');
        form.append('tagline', 'Don\'t be evil');
        form.append('social[linkedin]', 'https://linkedin.com/company/google');

        // Append a dummy file if needed (creating one)
        fs.writeFileSync('dummy.jpg', 'dummy content');
        form.append('logo', fs.createReadStream('dummy.jpg'));

        // 3. Update Profile
        console.log('Updating profile...');
        await axios.put(`${API_URL}/company/profile`, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Profile updated successfully!');

    } catch (err) {
        console.error('Error reproducing:', err.response ? err.response.data : err.message);
    } finally {
        if (fs.existsSync('dummy.jpg')) fs.unlinkSync('dummy.jpg');
    }
};

reproduceError();
