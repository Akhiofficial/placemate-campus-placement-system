// scripts/verifyDashboardApi.js
const API_URL = 'http://localhost:5000/api';

const verify = async () => {
    try {
        // 1. Login
        console.log('🔑 Logging in as demo@company.com...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'demo@company.com',
                password: 'Company@123'
            })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.token;

        if (!token) throw new Error('No token received');
        console.log('✅ Login successful!');

        // 2. Fetch Dashboard Stats
        console.log('📊 Fetching Dashboard Stats...');
        const statsRes = await fetch(`${API_URL}/company/dashboard-stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!statsRes.ok) throw new Error(`Stats fetch failed: ${statsRes.statusText}`);
        const statsData = await statsRes.json();

        console.log('✅ Stats received:', statsData);

        const { activeJobs, totalApplicants, interviews, companyName, recruiterName } = statsData;
        if (activeJobs > 0 && totalApplicants > 0 && interviews > 0) {
            console.log('✅ SUCCESS: Data is present.');
        } else {
            console.error('❌ FAILURE: Data is still zero/empty.');
            process.exit(1);
        }

        if (companyName && recruiterName) {
            console.log(`✅ SUCCESS: Company Name: ${companyName}, Recruiter Name: ${recruiterName}`);
        } else {
            console.error('❌ FAILURE: Name fields missing.');
            process.exit(1);
        }

        // 3. Fetch Recent Jobs
        console.log('list Fetching Recent Jobs...');
        const jobsRes = await fetch(`${API_URL}/company/recent-postings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!jobsRes.ok) throw new Error(`Jobs fetch failed: ${jobsRes.statusText}`);
        const jobsData = await jobsRes.json();

        console.log('✅ Recent Jobs received:', jobsData.length);
        if (jobsData.length > 0) {
            console.log('✅ SUCCESS: Recent jobs are present.');
        } else {
            console.error('❌ FAILURE: No recent jobs found.');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ verification failed:', error.message);
        process.exit(1);
    }
};

verify();
