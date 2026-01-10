import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../ui/Input';
import Button from '../ui/Button';
import RoleSelector from './RoleSelector';
import SocialLogin from './SocialLogin';

const LoginForm = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // In a real app, base URL would be env var
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: formData.email,
                password: formData.password
            });

            const { token, user } = response.data;

            // Store auth data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect based on role
            if (user.role === 'student') {
                navigate('/student/dashboard');
            } else if (user.role === 'recruiter') {
                // Future route
                navigate('/recruiter/dashboard');
            } else if (user.role === 'admin') {
                // Future route
                navigate('/admin/dashboard');
            } else {
                // Fallback
                navigate('/student/dashboard');
            }

        } catch (err) {
            console.error('Login Error:', err);
            setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

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
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-gray-500 group-hover:text-gray-700">Remember me</span>
                    </label>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        Forgot Password?
                    </a>
                </div>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Logging In...' : 'Log In'}
                </Button>
            </form>

            <div className="mt-8">
                <SocialLogin />
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
