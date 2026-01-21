const API_URL = 'http://127.0.0.1:5000/api';
const COMPANY_EMAIL = 'demo@company.com';
const COMPANY_PASSWORD = 'Company@123';

async function verifyJobUpdate() {
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

        // 1. Create a NEW Job to ensure ownership
        console.log('🆕 Creating a new job...');
        const createPayload = {
            title: `Test Job ${Date.now()}`,
            description: 'Test Description',
            department: 'Test Dept',
            location: 'Remote',
            type: 'Full-time',
            workMode: 'Remote',
            salary: '$100k',
            requirements: ['Req 1', 'Req 2'],
            status: 'Open'
        };

        const createRes = await fetch(`${API_URL}/company/jobs`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(createPayload)
        });

        if (!createRes.ok) throw new Error(`Create Job failed: ${createRes.statusText}`);
        const newJob = await createRes.json();
        const jobId = newJob._id;
        console.log(`✅ Created Job ID: ${jobId}`);

        // 2. Update the Job
        console.log(`📝 Updating Job ID: ${jobId}`);

        // 2. Update the Job
        const updatePayload = {
            title: `Updated Title ${Date.now()}`,
            description: 'Updated Description via script',
            department: 'Updated Dept',
            status: 'Closed',
            requirements: ['Updated Req 1', 'Updated Req 2']
        };

        const updateRes = await fetch(`${API_URL}/company/jobs/${jobId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(updatePayload)
        });

        if (!updateRes.ok) {
            const err = await updateRes.text();
            throw new Error(`Update Job failed: ${err}`);
        }

        const updatedJob = await updateRes.json();
        console.log('✅ Update response received.');
        console.log(`New Title: ${updatedJob.title}`);
        console.log(`New Status: ${updatedJob.status}`);

        if (updatedJob.title === updatePayload.title && updatedJob.status === 'Closed' && updatedJob.requirements.length === 2 && updatedJob.requirements[0] === 'Updated Req 1') {
            console.log('🎉 Job Update Verification Passed!');
        } else {
            console.error('❌ FAILURE: Job fields did not match update payload.');
            console.log('Expected:', updatePayload);
            console.log('Received:', updatedJob);
            process.exit(1);
        }

    } catch (err) {
        console.error('❌ Verification Failed:', err);
        process.exit(1);
    }
}

verifyJobUpdate();
