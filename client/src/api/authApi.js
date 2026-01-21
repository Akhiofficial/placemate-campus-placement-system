import api from './axios';

// Login User
export const login = async (email, password) => {
    try {
        const res = await api.post('/auth/login', { email, password });
        return res.data;
    } catch (err) {
        throw err.response?.data?.msg || 'Login failed';
    }
};

// Signup User
export const signup = async (userData) => {
    try {
        const res = await api.post('/auth/signup', userData);
        return res.data;
    } catch (err) {
        throw err.response?.data?.msg || 'Signup failed';
    }
};

// Update User Details
export const updateUserDetails = async (userData) => {
    try {
        const res = await api.put('/auth/update-details', userData);
        return res.data;
    } catch (err) {
        throw err.response?.data?.msg || 'Failed to update user details';
    }
};

// Change Password
export const changePassword = async (oldPassword, newPassword) => {
    try {
        const res = await api.put('/auth/change-password', { oldPassword, newPassword });
        return res.data;
    } catch (err) {
        throw err.response?.data?.msg || 'Failed to change password';
    }
};

// Get Current User
export const getMe = async () => {
    try {
        const res = await api.get('/auth/me');
        return res.data;
    } catch (err) {
        throw err.response?.data?.msg || 'Failed to fetch user';
    }
};
