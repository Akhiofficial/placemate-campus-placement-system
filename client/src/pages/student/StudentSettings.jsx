import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Bell, Camera, Mail, Phone, Save, Shield } from "lucide-react";

const StudentSettings = () => {
    const [activeTab, setActiveTab] = useState("General");

    return (
        <main className="flex-1 px-6 py-6 md:px-10 md:py-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <div className="flex items-center gap-2 text-sm text-foreground-muted mb-1">
                        <span className="hover:text-blue-600 transition cursor-pointer">Dashboard</span>
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
                                        <div className="w-32 h-32 rounded-full bg-orange-100 border-4 border-white dark:border-slate-800 shadow-md flex items-center justify-center overflow-hidden relative group cursor-pointer">
                                            {/* Placeholder Avatar */}
                                            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-4xl text-blue-600 font-bold">
                                                A
                                            </div>
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                <Camera className="text-white" size={24} />
                                            </div>
                                        </div>
                                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">Change Photo</button>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="flex-1 w-full space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-foreground">First Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue="Alex"
                                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-foreground">Last Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue="Johnson"
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
                                                    defaultValue="alex.j@university.edu"
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
                                                    defaultValue="+1 (555) 000-1234"
                                                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm flex items-center gap-2 cursor-pointer">
                                                Save Profile
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
                            className={activeTab === "Security" ? "block" : "hidden md:block"} // Show on Security tab, or generally on desktop below/stacked if we wanted, but sticking to tabs as per request. Actually user requested tabs.
                        >
                            {/* Password & Security - Only render if Security tab is active, OR if we want it stacked. The design implies tabs. */}
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
                                                    placeholder="Enter new password"
                                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-semibold text-foreground">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Confirm new password"
                                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                                                />
                                            </div>
                                        </div>
                                        <div className="pt-2 flex justify-end">
                                            <button className="px-6 py-2.5 bg-card border border-border text-foreground rounded-lg font-medium hover:bg-background-muted transition shadow-sm cursor-pointer">
                                                Update Password
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "Notifications" && (
                        <div className="py-12 text-center text-foreground-muted">
                            <Bell size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Notification settings coming soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default StudentSettings;
