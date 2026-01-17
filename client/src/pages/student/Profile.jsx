import React, { useState, useEffect } from 'react';
import { useMockData } from '../../context/MockDataContext';
import {
    User, Mail, Phone, MapPin, Edit, Save,
    Camera, Eye, Briefcase, FileText,
    GraduationCap, Download, Calendar as CalendarIcon, CheckCircle
} from 'lucide-react';

const Profile = () => {
    const { user, updateProfile, themeMode } = useMockData();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(user);
    const [activeTab, setActiveTab] = useState('personal');
    const [savedSuccess, setSavedSuccess] = useState(false);

    // Sync form data when user context changes
    useEffect(() => {
        setFormData(user);
    }, [user]);

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Save/Publish Action
    const handleSave = () => {
        updateProfile(formData);
        setIsEditing(false);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000); // Hide success message after 3s
    };

    // Reusable Input Component to prevent style disjoints
    const ProfileInput = ({ label, name, value, disabled, type = "text", icon: Icon }) => (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide ml-1">
                {label}
            </label>
            <div className="relative group">
                <input
                    type={type}
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    disabled={disabled}
                    className={`
                        w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 outline-none
                        ${disabled
                            ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        }
                    `}
                />
                {Icon && (
                    <Icon className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
            </div>
        </div>
    );

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto h-full overflow-y-auto no-scrollbar pb-20 fade-in-up">

            {/* Header Area */}
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Profile</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your personal information and academic records.</p>
                </div>
                <div className="flex gap-3">
                    {savedSuccess && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
                            <CheckCircle className="w-4 h-4" /> Changes Saved!
                        </div>
                    )}
                    <button className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                        <Eye className="w-4 h-4" /> Public View
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN: Persistent Profile Card (4 cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden">

                        {/* Edit Toggle (Desktop) */}
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-200 ${isEditing ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-blue-600'}`}
                        >
                            <Edit className="w-4 h-4" />
                        </button>

                        {/* Avatar */}
                        <div className="relative mb-5 mt-2 group cursor-pointer">
                            <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-700 shadow-xl">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=b6e3f4`}
                                    alt="avatar"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{formData.name}</h2>
                        <div className="flex flex-col gap-1 items-center mb-6">
                            <p className="text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full uppercase tracking-wide">
                                {formData.universityRollNo || 'ID: UNKNOWN'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{formData.major}</p>
                        </div>

                        {/* Open To Work Badge */}
                        <span className="px-5 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-[11px] font-extrabold tracking-widest uppercase border border-green-100 dark:border-green-900/50 mb-8 shadow-sm">
                            Open to Work
                        </span>

                        {/* Contact Details (Fixed Visibility) */}
                        <div className="w-full text-left space-y-5 pt-8 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-4 group">
                                <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email</span>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[200px]" title={formData.email}>
                                        {formData.email || 'alex.johnson@university.edu'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Phone</span>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        {formData.phone || '+1 (555) 123-4567'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Location</span>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                        {formData.location || 'San Francisco, CA'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Tabs & Editing (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* Stats Metrics */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Current CGPA', value: user.cgpa || '8.9', trend: '+0.2 vs last sem', trendColor: 'text-green-500', icon: GraduationCap },
                            { label: 'Backlogs', value: '0', trend: 'Keep it up!', trendColor: 'text-slate-400', icon: CheckCircle },
                            { label: 'Attendance', value: '92%', trend: 'Overall Average', trendColor: 'text-blue-500', icon: CalendarIcon }
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-center gap-2 mb-3 text-slate-400 group-hover:text-blue-500 transition-colors">
                                    <stat.icon className="w-4 h-4" />
                                    <span className="text-[10px] uppercase font-bold tracking-wider">{stat.label}</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                                    <p className={`text-[10px] font-bold mb-1.5 ${stat.trendColor}`}>{stat.trend}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-1 flex flex-col">

                        {/* Tab Navigation */}
                        <div className="flex border-b border-slate-200 dark:border-slate-700 px-8 pt-6">
                            {['personal', 'academic', 'skills'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                                        pb-4 px-6 text-sm font-bold capitalize transition-all relative
                                        ${activeTab === tab
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                        }
                                    `}
                                >
                                    {tab === 'personal' ? 'Personal Info' : tab === 'academic' ? 'Academic Record' : 'Skills & Resume'}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Panels */}
                        <div className="p-8 flex-1">

                            {/* 1. PERSONAL INFO TAB */}
                            {activeTab === 'personal' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">Personal Details</h3>
                                        {isEditing && (
                                            <button
                                                onClick={handleSave}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
                                            >
                                                Save Changes
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ProfileInput
                                            label="First Name"
                                            name="firstName"
                                            value={formData.name.split(' ')[0]}
                                            disabled={!isEditing}
                                        />
                                        <ProfileInput
                                            label="Last Name"
                                            name="lastName"
                                            value={formData.name.split(' ')[1]}
                                            disabled={!isEditing}
                                        />
                                        <ProfileInput
                                            label="Date of Birth"
                                            value="05/15/2002"
                                            disabled={!isEditing}
                                            icon={CalendarIcon}
                                        />
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide ml-1">Gender</label>
                                            <div className="relative">
                                                <select
                                                    disabled={!isEditing}
                                                    className={`
                                                        w-full px-4 py-3 rounded-xl text-sm font-semibold appearance-none outline-none transition-colors
                                                        ${!isEditing
                                                            ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600'
                                                        }
                                                    `}
                                                >
                                                    <option>Male</option>
                                                    <option>Female</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide ml-1">Address</label>
                                            <textarea
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                rows="2"
                                                className={`
                                                    w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none resize-none transition-colors
                                                    ${!isEditing
                                                        ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                                                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500'
                                                    }
                                                `}
                                            />
                                        </div>
                                    </div>

                                    {/* ACADEMIC INFORMATION SECTION (Inside Personal Tab) */}
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6 pt-4 border-t border-slate-100 dark:border-slate-700">Academic Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <ProfileInput
                                                label="University Roll No"
                                                value={formData.universityRollNo}
                                                disabled={true}
                                            />
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide ml-1">Branch</label>
                                                <div className="relative">
                                                    <div className={`w-full px-4 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${!isEditing ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                                                        {formData.major}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide ml-1">Current Semester</label>
                                                <div className="relative">
                                                    <select
                                                        disabled={!isEditing}
                                                        name="currentSemester"
                                                        value={formData.currentSemester}
                                                        onChange={handleChange}
                                                        className={`w-full px-4 py-3 rounded-xl text-sm font-semibold outline-none transition-all duration-200 ${!isEditing ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 appearance-none' : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500'}`}
                                                    >
                                                        <option>Semester 1</option>
                                                        <option>Semester 2</option>
                                                        <option>Semester 3</option>
                                                        <option>Semester 4</option>
                                                        <option>Semester 5</option>
                                                        <option>Semester 6</option>
                                                        <option>Semester 7</option>
                                                        <option>Semester 8</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <ProfileInput
                                                label="Latest CGPA"
                                                value={formData.cgpa}
                                                disabled={true}
                                            />
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* 2. ACADEMIC INFO TAB */}
                            {activeTab === 'academic' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Academic Information</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ProfileInput
                                            label="University Roll No"
                                            value={formData.universityRollNo}
                                            disabled={true}
                                        />
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide ml-1">Branch</label>
                                            <div className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                {formData.major}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide ml-1">Current Semester</label>
                                            <div className="w-full px-4 py-3 rounded-xl text-sm font-semibold bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                {formData.currentSemester}
                                            </div>
                                        </div>
                                        <ProfileInput
                                            label="Latest CGPA"
                                            value={formData.cgpa || '8.90'}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* 3. SKILLS INFO TAB */}
                            {activeTab === 'skills' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl h-48 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group w-full">
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
                                            <Download className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">Upload Resume</h3>
                                        <p className="text-xs text-slate-400 font-medium">PDF, DOCX up to 10MB</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Professional Skills</h3>
                                            <button className="text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                                                + Add New
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {['React', 'Node.js', 'UI/UX Design', 'Figma', 'Python', 'Java'].map(skill => (
                                                <span key={skill} className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold shadow-md hover:-translate-y-0.5 transition-transform cursor-default">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
