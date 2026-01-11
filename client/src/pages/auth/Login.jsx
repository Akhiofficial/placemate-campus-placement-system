import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import { GraduationCap } from 'lucide-react';

const Login = () => {
    return (
        <div className="min-h-screen flex w-full">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex w-1/2 relative bg-[#0f172a] overflow-hidden text-white items-center justify-center">
                <div
                    style={{
                        width: '554px',
                        height: '400px',
                        filter: 'blur(57px)',
                        backgroundImage: 'linear-gradient(to bottom right, #2563eb, #7c3aed)',
                        animation: 'rotate 6s linear infinite',
                        opacity: '0.9',
                        borderRadius: '30% 70% 70% 30%/30% 30% 70% 70%',
                        position: 'absolute',
                        zIndex: 0
                    }}
                />

                <div className="absolute inset-0 bg-black/20 z-10" />

                <div className="relative z-20 flex flex-col justify-between h-full p-12 lg:p-16 w-full">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                            <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-wide">PlaceMate</span>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <h1 className="text-5xl font-bold leading-tight">
                            Launch your career with PlaceMate.
                        </h1>
                        <p className="text-lg text-blue-100/90 leading-relaxed">
                            Connect with top recruiters, streamline your applications, and land your dream job right from campus.
                        </p>

                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <img
                                        key={i}
                                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                                        alt="User"
                                        className="w-10 h-10 rounded-full border-2 border-[#0a192f]"
                                    />
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-yellow-400 text-sm">★★★★★</div>
                                <span className="text-xs text-blue-200">Trusted by 5,000+ Students</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-blue-200/60">
                        © 2026 PlaceMate Inc. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-background">
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;
