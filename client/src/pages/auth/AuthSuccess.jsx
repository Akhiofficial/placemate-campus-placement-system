import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setError('No token received');
            setTimeout(() => navigate('/'), 3000);
            return;
        }

        const handleAuth = async () => {
            try {
                // Store token temporarily to make the request
                localStorage.setItem('token', token);

                // Fetch user details
                const response = await api.get('/auth/me');
                const user = response.data.data;

                // Store user details
                localStorage.setItem('user', JSON.stringify(user));

                // Redirect based on role
                if (user.role === 'student') {
                    navigate('/student/dashboard');
                } else if (user.role === 'company') {
                    navigate('/company/dashboard');
                } else if (user.role === 'admin' || user.role === 'superadmin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/student/dashboard');
                }
            } catch (err) {
                console.error('Auth Success Error:', err);
                setError('Failed to retrieve user details.');
                localStorage.removeItem('token');
                setTimeout(() => navigate('/'), 3000);
            }
        };

        handleAuth();
    }, [searchParams, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            {error ? (
                <div className="p-4 bg-red-100 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            ) : (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-foreground">Authenticating...</h2>
                    <p className="text-foreground-muted">Please wait while we log you in.</p>
                </div>
            )}
        </div>
    );
};

export default AuthSuccess;
