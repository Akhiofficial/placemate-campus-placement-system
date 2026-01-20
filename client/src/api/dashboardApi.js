import api from './axios';

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/student/dashboard');
    return response.data.stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};
