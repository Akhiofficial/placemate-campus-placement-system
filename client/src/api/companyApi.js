import api from './axios';

// Get Company Dashboard Stats (Active Jobs, Applicants, Interviews, Offers)
export const getCompanyDashboardStats = async () => {
    try {
        const response = await api.get('/company/dashboard-stats');
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to fetch dashboard stats';
    }
};

// Get Recent Job Postings
export const getRecentJobPostings = async () => {
    try {
        const response = await api.get('/company/recent-postings');
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to fetch recent job postings';
    }
};

// Get All Company Jobs (with stats)
export const getCompanyJobs = async (filters = {}) => {
    try {
        // filters like { status: 'Open', search: 'Engineer' }
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/company/jobs?${params}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to fetch company jobs';
    }
};

// Create New Job
export const createJob = async (jobData) => {
    try {
        const response = await api.post('/company/jobs', jobData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to create job';
    }
};

// Get Job Postings Stats
export const getJobPostingsStats = async () => {
    try {
        const response = await api.get('/company/job-stats');
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to fetch job stats';
    }
};

// Update Job
export const updateJob = async (id, jobData) => {
    try {
        const response = await api.put(`/company/jobs/${id}`, jobData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to update job';
    }
};

// Delete Job
export const deleteJob = async (id) => {
    try {
        const response = await api.delete(`/company/jobs/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to delete job';
    }
};

// Get Applications Stats
export const getApplicationsStats = async () => {
    try {
        const response = await api.get('/company/applications-stats');
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to fetch application stats';
    }
};

// Get Company Applications (Filtered)
// Get Company Applications (Filtered)
export const getCompanyApplications = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/company/applications?${params}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to fetch applications';
    }
};

// Get Applicant Details (Full Profile)
export const getApplicantDetails = async (id) => {
    try {
        const response = await api.get(`/company/applications/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to fetch applicant details';
    }
};

// Update Application Status
export const updateApplicationStatus = async (id, status) => {
    try {
        const response = await api.put(`/company/applications/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to update application status';
    }
};

// Get Interview Stats
export const getInterviewStats = async () => {
    try {
        const response = await api.get('/company/interviews-stats');
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to fetch interview stats';
    }
};

// Get Company Interviews
export const getCompanyInterviews = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/company/interviews?${params}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to fetch interviews';
    }
};

// Schedule Interview
export const scheduleInterview = async (interviewData) => {
    try {
        const response = await api.post('/company/schedule-interview', interviewData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to schedule interview';
    }
};

// Update Interview Status (e.g., Completed, Cancelled)
export const updateInterviewStatus = async (id, status) => {
    try {
        const response = await api.put(`/company/interviews/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to update interview status';
    }
};

// Get Single Interview
export const getInterview = async (id) => {
    try {
        const response = await api.get(`/company/interviews/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to fetch interview';
    }
};

// Update Interview Details
export const updateInterview = async (id, interviewData) => {
    try {
        const response = await api.put(`/company/interviews/${id}`, interviewData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to update interview';
    }
};

// Delete Interview
export const deleteInterview = async (id) => {
    try {
        const response = await api.delete(`/company/interviews/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.msg || 'Failed to delete interview';
    }
};

// Get Company Profile
export const getCompanyProfile = async () => {
    try {
        const res = await api.get('/company/profile');
        return res.data;
    } catch (err) {
        throw err.response?.data?.msg || 'Failed to fetch company profile';
    }
};

// Update Company Profile
export const updateCompanyProfile = async (data) => {
    try {
        const res = await api.put('/company/profile', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return res.data;
    } catch (err) {
        throw err.response?.data?.msg || 'Failed to update company profile';
    }
};
