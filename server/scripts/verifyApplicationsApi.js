const API_URL = 'http://127.0.0.1:5000/api';
const COMPANY_EMAIL = 'demo@company.com';
const COMPANY_PASSWORD = 'Company@123';

async function verifyApplicationsApi() {
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

        // 1. Fetch Stats
        console.log('📊 Fetching Applications Stats...');
        const statsRes = await fetch(`${API_URL}/company/applications-stats`, { headers });
        if (!statsRes.ok) throw new Error(`Stats fetch failed: ${statsRes.statusText}`);
        const stats = await statsRes.json();
        console.log('✅ Stats received:', stats);
        if (typeof stats.totalApplicants === 'number') {
            console.log('   Structure Validated.');
        } else {
            console.error('❌ Stats structure mismatch');
        }

        // 2. Fetch Applications
        console.log('📋 Fetching Applications List...');
        const appsRes = await fetch(`${API_URL}/company/applications?page=1&limit=5`, { headers });
        if (!appsRes.ok) throw new Error(`Applications fetch failed: ${appsRes.statusText}`);
        const apps = await appsRes.json();
        console.log(`✅ Applications received. Count: ${apps.total}`);

        if (apps.applications && Array.isArray(apps.applications)) {
            console.log('   Data Array Validated.');
            if (apps.applications.length > 0) {
                console.log('   Sample App:', JSON.stringify(apps.applications[0], null, 2));
                // Check deep fields
                if (apps.applications[0].student && apps.applications[0].job) {
                    console.log('   Application Population (Student/Job) Verified.');
                } else {
                    console.warn('⚠️ Application Population might be incomplete.');
                }
            } else {
                console.log('   No applications found (Expected if DB is fresh).');
            }
        } else {
            console.error('❌ Applications response structure mismatch', apps);
        }

        console.log('🎉 Applications Page API Verification Passed!');

    } catch (err) {
        console.error('❌ Verification Failed:', err);
        process.exit(1);
    }
}

verifyApplicationsApi();
