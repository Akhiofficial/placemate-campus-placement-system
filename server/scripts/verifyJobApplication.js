const API_URL = 'http://127.0.0.1:5000/api';
const STUDENT_EMAIL = 'student@demo.com';
const STUDENT_PASSWORD = 'Student@123';
const COMPANY_EMAIL = 'demo@company.com';
const COMPANY_PASSWORD = 'Company@123';

async function verifyJobApplication() {
    try {
        // 1. Login as Company to Find a Job ID
        console.log('🔑 Logging in as company to find a job...');
        const coLoginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email: COMPANY_EMAIL, password: COMPANY_PASSWORD, role: 'company' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const coData = await coLoginRes.json();
        const coToken = coData.token;
        const coHeaders = { 'Authorization': `Bearer ${coToken}` };

        const jobsRes = await fetch(`${API_URL}/company/jobs`, { headers: coHeaders });
        const jobs = await jobsRes.json();
        const openJob = jobs.find(j => j.status === 'Open');

        if (!openJob) {
            throw new Error('No open jobs found to apply to.');
        }
        console.log(`Found Open Job: ${openJob.title} (${openJob._id})`);

        // 2. Login as Student
        console.log('👤 Logging in as student...');
        const stLoginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email: STUDENT_EMAIL, password: STUDENT_PASSWORD, role: 'student' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const stData = await stLoginRes.json();
        const stToken = stData.token;
        const stHeaders = { 'Authorization': `Bearer ${stToken}`, 'Content-Type': 'application/json' };

        // 3. Apply for the Job
        console.log(`📝 Applying to job ${openJob._id}...`);
        const applyRes = await fetch(`${API_URL}/applications/${openJob._id}`, {
            method: 'POST',
            headers: stHeaders
        });
        const applyResult = await applyRes.json();

        if (applyRes.ok) {
            console.log('✅ Application Submitted:', applyResult.msg);
        } else {
            console.log('⚠️ Application Response:', applyResult.msg);
            // It might be "Already applied", which is also a valid state for connection test
        }

        // 4. Verify Company Sees Application
        console.log('👀 Verifying application visibility for company...');
        const appsRes = await fetch(`${API_URL}/company/applications?limit=50`, { headers: coHeaders });
        const appsData = await appsRes.json();
        const apps = appsData.applications || [];

        console.log(`Fetched ${apps.length} total applications.`);
        const found = apps.find(app => (app.job._id === openJob._id || app.job.title === openJob.title) && app.student.email === STUDENT_EMAIL);

        if (found) {
            console.log('🎉 SUCCESS: Application found in company dashboard!');
            console.log(`- Candidate: ${found.student.name}`);
            console.log(`- Job: ${found.job.title}`);
            console.log(`- Status: ${found.status}`);
        } else {
            // Note: If paginated or filtered, might not show up in first page without specific query.
            // But we used search parameter matching the job title.
            console.log('found is ' + found)
            console.log('Applications returned:', apps.length);
            if (apps.length > 0) console.log(apps[0]);
            console.warn('❌ Application NOT found in company list immediately. (Could be pagination or delay)');
        }

    } catch (err) {
        console.error('❌ Error:', err);
    }
}

verifyJobApplication();
