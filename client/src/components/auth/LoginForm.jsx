import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Input from '../ui/Input';
import Button from '../ui/Button';
import RoleSelector from './RoleSelector';
import SocialLogin from './SocialLogin';

const LoginForm = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false); // Added state
    const [formData, setFormData] = useState({
        email: '',  
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgotSuccess, setForgotSuccess] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setForgotSuccess('');

        try {
            await api.post('/auth/forgot-password', { email: formData.email });
            setForgotSuccess('Password reset link has been sent to your email.');
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to send reset email.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password,
                role: role
            });

            const { token, user } = response.data;

            // Store auth data based on Remember Me
            if (rememberMe) {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('user', JSON.stringify(user));
            }

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
            console.error('Login Error:', err);
            setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    if (isForgotPassword) {
        return (
            <div className="w-full max-w-md mx-auto p-6 bg-background">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Reset Password</h1>
                    <p className="text-foreground-muted">Enter your email to receive a reset link.</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {forgotSuccess && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
                        {forgotSuccess}
                    </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-5">
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="name@university.edu"
                        icon={Mail}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsForgotPassword(false);
                            setForgotSuccess('');
                            setError('');
                        }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-background">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
                <p className="text-foreground-muted">Enter your details to access your dashboard.</p>
            </div>

            <RoleSelector selectedRole={role} onSelect={setRole} />

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="name@university.edu"
                    icon={Mail}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />

                <div className="space-y-1">
                    <Input
                        id="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        icon={Lock}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                            {showPassword ? "Hide Password" : "Show Password"}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span className="text-sm text-gray-500 group-hover:text-gray-700">Remember me</span>
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        Forgot Password?
                    </button>
                </div>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Logging In...' : 'Log In'}
                </Button>
            </form>

            <div className="mt-8">
                <SocialLogin role={role} />
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <a href="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
                    Sign up for free
                </a>
            </p>
        </div>
    );
};

export default LoginForm;
