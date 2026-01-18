import React, { useState } from 'react';
import {
    User,
    Bell,
    Users,
    Lock,
    Check,
    Plus,
    MoreVertical,
    Mail,
    Shield,
    Trash2
} from 'lucide-react';

const CompanySettings = () => {
    // Account Settings State
    const [accountForm, setAccountForm] = useState({
        fullName: 'Jane Doe',
        email: 'jane.doe@acmecorp.com',
        role: 'Senior Recruiter',
        password: 'password123'
    });

    // Notification Preferences State
    const [notifications, setNotifications] = useState({
        newApplicant: true,
        interviewReminders: true,
        jobStatus: false
    });

    // Team Members Mock Data
    const [teamMembers, setTeamMembers] = useState([
        {
            id: 1,
            name: 'Michael Scott',
            email: 'michael@acmecorp.com',
            role: 'Admin',
            status: 'Active',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
        },
        {
            id: 2,
            name: 'Jim Halpert',
            email: 'jim.h@acmecorp.com',
            role: 'Recruiter',
            status: 'Active',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
        },
        {
            id: 3,
            name: 'Pam Beesly',
            email: 'pam.b@acmecorp.com',
            role: 'Editor',
            status: 'Invited',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150'
        }
    ]);

    const handleAccountChange = (e) => {
        const { name, value } = e.target;
        setAccountForm(prev => ({ ...prev, [name]: value }));
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-5xl mx-auto pb-12 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Settings</h1>
                    <p className="text-foreground-muted mt-1">Manage your recruiter account and team preferences</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 text-sm font-semibold text-foreground-muted hover:text-foreground transition-colors">
                        Discard Changes
                    </button>
                    <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all">
                        Save Settings
                    </button>
                </div>
            </div>

            {/* Account Settings Section */}
            <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex items-center gap-3">
                    <User className="text-blue-600" size={24} />
                    <h2 className="text-lg font-bold text-foreground">Account Settings</h2>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={accountForm.fullName}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    {/* Personal Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Personal Email</label>
                        <input
                            type="email"
                            name="email"
                            value={accountForm.email}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Role</label>
                        <div className="relative">
                            <select
                                name="role"
                                value={accountForm.role}
                                onChange={handleAccountChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                            >
                                <option>Senior Recruiter</option>
                                <option>Recruiter</option>
                                <option>Hiring Manager</option>
                                <option>Admin</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Password</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="password"
                                value={accountForm.password}
                                readOnly
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-background/50 border border-border rounded-lg text-sm text-foreground-muted cursor-not-allowed"
                            />
                            <button className="shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification Preferences Section */}
            <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex items-center gap-3">
                    <Bell className="text-blue-600" size={24} />
                    <h2 className="text-lg font-bold text-foreground">Notification Preferences</h2>
                </div>
                <div className="p-8 space-y-6">
                    {/* Toggle Item 1 */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-foreground">New Applicant Alerts</h3>
                            <p className="text-sm text-foreground-muted mt-1">Get notified immediately when a student applies to your job postings.</p>
                        </div>
                        <button
                            onClick={() => toggleNotification('newApplicant')}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${notifications.newApplicant ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${notifications.newApplicant ? 'translate-x-6' : 'translate-x-0'}`} />
                            {notifications.newApplicant && <Check size={10} className="absolute right-2 top-1.5 text-white" />}
                        </button>
                    </div>

                    <div className="h-px bg-border/50"></div>

                    {/* Toggle Item 2 */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-foreground">Interview Reminders</h3>
                            <p className="text-sm text-foreground-muted mt-1">Daily summaries of your upcoming scheduled interviews.</p>
                        </div>
                        <button
                            onClick={() => toggleNotification('interviewReminders')}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${notifications.interviewReminders ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${notifications.interviewReminders ? 'translate-x-6' : 'translate-x-0'}`} />
                            {notifications.interviewReminders && <Check size={10} className="absolute right-2 top-1.5 text-white" />}
                        </button>
                    </div>

                    <div className="h-px bg-border/50"></div>

                    {/* Toggle Item 3 */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-foreground">Job Status Updates</h3>
                            <p className="text-sm text-foreground-muted mt-1">Notifications regarding approval and expiration of your job listings.</p>
                        </div>
                        <button
                            onClick={() => toggleNotification('jobStatus')}
                            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${notifications.jobStatus ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${notifications.jobStatus ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Team Management Section */}
            <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="text-blue-600" size={24} />
                        <h2 className="text-lg font-bold text-foreground">Team Management</h2>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg transition-colors">
                        <Plus size={16} />
                        Invite Member
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-background-muted border-b border-border">
                                <th className="px-6 py-4 text-xs font-bold text-foreground-muted uppercase tracking-wider">Member</th>
                                <th className="px-6 py-4 text-xs font-bold text-foreground-muted uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-foreground-muted uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-foreground-muted uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {teamMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-background-muted/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-border" />
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{member.name}</p>
                                                <p className="text-xs text-foreground-muted">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium 
                                            ${member.role === 'Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                                member.role === 'Recruiter' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                            <span className={`text-sm font-medium ${member.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                                                {member.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-400 hover:text-foreground hover:bg-gray-100 dark:hover:bg-background-muted rounded-full transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-border mt-auto">
                    <button className="w-full py-2 text-sm text-center text-foreground-muted hover:text-blue-600 font-medium transition-colors">
                        View All Members
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanySettings;
