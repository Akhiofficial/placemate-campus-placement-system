import api from './axios';

export const getStudentDashboard = async () => {
  try {
    const response = await api.get('/student/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};
