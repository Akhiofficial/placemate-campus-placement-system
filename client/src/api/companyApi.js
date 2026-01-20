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
