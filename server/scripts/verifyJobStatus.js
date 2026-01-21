const API_URL = 'http://127.0.0.1:5000/api';
const COMPANY_EMAIL = 'demo@company.com';
const COMPANY_PASSWORD = 'Company@123';

async function verifyJobStatus() {
    try {
        console.log('🔑 Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email: COMPANY_EMAIL, password: COMPANY_PASSWORD, role: 'company' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const { token } = await loginRes.json();
        const headers = { 'Authorization': `Bearer ${token}` };

        console.log('📊 Fetching Dashboard Stats...');
        const statsRes = await fetch(`${API_URL}/company/dashboard-stats`, { headers });
        const stats = await statsRes.json();
        console.log('Stats:', stats);

        console.log('📋 Fetching All Jobs...');
        const jobsRes = await fetch(`${API_URL}/company/jobs`, { headers });
        const jobs = await jobsRes.json();

        console.log(`Found ${jobs.length} jobs.`);
        jobs.forEach(j => {
            console.log(`- Job: ${j.title}, Status: '${j.status}'`);
        });

        const openJobs = jobs.filter(j => j.status === 'Open').length;
        console.log(`\nExpected Active Jobs (Status 'Open'): ${openJobs}`);
        console.log(`Stats Active Jobs: ${stats.activeJobs}`);

        if (openJobs !== stats.activeJobs) {
            console.error('❌ Mismatch detected!');
        } else {
            console.log('✅ Counts match.');
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

verifyJobStatus();
