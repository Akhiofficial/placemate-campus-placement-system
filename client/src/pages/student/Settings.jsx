import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import {
    User,
    Lock,
    Bell,
    Save,
    Camera
} from 'lucide-react';

const Settings = () => {
    const { user } = useMockData();
    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="p-4 lg:p-8 animate-fade-in max-w-5xl mx-auto h-full overflow-y-auto no-scrollbar pb-20">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Account Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your personal information, security, and notification preferences.</p>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-200 dark:border-slate-700 mb-8">
                {['general', 'security', 'notifications'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-bold capitalize transition-all relative ${activeTab === tab
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="space-y-8">

                {/* Profile Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                    <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">Profile Details</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Update your photo and personal details here.</p>

                    <div className="flex items-center gap-8 mb-8">
                        <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full w-24 h-24 flex items-center justify-center text-4xl shadow-inner relative group cursor-pointer overflow-hidden border-4 border-white dark:border-slate-700">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-full h-full" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <button className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">Change Photo</button>
                            <p className="text-xs text-slate-400 mt-1">Recommended: 400x400px (JPG, PNG)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">First Name</label>
                            <input
                                type="text"
                                defaultValue={user.name.split(' ')[0]}
                                className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Last Name</label>
                            <input
                                type="text"
                                defaultValue={user.name.split(' ')[1] || ''}
                                className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Email Address</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    defaultValue={user.email}
                                    className="w-full pl-10 pr-3 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Phone Number</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+1</span>
                                <input
                                    type="text"
                                    defaultValue="(555) 000-1234"
                                    className="w-full pl-10 pr-3 py-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-700">
                        <button className="bg-blue-600 dark:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 active:scale-95">
                            Save Profile
                        </button>
                    </div>
                </div>

                {/* Password Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
                    <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">Password & Security</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Manage your password and 2-step verification.</p>

                    <div className="space-y-6 max-w-2xl">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Current Password</label>
                            <input
                                type="password"
                                placeholder="........"
                                className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">New Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Confirm New Password</label>
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
