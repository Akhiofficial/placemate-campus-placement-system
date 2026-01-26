import React, { useState, useEffect } from 'react';
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
    Camera,
    Plus,
    X,
    Check
} from 'lucide-react';
import { getAdminProfile, updateAdminProfile, getSystemSettings, updateSystemSettings, uploadAdminAvatar } from '../../api/adminApi';

const AdminSettings = () => {
    // Profile State
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        jobTitle: '',
        notificationPreferences: {
            newApplicant: true,
            interviewReminders: true, // mapped to emailAlerts in UI for simplicity or we add specific fields
            jobStatus: false // mapped to pushNotifications
        }
    });

    // System Settings State
    const [settings, setSettings] = useState({
        academicYear: '2023 - 2024',
        academicYears: [],
        placementSeasonStart: '',
        placementSeasonEnd: '',
        openRegistration: true
    });

    const [isAddingYear, setIsAddingYear] = useState(false);
    const [newYearInput, setNewYearInput] = useState('');

    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [profileData, settingsData] = await Promise.all([
                getAdminProfile(),
                getSystemSettings()
            ]);

            setProfile({
                name: profileData.name || '',
                email: profileData.email || '',
                jobTitle: profileData.jobTitle || '',
                employeeId: profileData.employeeId || '',
                profileImage: profileData.profileImage || '',
                notificationPreferences: profileData.notificationPreferences || {}
            });

            setSettings({
                academicYear: settingsData.academicYear || '2025-2026',
                academicYears: settingsData.academicYears || [],
                placementSeasonStart: settingsData.placementSeasonStart ? new Date(settingsData.placementSeasonStart).toISOString().split('T')[0] : '',
                placementSeasonEnd: settingsData.placementSeasonEnd ? new Date(settingsData.placementSeasonEnd).toISOString().split('T')[0] : '',
                openRegistration: settingsData.openRegistration
            });
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    // Profile Handlers
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            setSavingProfile(true);
            await updateAdminProfile(profile);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Error saving profile:", error);
            alert('Failed to save profile.');
        } finally {
            setSavingProfile(false);
        }
    };

    // Settings Handlers
    const handleSettingChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveSystemSettings = async () => { // Auto-save on toggle, manual for dates/year? Let's make manual save for now or implicit for toggle.
        try {
            setSavingSettings(true);
            await updateSystemSettings(settings); // This saves all current settings state
            // alert('System settings updated!'); 
        } catch (error) {
            console.error("Error saving settings:", error);
        } finally {
            setSavingSettings(false);
        }
    };

    const toggleOpenRegistration = async () => {
        const newValue = !settings.openRegistration;
        setSettings(prev => ({ ...prev, openRegistration: newValue }));

        // Immediate save for toggles is usually better UX
        try {
            await updateSystemSettings({ ...settings, openRegistration: newValue });
        } catch (error) {
            console.error("Error updating toggle:", error);
            // Revert on error
            setSettings(prev => ({ ...prev, openRegistration: !newValue }));
        }
    };



    const togglePushNotifications = async () => {
        const newVal = !profile.notificationPreferences?.jobStatus;
        const newPrefs = { ...profile.notificationPreferences, jobStatus: newVal };
        setProfile(prev => ({ ...prev, notificationPreferences: newPrefs }));
        // Immediate save
        try {
            await updateAdminProfile({ notificationPreferences: newPrefs });
        } catch (error) { console.error(error); }
        try {
            await updateAdminProfile({ notificationPreferences: newPrefs });
        } catch (error) { console.error(error); }
    };

    const handleAddYear = () => {
        if (!newYearInput.trim()) return;

        // Simple validation format YYYY - YYYY
        // Not enforcing strict regex for now to allow flexibility

        if (settings.academicYears.includes(newYearInput.trim())) {
            alert('This academic year already exists.');
            return;
        }

        const newYears = [...settings.academicYears, newYearInput.trim()].sort();
        setSettings(prev => ({
            ...prev,
            academicYears: newYears,
            academicYear: newYearInput.trim() // Auto-select new year
        }));

        setIsAddingYear(false);
        setNewYearInput('');
    };


    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>;

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
                        <img
                            src={profile.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'A')}&background=random`}
                            alt="Admin"
                            className="w-full h-full object-cover"
                        />
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
                    <button
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/20 disabled:opacity-50"
                    >
                        {savingProfile ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>

                <div className="p-6 flex flex-col md:flex-row gap-8">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative group w-24 h-24 rounded-full bg-orange-100 border-4 border-white dark:border-gray-800 shadow-sm overflow-hidden">
                            <img
                                src={profile.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'A')}&background=random`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="w-6 h-6 text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const formData = new FormData();
                                        formData.append('image', file);

                                        try {
                                            // Optimistic update
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setProfile(prev => ({ ...prev, profileImage: reader.result }));
                                            };
                                            reader.readAsDataURL(file);

                                            await uploadAdminAvatar(formData);
                                            toast.success("Profile photo updated");
                                        } catch (error) {
                                            console.error("Error uploading image:", error);
                                            toast.error("Failed to upload image");
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline relative">
                            Change Photo
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    const formData = new FormData();
                                    formData.append('image', file);

                                    try {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setProfile(prev => ({ ...prev, profileImage: reader.result }));
                                        };
                                        reader.readAsDataURL(file);

                                        await uploadAdminAvatar(formData);
                                        toast.success("Profile photo updated");
                                    } catch (error) {
                                        console.error("Error uploading image:", error);
                                        toast.error("Failed to upload image");
                                    }
                                }}
                            />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                value={profile.name}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Employee ID</label>
                            <input
                                type="text"
                                name="employeeId"
                                value={profile.employeeId || ''}
                                onChange={handleProfileChange}
                                placeholder="ADMIN-001"
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Role</label>
                            <input
                                name="jobTitle"
                                type="text"
                                value={profile.jobTitle}
                                onChange={handleProfileChange}
                                placeholder="e.g. Chief Placement Officer"
                                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* System Configurations */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                            <Settings className="w-5 h-5" />
                        </div>
                        System Configurations
                    </h2>
                    <button
                        onClick={handleSaveSystemSettings}
                        disabled={savingSettings}
                        className="px-4 py-2 bg-dark-bg border border-border text-foreground hover:bg-accent rounded-lg text-sm font-medium transition-colors"
                    >
                        {savingSettings ? 'Saving...' : 'Save Configs'}
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Active Academic Year</label>
                            {isAddingYear ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={newYearInput}
                                        onChange={(e) => setNewYearInput(e.target.value)}
                                        placeholder="e.g. 2027 - 2028"
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleAddYear}
                                        className="p-2.5 bg-green-100 text-green-600 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsAddingYear(false);
                                            setNewYearInput('');
                                        }}
                                        className="p-2.5 bg-red-100 text-red-600 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <select
                                            name="academicYear"
                                            value={settings.academicYear}
                                            onChange={handleSettingChange}
                                            className="w-full appearance-none px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        >
                                            {settings.academicYears.length > 0 ? (
                                                settings.academicYears.map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))
                                            ) : (
                                                <>
                                                    <option>2023 - 2024</option>
                                                    <option>2024 - 2025</option>
                                                    <option>2025 - 2026</option>
                                                    <option>2026 - 2027</option>
                                                </>
                                            )}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsAddingYear(true)}
                                        className="p-2.5 border border-border rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                                        title="Add New Academic Year"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Placement Season</label>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="relative w-full sm:flex-1">
                                    <input
                                        type="date"
                                        name="placementSeasonStart"
                                        value={settings.placementSeasonStart}
                                        onChange={handleSettingChange}
                                        className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <span className="text-muted-foreground text-sm self-center sm:self-auto">to</span>
                                <div className="relative w-full sm:flex-1">
                                    <input
                                        type="date"
                                        name="placementSeasonEnd"
                                        value={settings.placementSeasonEnd}
                                        onChange={handleSettingChange}
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
                                onClick={toggleOpenRegistration}
                                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${settings.openRegistration ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                            >
                                <span
                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${settings.openRegistration ? 'translate-x-6' : 'translate-x-1'}`}
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
                    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
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
                            onClick={togglePushNotifications}
                            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${profile.notificationPreferences?.jobStatus ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${profile.notificationPreferences?.jobStatus ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
