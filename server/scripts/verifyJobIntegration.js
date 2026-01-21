const API_URL = 'http://localhost:5000/api';
const COMPANY_EMAIL = 'demo@company.com';
const COMPANY_PASSWORD = 'Company@123';

async function verifyJobIntegration() {
    try {
        console.log('🔑 Logging in as company...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: COMPANY_EMAIL,
                password: COMPANY_PASSWORD,
                role: 'company'
            })
        });

        if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.statusText}`);
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('✅ Login successful!');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 1. Create a Job
        console.log('📝 Creating a new job...');
        const jobPayload = {
            title: `Integration Test Job ${Date.now()}`,
            type: 'Full-time',
            workMode: 'Remote',
            salary: '$100k - $120k / year',
            description: 'This is a test job created by the verification script.',
            requirements: ['Node.js', 'React', 'Testing'],
            department: 'Engineering',
            location: 'Remote',
            tags: ['Test']
        };

        const createRes = await fetch(`${API_URL}/company/jobs`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(jobPayload)
        });

        if (!createRes.ok) {
            const err = await createRes.text();
            throw new Error(`Create Job failed: ${err}`);
        }
        const createData = await createRes.json();
        const createdJobId = createData._id;
        console.log(`✅ Job created with ID: ${createdJobId}`);

        // 2. Fetch Jobs and Verify
        console.log('📋 Fetching company jobs...');
        const jobsRes = await fetch(`${API_URL}/company/jobs`, {
            headers: headers
        });

        if (!jobsRes.ok) throw new Error(`Fetch jobs failed: ${jobsRes.statusText}`);
        const jobs = await jobsRes.json(); // Array of jobs

        const foundJob = jobs.find(j => j._id === createdJobId);

        if (foundJob) {
            console.log('✅ SUCCESS: Created job found in the list.');
            console.log(`Title: ${foundJob.title}`);
            console.log(`Applicants: ${foundJob.applicantsCount} (Expected 0)`);
        } else {
            console.error('❌ FAILURE: Created job NOT found in the list.');
            process.exit(1);
        }

        console.log('🎉 Job Integration Verification Passed!');

    } catch (err) {
        console.error('❌ Verification Failed:', err);
        process.exit(1);
    }
}

verifyJobIntegration();
