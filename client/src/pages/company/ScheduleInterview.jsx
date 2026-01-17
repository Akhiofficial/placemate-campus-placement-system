import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, Link as LinkIcon, Info, Search as SearchIcon, Check, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ScheduleInterview = () => {
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        candidate: '',
        role: '',
        date: '',
        startTime: '',
        endTime: '',
        type: '',
        platform: '',
        link: '',
        notes: ''
    });

    // Dropdown State
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (name) => {
        if (activeDropdown === name) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(name);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'role' || field === 'platform' || field === 'startTime' || field === 'endTime') {
            setActiveDropdown(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add API call logic here in future
        console.log("Scheduling Interview:", formData);
        navigate('/company/interviews');
    };

    // Close backdrop
    const CloseBackdrop = () => (
        <div
            className="fixed inset-0 z-10 bg-transparent"
            onClick={() => setActiveDropdown(null)}
        />
    );

    // Options
    const roleOptions = [
        { value: 'sde', label: 'Software Engineer' },
        { value: 'pm', label: 'Product Manager' },
        { value: 'data', label: 'Data Scientist' },
        { value: 'design', label: 'Product Designer' }
    ];

    const platformOptions = [
        { value: 'meet', label: 'Google Meet' },
        { value: 'zoom', label: 'Zoom' },
        { value: 'teams', label: 'Microsoft Teams' },
        { value: 'phone', label: 'Phone Call' },
        { value: 'office', label: 'In-Office' }
    ];

    // Generate time slots (15 min increments)
    const timeOptions = [];
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 15) {
            const hour = i.toString().padStart(2, '0');
            const minute = j.toString().padStart(2, '0');
            timeOptions.push(`${hour}:${minute}`);
        }
    }

    return (
        <div className="max-w-4xl mx-auto relative">
            {activeDropdown && <CloseBackdrop />}

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-card rounded-full transition-colors text-foreground-muted hover:text-foreground"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-foreground">Schedule New Interview</h1>
                <div className="flex-1"></div>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-foreground-muted mb-6 px-1">
                <Link to="/company/interviews" className="hover:text-blue-600 transition-colors">Interviews</Link>
                <span className="text-gray-400">›</span>
                <span className="text-foreground font-medium">Schedule New Interview</span>
            </div>

            {/* Main Form Card */}
            <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm p-8 relative z-20">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-foreground mb-1">Interview Details</h2>
                    <p className="text-sm text-foreground-muted">Fill in the information below to schedule a new candidate interview.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <style>{`
                        .no-scrollbar::-webkit-scrollbar {
                            display: none;
                        }
                        .no-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                    `}</style>
                    {/* Row 1: Candidate & Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Select Candidate <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search candidate name..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-foreground transition-all"
                                    value={formData.candidate}
                                    onChange={(e) => handleChange('candidate', e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-foreground-muted">Search from shortlisted candidates</p>
                        </div>

                        {/* Custom Role Dropdown */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Job Role <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => toggleDropdown('role')}
                                    className={`flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 dark:bg-background-muted border ${activeDropdown === 'role' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-border'} rounded-lg text-sm transition-all cursor-pointer text-left`}
                                >
                                    <span className={`truncate ${!formData.role ? 'text-gray-400' : 'text-foreground'}`}>
                                        {formData.role ? roleOptions.find(o => o.value === formData.role)?.label : "Select Job Role"}
                                    </span>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${activeDropdown === 'role' ? 'rotate-180' : ''}`} />
                                </button>

                                {activeDropdown === 'role' && (
                                    <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-card border border-border rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-none py-1 z-30 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto no-scrollbar">
                                        {roleOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => handleChange('role', option.value)}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${formData.role === option.value
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium'
                                                    : 'text-foreground hover:bg-gray-50 dark:hover:bg-background-muted'
                                                    }`}
                                            >
                                                {option.label}
                                                {formData.role === option.value && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Interview Date <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-foreground transition-all"
                                    value={formData.date}
                                    onChange={(e) => handleChange('date', e.target.value)}
                                />
                                {/* Calendar icon handled by native input usually, or added as overlay if needed */}
                            </div>
                        </div>

                        {/* Custom Start Time Dropdown */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Start Time <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => toggleDropdown('startTime')}
                                    className={`flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 dark:bg-background-muted border ${activeDropdown === 'startTime' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-border'} rounded-lg text-sm transition-all cursor-pointer text-left`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-gray-400" />
                                        <span className={`truncate ${!formData.startTime ? 'text-gray-400' : 'text-foreground'}`}>
                                            {formData.startTime || "Select Start Time"}
                                        </span>
                                    </div>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${activeDropdown === 'startTime' ? 'rotate-180' : ''}`} />
                                </button>

                                {activeDropdown === 'startTime' && (
                                    <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-card border border-border rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-none py-1 z-30 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto no-scrollbar">
                                        {timeOptions.map((time) => (
                                            <button
                                                key={`start-${time}`}
                                                type="button"
                                                onClick={() => handleChange('startTime', time)}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${formData.startTime === time
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium'
                                                    : 'text-foreground hover:bg-gray-50 dark:hover:bg-background-muted'
                                                    }`}
                                            >
                                                {time}
                                                {formData.startTime === time && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Custom End Time Dropdown */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">End Time <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => toggleDropdown('endTime')}
                                    className={`flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 dark:bg-background-muted border ${activeDropdown === 'endTime' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-border'} rounded-lg text-sm transition-all cursor-pointer text-left`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-gray-400" />
                                        <span className={`truncate ${!formData.endTime ? 'text-gray-400' : 'text-foreground'}`}>
                                            {formData.endTime || "Select End Time"}
                                        </span>
                                    </div>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${activeDropdown === 'endTime' ? 'rotate-180' : ''}`} />
                                </button>

                                {activeDropdown === 'endTime' && (
                                    <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-card border border-border rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-none py-1 z-30 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto no-scrollbar">
                                        {timeOptions.map((time) => (
                                            <button
                                                key={`end-${time}`}
                                                type="button"
                                                onClick={() => handleChange('endTime', time)}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${formData.endTime === time
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium'
                                                    : 'text-foreground hover:bg-gray-50 dark:hover:bg-background-muted'
                                                    }`}
                                            >
                                                {time}
                                                {formData.endTime === time && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Type & Platform */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-foreground">Interview Type <span className="text-red-500">*</span></label>
                            <div className="flex items-center gap-6 pt-1">
                                {['Technical', 'HR Round', 'Managerial'].map((type) => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="type"
                                            value={type}
                                            checked={formData.type === type}
                                            onChange={(e) => handleChange('type', e.target.value)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <span className={`text-sm group-hover:text-blue-600 transition-colors ${formData.type === type ? 'text-foreground font-medium' : 'text-foreground-muted'}`}>
                                            {type}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Custom Platform Dropdown */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Interview Platform <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => toggleDropdown('platform')}
                                    className={`flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 dark:bg-background-muted border ${activeDropdown === 'platform' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-border'} rounded-lg text-sm transition-all cursor-pointer text-left`}
                                >
                                    <span className={`truncate ${!formData.platform ? 'text-gray-400' : 'text-foreground'}`}>
                                        {formData.platform ? platformOptions.find(o => o.value === formData.platform)?.label : "Select Platform"}
                                    </span>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${activeDropdown === 'platform' ? 'rotate-180' : ''}`} />
                                </button>

                                {activeDropdown === 'platform' && (
                                    <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-card border border-border rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-none py-1 z-30 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto no-scrollbar">
                                        {platformOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => handleChange('platform', option.value)}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${formData.platform === option.value
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium'
                                                    : 'text-foreground hover:bg-gray-50 dark:hover:bg-background-muted'
                                                    }`}
                                            >
                                                {option.label}
                                                {formData.platform === option.value && <Check size={14} />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Row 4: Link */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Meeting Link / Location <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="url"
                                placeholder="Enter meeting URL or office room number"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-foreground transition-all"
                                value={formData.link}
                                onChange={(e) => handleChange('link', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Row 5: Notes */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground">Internal Notes (Optional)</label>
                        <textarea
                            rows="4"
                            placeholder="Any specific instructions for the interviewer..."
                            className="w-full p-4 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-foreground transition-all resize-none"
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                        ></textarea>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-border mt-8">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-gray-50 dark:hover:bg-card transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
                        >
                            Schedule Interview
                        </button>
                    </div>
                </form>
            </div>

            {/* Info Footer */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
                <Info size={20} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                    <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">Important Note</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400/80 leading-relaxed">Both the candidate and the selected interviewer will receive a calendar invitation and email notification with the meeting details immediately after scheduling.</p>
                </div>
            </div>
        </div>
    );
};

export default ScheduleInterview;
