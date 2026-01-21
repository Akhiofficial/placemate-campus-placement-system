import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, Link as LinkIcon, Info, Search as SearchIcon, Check, Clock } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCompanyApplications, scheduleInterview, getInterview, updateInterview } from '../../api/companyApi';

const ScheduleInterview = () => {
    const navigate = useNavigate();

    const { id } = useParams();
    const isEditMode = !!id;

    // Form State
    const [formData, setFormData] = useState({
        applicationId: '', // We need this for backend
        candidateName: '', // For display
        role: '',
        date: '',
        startTime: '',
        endTime: '',
        type: 'Technical',
        platform: '',
        link: '',
        notes: ''
    });

    const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
    const [loadingCandidates, setLoadingCandidates] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch Shortlisted Candidates for dropdown
        const fetchCandidates = async () => {
            setLoadingCandidates(true);
            try {
                const data = await getCompanyApplications({ status: 'Shortlisted', limit: 50 }); // Fetch enough
                setShortlistedCandidates(data.applications || []);
            } catch (err) {
                console.error("Failed to fetch candidates", err);
                setError("Failed to load candidates");
            } finally {
                setLoadingCandidates(false);
            }
        };

        fetchCandidates();

        // Fetch Interview Details if Edit Mode
        if (isEditMode) {
            const fetchInterviewDetails = async () => {
                try {
                    const interview = await getInterview(id);

                    // Parse Time (e.g., "10:00 - 10:30")
                    let start = '', end = '';
                    if (interview.time && interview.time.includes(' - ')) {
                        [start, end] = interview.time.split(' - ');
                    }

                    // Pre-fill form
                    setFormData({
                        applicationId: interview.application, // Or interview.student._id ? backend expects applicationId for create, but maybe not needed for update? check controller. 
                        // Update controller doesn't need applicationId. But we keep it in state.
                        candidateName: interview.student ? interview.student.name : 'Unknown',
                        role: interview.role || (interview.job ? interview.job.title : ''),
                        date: interview.date ? new Date(interview.date).toISOString().split('T')[0] : '',
                        startTime: start,
                        endTime: end,
                        type: interview.round || interview.type || 'Technical',
                        platform: interview.platform,
                        link: interview.meetingLink || '',
                        notes: '' // Notes not typically returned unless stored? actually interview model doesn't have notes, it used field 'notes' for link temporarily. 
                        // Wait, backend logic:
                        // if (notes && notes.length > 0 && !meetingLink) interview.meetingLink = notes;
                        // So 'link' form field maps to 'meetingLink' in backend.
                    });

                    // Also set candidate search for display
                    if (interview.student) setCandidateSearch(interview.student.name);

                } catch (err) {
                    console.error("Failed to fetch interview details", err);
                    setError("Failed to load interview details");
                }
            };
            fetchInterviewDetails();
        }
    }, [isEditMode, id]);

    // Dropdown State
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [candidateSearch, setCandidateSearch] = useState('');

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

    const handleCandidateSelect = (app) => {
        // When candidate is selected, we also set the role potentially? 
        // Or user still manually selects role? 
        // Actually, the application IS linked to a job (role). So we should auto-fill role!
        setFormData(prev => ({
            ...prev,
            applicationId: app._id,
            candidateName: app.student.name,
            role: app.job.title // Auto-fill role from application
        }));
        setCandidateSearch(app.student.name);
        setActiveDropdown(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitLoading(true);

        if (!isEditMode && !formData.applicationId) {
            setError("Please select a valid candidate from the list.");
            setSubmitLoading(false);
            return;
        }

        try {
            // Determine Interview Mode (Type) based on Platform
            let interviewMode = 'Virtual';
            if (formData.platform === 'In-Office') interviewMode = 'In-person';
            else if (formData.platform === 'Phone') interviewMode = 'Phone';

            const payload = {
                date: formData.date,
                time: `${formData.startTime} - ${formData.endTime}`,
                duration: "30 mins",
                type: interviewMode,
                platform: formData.platform,
                round: formData.type,
                meetingLink: formData.link, // Send link specifically
                notes: formData.notes
            };

            if (isEditMode) {
                await updateInterview(id, payload);
                alert("Interview updated successfully!");
            } else {
                await scheduleInterview({
                    ...payload,
                    applicationId: formData.applicationId,
                    notes: formData.link // Fallback legacy behavior
                });
                alert("Interview scheduled successfully!");
            }

            navigate('/company/interviews');
        } catch (err) {
            console.error(err);
            setError(typeof err === 'string' ? err : "Failed to save interview");
        } finally {
            setSubmitLoading(false);
        }
    };

    // Close backdrop
    const CloseBackdrop = () => (
        <div
            className="fixed inset-0 z-10 bg-transparent"
            onClick={() => setActiveDropdown(null)}
        />
    );

    // Filter candidates for autocomplete
    const filteredCandidates = shortlistedCandidates.filter(c =>
        c.student.name.toLowerCase().includes(candidateSearch.toLowerCase())
    );

    const platformOptions = [
        { value: 'Google Meet', label: 'Google Meet' },
        { value: 'Zoom', label: 'Zoom' },
        { value: 'Microsoft Teams', label: 'Microsoft Teams' },
        { value: 'Phone', label: 'Phone Call' },
        { value: 'In-Office', label: 'In-Office' },
        { value: 'WebRTC', label: 'Built-in Platform' }
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
                <h1 className="text-2xl font-bold text-foreground">{isEditMode ? 'Reschedule Interview' : 'Schedule New Interview'}</h1>
                <div className="flex-1"></div>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-foreground-muted mb-6 px-1">
                <Link to="/company/interviews" className="hover:text-blue-600 transition-colors">Interviews</Link>
                <span className="text-gray-400">›</span>
                <span className="text-foreground font-medium">{isEditMode ? 'Reschedule' : 'Schedule New Interview'}</span>
            </div>

            {/* Main Form Card */}
            <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm p-8 relative z-20">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-foreground mb-1">Interview Details</h2>
                    <p className="text-sm text-foreground-muted">Fill in the information below to schedule a new candidate interview.</p>
                </div>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

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
                                    value={candidateSearch}
                                    onFocus={() => setActiveDropdown('candidate')} // Show dropdown on focus
                                    onChange={(e) => {
                                        setCandidateSearch(e.target.value);
                                        setActiveDropdown('candidate');
                                    }}
                                />
                                {activeDropdown === 'candidate' && (
                                    <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-card border border-border rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-none py-1 z-30 animate-in fade-in zoom-in-95 duration-100 max-h-60 overflow-y-auto no-scrollbar">
                                        {loadingCandidates ? <div className="p-3 text-sm text-gray-500">Loading...</div> :
                                            filteredCandidates.length === 0 ? <div className="p-3 text-sm text-gray-500">No shortlisted candidates found.</div> :
                                                filteredCandidates.map(app => (
                                                    <button
                                                        key={app._id}
                                                        type="button"
                                                        onClick={() => handleCandidateSelect(app)}
                                                        className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-background-muted"
                                                    >
                                                        <span className="font-medium text-foreground">{app.student.name}</span>
                                                        <span className="text-xs text-gray-500 ml-2">({app.job.title})</span>
                                                    </button>
                                                ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-foreground-muted">Search from shortlisted candidates</p>
                        </div>

                        {/* Read-only Job Role (auto-filled) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Job Role <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                disabled
                                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-card/50 border border-border rounded-lg text-sm text-gray-500 cursor-not-allowed"
                                value={formData.role || "Auto-filled from candidate"}
                            />
                        </div>
                    </div>

                    {/* Row 2: Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground">Interview Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-foreground transition-all"
                                value={formData.date}
                                onChange={(e) => handleChange('date', e.target.value)}
                                required
                            />
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
                        <label className="text-sm font-semibold text-foreground">Meeting Link / Location</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
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
                            disabled={submitLoading}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
                        >
                            {submitLoading ? 'Scheduling...' : (isEditMode ? 'Update Schedule' : 'Schedule Interview')}
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
