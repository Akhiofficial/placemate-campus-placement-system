import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
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
import { getMe, updateUserDetails, changePassword } from '../../api/authApi';
import { X } from 'lucide-react';

const CompanySettings = () => {
    const { refreshUser } = useOutletContext();
    // Account Settings State
    const [accountForm, setAccountForm] = useState({
        fullName: 'Jane Doe',
        email: 'jane.doe@acmecorp.com',
        role: 'Senior Recruiter',
        password: 'password123',
        companyName: ''
    });

    // Notification Preferences State
    const [notifications, setNotifications] = useState({
        newApplicant: true,
        interviewReminders: true,
        jobStatus: false
    });

    // Password Change State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const fetchSettings = async () => {
        try {
            const { data } = await getMe();
            setAccountForm({
                fullName: data.name,
                email: data.email,
                role: data.jobTitle || 'Recruiter',
                companyName: data.companyName || '',
                password: '' // Don't show password
            });
            if (data.notificationPreferences) {
                setNotifications(prev => ({ ...prev, ...data.notificationPreferences }));
            }
        } catch (err) {
            console.error("Failed to fetch settings", err);
        }
    };
    React.useEffect(() => {
        fetchSettings();
    }, []);

    const handleDiscard = () => {
        fetchSettings();
        refreshUser(); // Refresh sidebar too
    };

    const handleAccountChange = (e) => {
        const { name, value } = e.target;
        setAccountForm(prev => ({ ...prev, [name]: value }));
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        try {
            await updateUserDetails({
                name: accountForm.fullName,
                email: accountForm.email,
                jobTitle: accountForm.role,
                companyName: accountForm.companyName,
                notificationPreferences: notifications
            });
            await refreshUser(); // Refresh sidebar data immediately
            alert('Settings saved successfully');
        } catch (err) {
            console.error('Failed to save settings', err);
            alert('Failed to save settings');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("New passwords do not match");
            return;
        }
        try {
            await changePassword(passwordForm.oldPassword, passwordForm.newPassword);
            alert("Password changed successfully");
            setShowPasswordModal(false);
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error(err);
            alert(typeof err === 'string' ? err : "Failed to change password");
        }
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
                    <button
                        onClick={handleDiscard}
                        className="px-5 py-2.5 text-sm font-semibold text-foreground-muted hover:text-foreground transition-colors"
                    >
                        Discard Changes
                    </button>
                    <button onClick={handleSave} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all">
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

                    {/* Company Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            value={accountForm.companyName}
                            onChange={handleAccountChange}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            placeholder="e.g. Acme Corp"
                        />
                    </div>



                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Password</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="password"
                                value="********"
                                readOnly
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-background/50 border border-border rounded-lg text-sm text-foreground-muted cursor-not-allowed"
                            />
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
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

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-card w-full max-w-md rounded-xl shadow-xl overflow-hidden border border-border">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="text-lg font-bold text-foreground">Change Password</h3>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="text-foreground-muted hover:text-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.oldPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="px-4 py-2 text-sm font-semibold text-foreground-muted hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanySettings;
