import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Input from '../ui/Input';
import Button from '../ui/Button';
import RoleSelector from './RoleSelector';
import SocialLogin from './SocialLogin';

const SignupForm = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        adminKey: '',
        agreeToTerms: false
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [adminSuccess, setAdminSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setErrors({});

        // Basic Validation
        const newErrors = {};
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        if (!formData.agreeToTerms) {
            setServerError("You must agree to the Terms of Service");
            return;
        }
        if (role === 'admin' && !formData.adminKey) {
            newErrors.adminKey = "Admin secret key is required";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            if (role === 'admin') {
                await api.post('/auth/request-admin', {
                    name: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    adminKey: formData.adminKey
                });
                setAdminSuccess(true);
            } else {
                const response = await api.post('/auth/signup', {
                    name: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    role: role
                });

                const { token, user } = response.data;

                // Store auth data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));

                // Redirect based on role
                if (user.role === 'student') {
                    navigate('/student/dashboard');
                } else if (user.role === 'company') {
                    navigate('/company/dashboard');
                } else {
                    navigate('/student/dashboard');
                }
            }

        } catch (err) {
            console.error('Signup Error:', err);
            setServerError(err.response?.data?.msg || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear specific error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    if (adminSuccess) {
        return (
            <div className="w-full max-w-md text-center">
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h2 className="text-2xl font-bold text-green-700 mb-2">Request Submitted</h2>
                    <p className="text-green-600">
                        Your request for admin access has been submitted successfully to the Super Admin.
                        You will be able to log in once your account is approved.
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/')}>
                    Back to Login
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
                <p className="text-foreground-muted">Get started with your campus placement process</p>
            </div>

            <div className="mb-6">
                <RoleSelector selectedRole={role} onSelect={setRole} />
            </div>

            {serverError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
                    {serverError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Full Name"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    icon={User}
                    error={errors.fullName}
                    required
                />

                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="example@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    icon={Mail}
                    error={errors.email}
                    required
                />

                {role === 'admin' && (
                    <Input
                        label="Admin Secret Key"
                        name="adminKey"
                        type="password"
                        placeholder="Enter admin secret key"
                        value={formData.adminKey}
                        onChange={handleChange}
                        icon={Lock}
                        error={errors.adminKey}
                        required
                    />
                )}

                <div className="space-y-4">
                    <div className="relative">
                        <Input
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            icon={Lock}
                            error={errors.password}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[34px] text-foreground-muted hover:text-foreground"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <div className="relative">
                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            icon={Lock}
                            error={errors.confirmPassword}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-[34px] text-foreground-muted hover:text-foreground"
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-ring"
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-foreground-muted cursor-pointer select-none">
                        I agree to the <a href="#" className="text-primary hover:text-primary-hover font-medium">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-hover font-medium">Privacy Policy</a>
                    </label>
                </div>

                <Button variant="primary" type="submit" className="w-full mt-2" disabled={loading}>
                    {loading ? (role === 'admin' ? 'Requesting Access...' : 'Creating Account...') : (role === 'admin' ? 'Request Admin Access' : 'Create Account')}
                </Button>
            </form>


            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-foreground-muted">Or continue with</span>
                </div>
            </div>

            <div className="mb-8">
                <SocialLogin role={role} />
            </div>

            <p className="mt-8 text-center text-sm text-foreground-muted">
                Already a member?{' '}
                <a href="/" className="font-semibold text-primary hover:text-primary-hover">
                    Log In
                </a>
            </p>
        </div>
    );
};

export default SignupForm;
