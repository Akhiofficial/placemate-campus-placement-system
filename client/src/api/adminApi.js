import api from './axios';

// Get Job Page Analytics
export const getJobAnalytics = async () => {
    const response = await api.get('/admin/job-analytics');
    return response.data;
};

// Get All Jobs (List with filters)
export const getAllJobs = async (params) => {
    const response = await api.get('/admin/jobs-list', { params });
    return response.data;
};

// Delete Job
export const deleteJob = async (id) => {
    const response = await api.delete(`/admin/jobs/${id}`);
    return response.data;
};

// Update Job Status
export const updateJobStatus = async (id, status) => {
    const response = await api.put(`/admin/jobs/${id}/status`, { status });
    return response.data;
};

// Update Job Details
export const updateJob = async (id, jobData) => {
    const response = await api.put(`/admin/jobs/${id}`, jobData);
    return response.data;
};


// Create Job (if not using companyApi)
export const createJob = async (jobData) => {
    const response = await api.post('/admin/jobs', jobData);
    return response.data;
};

// Export Jobs to CSV
export const downloadJobsReport = async () => {
    const response = await api.get('/admin/jobs/export', { responseType: 'blob' });
    return response.data;
};

// --- Applications ---

// Get Application Details
export const getApplicationDetails = async (id) => {
    const response = await api.get(`/admin/applications/${id}/details`);
    return response.data;
};

// Update Application Status
export const updateApplicationStatus = async (id, status, interviewDate) => {
    const response = await api.put(`/admin/applications/${id}/status`, { status, interviewDate });
    return response.data;
};

// --- Settings ---

export const getAdminProfile = async () => {
    const response = await api.get('/admin/profile');
    return response.data;
};

export const updateAdminProfile = async (data) => {
    const response = await api.put('/admin/profile', data);
    return response.data;
};

export const getSystemSettings = async () => {
    const response = await api.get('/admin/settings');
    return response.data;
};

export const updateSystemSettings = async (data) => {
    const response = await api.put('/admin/settings', data);
    return response.data;
};

export const uploadAdminAvatar = async (formData) => {
    const response = await api.post('/admin/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
