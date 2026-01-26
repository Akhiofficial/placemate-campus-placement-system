import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Bell, Camera, Mail, Phone, Save, Shield, Loader2 } from "lucide-react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

const StudentSettings = () => {
    const { refreshUser } = useOutletContext();
    const [activeTab, setActiveTab] = useState("General");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // User data state
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    // Form States
    const [generalForm, setGeneralForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
    });

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [notificationForm, setNotificationForm] = useState({
        email: true,
        browser: true,
        sms: false
    });

    const fileInputRef = useRef(null);

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/student/profile');
                // The backend returns either the full profile (with .user populated) OR just { user: ... } if no profile exists yet
                // But our updated controller ensures it returns *something* reasonable.
                // Actually, the getProfile controller might strictly return `res.json(profile)` where profile has .user populated
                // OR `res.json({ user })`. Let's handle both.

                const data = response.data;
                const userData = data.user || data; // Handle if it's nested or direct user object
                const profileData = data._id ? data : null; // If it has an ID, it's a student profile document

                setUser(userData);
                setProfile(profileData);

                // Initial Form Data
                if (userData && userData.name) {
                    const nameParts = userData.name.split(' ');
                    setGeneralForm({
                        firstName: nameParts[0] || "",
                        lastName: nameParts.slice(1).join(' ') || "",
                        email: userData.email || "",
                        phone: profileData?.phone || ""
                    });
                }

                if (profileData?.notificationPreferences) {
                    setNotificationForm(profileData.notificationPreferences);
                }

            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // Handle Input Change
    const handleGeneralChange = (e) => {
        setGeneralForm({ ...generalForm, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    // Save Profile
    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const payload = {
                firstName: generalForm.firstName,
                lastName: generalForm.lastName,
                email: generalForm.email,
                phone: generalForm.phone
            };

            await api.put('/student/profile', payload);
            if (refreshUser) refreshUser();
            alert("Profile updated successfully!");
            // Optionally refetch or just update local state if needed
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(error.response?.data?.msg || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    // Update Password
    const handleUpdatePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("New passwords do not match");
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        setSaving(true);
        try {
            await api.put('/auth/change-password', {
                oldPassword: passwordForm.oldPassword,
                newPassword: passwordForm.newPassword
            });
            alert("Password changed successfully!");
            setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            console.error("Error changing password:", error);
            alert(error.response?.data?.msg || "Failed to change password");
        } finally {
            setSaving(false);
        }
    };

    // Handle Photo Upload
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'profile');

        try {
            const response = await api.post('/student/upload-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Update local state to show new image immediately
            setProfile(prev => ({ ...prev, profilePictureUrl: response.data.imageUrl }));
            if (refreshUser) refreshUser();
            alert("Profile photo updated!");
        } catch (error) {
            console.error("Error uploading photo:", error);
            alert("Failed to upload photo");
        }
    };

    // Notification Handlers
    const handleNotificationChange = (key) => {
        setNotificationForm(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSaveNotifications = async () => {
        setSaving(true);
        try {
            await api.put('/student/profile', { notificationPreferences: notificationForm });
            alert("Notification preferences saved!");
        } catch (error) {
            console.error("Error saving notifications:", error);
            alert("Failed to save preferences");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-10">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <main className="flex-1 px-6 py-6 md:px-10 md:py-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <div className="flex items-center gap-2 text-sm text-foreground-muted mb-1">
                        <Link to="/student/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>›</span>
                        <span className="text-foreground font-medium">Settings</span>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
                    <p className="text-foreground-muted mt-1">Manage your personal information, security, and notification preferences.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-border">
                    {[
                        { id: "General", label: "General", icon: User },
                        { id: "Security", label: "Security", icon: Shield },
                        { id: "Notifications", label: "Notifications", icon: Bell },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 text-sm font-medium transition relative flex items-center gap-2 ${activeTab === tab.id ? "text-blue-600" : "text-foreground-muted hover:text-foreground"}`}
                        >
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden"><tab.icon size={18} /></span>
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabSettings"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {activeTab === "General" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Profile Details */}
                            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
                                <h2 className="text-xl font-bold text-foreground mb-1">Profile Details</h2>
                                <p className="text-sm text-foreground-muted mb-6">Update your photo and personal details here.</p>

                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    {/* Photo Upload */}
                                    <div className="flex flex-col items-center gap-3">
                                        <div
                                            className="w-32 h-32 rounded-full bg-orange-100 border-4 border-white dark:border-slate-800 shadow-md flex items-center justify-center overflow-hidden relative group cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {profile?.profilePictureUrl ? (
                                                <img src={profile.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-4xl text-blue-600 font-bold uppercase">
                                                    {user?.name?.charAt(0) || "U"}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                <Camera className="text-white" size={24} />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                                        >
                                            Change Photo
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                        />
                                    </div>

                                    {/* Form Fields */}
                                    <div className="flex-1 w-full space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-foreground">First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={generalForm.firstName}
                                                    onChange={handleGeneralChange}
                                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-foreground">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={generalForm.lastName}
                                                    onChange={handleGeneralChange}
                                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-foreground">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={generalForm.email}
                                                    onChange={handleGeneralChange}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-foreground">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={generalForm.phone}
                                                    onChange={handleGeneralChange}
                                                    placeholder="+1 (555) 000-0000"
                                                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={saving}
                                                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                                {saving ? "Saving..." : "Save Profile"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {(activeTab === "Security" || activeTab === "General") && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={activeTab === "Security" ? "block" : "hidden md:block"}
                        >
                            {/* Password & Security - Only render if Security tab is active, or stacked if wanted. */}
                            {activeTab === "Security" && (
                                <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
                                    <h2 className="text-xl font-bold text-foreground mb-1">Password & Security</h2>
                                    <p className="text-sm text-foreground-muted mb-6">Manage your password and 2-step verification.</p>

                                    <div className="space-y-5 max-w-2xl">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-semibold text-foreground">Current Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" size={16} />
                                                <input
                                                    type="password"
                                                    name="oldPassword"
                                                    value={passwordForm.oldPassword}
                                                    onChange={handlePasswordChange}
                                                    placeholder="........"
                                                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-foreground">New Password</label>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={passwordForm.newPassword}
                                                    onChange={handlePasswordChange}
                                                    placeholder="Enter new password"
                                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-foreground">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={handlePasswordChange}
                                                    placeholder="Confirm new password"
                                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-2 flex justify-end">
                                            <button
                                                onClick={handleUpdatePassword}
                                                disabled={saving}
                                                className="px-6 py-2.5 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-background-muted transition shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {saving ? "Updating..." : "Update Password"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "Notifications" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm"
                        >
                            <h2 className="text-xl font-bold text-foreground mb-1">Notification Preferences</h2>
                            <p className="text-sm text-foreground-muted mb-6">Choose how you want to be notified about important updates.</p>

                            <div className="space-y-6 max-w-2xl">
                                {[
                                    { id: "email", label: "Email Notifications", desc: "Receive emails about new job postings and application updates.", icon: Mail },
                                    { id: "browser", label: "Browser Notifications", desc: "Get push notifications in your browser.", icon: Bell },
                                    { id: "sms", label: "SMS Notifications", desc: "Receive text messages for interview schedules.", icon: Phone }
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-background hover:bg-background-muted/50 transition">
                                        <div className="flex gap-4 items-start">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                                <item.icon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground">{item.label}</h3>
                                                <p className="text-xs text-foreground-muted mt-0.5">{item.desc}</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={notificationForm[item.id]}
                                                onChange={() => handleNotificationChange(item.id)}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}

                                <div className="pt-4 flex justify-end">
                                    <button
                                        onClick={handleSaveNotifications}
                                        disabled={saving}
                                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        {saving ? "Saving..." : "Save Preferences"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default StudentSettings;
