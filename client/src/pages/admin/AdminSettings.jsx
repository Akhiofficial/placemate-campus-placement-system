import React, { useState } from 'react';
import {
    User,
    Settings,
    Bell,
    Save,
    Calendar,
    Shield,
    Mail,
    Smartphone,
    ToggleLeft,
    ToggleRight,
    Camera
} from 'lucide-react';

const AdminSettings = () => {
    const [openRegistration, setOpenRegistration] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Admin Settings</h1>
                    <p className="text-muted-foreground text-sm mt-1">Configure your profile, system preferences, and security settings.</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 border border-border rounded-lg text-muted-foreground bg-card hover:bg-accent hover:text-foreground">
                        <Bell className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border border-border">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander" alt="Admin" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Profile Settings */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                            <User className="w-5 h-5" />
                        </div>
                        Profile Settings
                    </h2>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20">
                        Save Profile
                    </button>
                </div>

                <div className="p-6 flex flex-col md:flex-row gap-8">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 rounded-full bg-orange-100 border-4 border-white dark:border-gray-800 shadow-sm overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                            Change Photo
                        </button>
                    </div>

                    {/* Form */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Full Name</label>
                            <input
                                type="text"
                                defaultValue="Alexander Mitchell"
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Email Address</label>
                            <input
                                type="email"
                                defaultValue="a.mitchell@university.edu"
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Employee ID</label>
                            <input
                                type="text"
                                defaultValue="TPO-8820"
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Role</label>
                            <input
                                type="text"
                                defaultValue="Chief Placement Officer"
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* System Configurations */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                            <Settings className="w-5 h-5" />
                        </div>
                        System Configurations
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Active Academic Year</label>
                            <div className="relative">
                                <select className="w-full appearance-none px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                                    <option>2023 - 2024</option>
                                    <option>2024 - 2025</option>
                                    <option>2025 - 2026</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Placement Season</label>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="relative w-full sm:flex-1">
                                    <input
                                        type="date"
                                        defaultValue="2024-08-01"
                                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <span className="text-muted-foreground text-sm self-center sm:self-auto">to</span>
                                <div className="relative w-full sm:flex-1">
                                    <input
                                        type="date"
                                        defaultValue="2025-05-31"
                                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="text-sm font-medium text-foreground mb-2 block">System Mode</label>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background">
                            <div>
                                <h3 className="text-base font-semibold text-foreground">Open Registration</h3>
                                <p className="text-sm text-muted-foreground mt-0.5">Allow new students to register for the current season.</p>
                            </div>
                            <button
                                onClick={() => setOpenRegistration(!openRegistration)}
                                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${openRegistration ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${openRegistration ? 'translate-x-6' : 'translate-x-1'}`}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications Preferences */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden mb-10">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                            <Bell className="w-5 h-5" />
                        </div>
                        Notifications Preferences
                    </h2>
                </div>

                <div className="p-6 space-y-0 divide-y divide-border">
                    <div className="flex items-center justify-between py-4 first:pt-0">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-blue-600">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-foreground">Email Alerts</h3>
                                <p className="text-sm text-muted-foreground mt-0.5">Receive summaries of daily application activity.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setEmailAlerts(!emailAlerts)}
                            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${emailAlerts ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${emailAlerts ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between py-4 last:pb-0">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/10 rounded-lg text-purple-600">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-foreground">Push Notifications</h3>
                                <p className="text-sm text-muted-foreground mt-0.5">Instant alerts for high-priority company responses.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setPushNotifications(!pushNotifications)}
                            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${pushNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${pushNotifications ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
