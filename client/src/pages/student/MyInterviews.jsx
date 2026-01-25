import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, Clock, MapPin, Video, MoreVertical, ExternalLink, Briefcase, FileText, X } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const MyInterviews = () => {
    const [activeTab, setActiveTab] = useState("Upcoming");
    const [searchTerm, setSearchTerm] = useState("");
    const [interviews, setInterviews] = useState([]);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [stats, setStats] = useState({ upcoming: 0 });
    const [loading, setLoading] = useState(true);

    // New state for filter
    const [filterType, setFilterType] = useState("All"); // All, Virtual, In-person
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const fetchInterviews = async () => {
        setLoading(true);
        try {
            // Map tab to backend status or filter logic
            let statusParam = "";
            if (activeTab === "Upcoming") statusParam = "Upcoming";
            else if (activeTab === "Completed") statusParam = "Completed";
            else if (activeTab === "Cancelled") statusParam = "Cancelled";

            const response = await api.get("/interviews", {
                params: {
                    status: statusParam,
                    search: searchTerm
                }
            });

            if (response.data) {
                setInterviews(response.data.interviews);
                setStats(response.data.stats || { upcoming: 0 });
            }
        } catch (error) {
            console.error("Error fetching interviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchInterviews();
        }, 300);
        return () => clearTimeout(debounce);
    }, [activeTab, searchTerm]);

    // Client-side filtering for Interview Type
    const filteredInterviews = interviews.filter(interview => {
        if (filterType === "All") return true;
        // Backend 'type' enum: ['Virtual', 'In-person', 'Phone']
        // Match strictly or loosely? Let's check exact matches from dropdown
        return interview.type === filterType;
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showFilterDropdown && !event.target.closest('.filter-container')) {
                setShowFilterDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showFilterDropdown]);

    const handleSyncCalendar = async () => {
        try {
            const response = await api.get("/interviews/sync/ics", {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'placemate-interviews.ics');
            document.body.appendChild(link);
            link.click();
            link.remove();

            // Automatically open Google Calendar Import page
            // We use a small timeout to ensure the download has initiated visually
            setTimeout(() => {
                window.open("https://calendar.google.com/calendar/u/0/r/settings/export", "_blank");
            }, 500);

        } catch (error) {
            console.error("Error syncing calendar:", error);
            alert("Failed to sync calendar");
        }
    };

    // Helper to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
            fullDate: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    // Helper to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Scheduled': return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
            case 'Completed': return "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400";
            case 'Cancelled': return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400";
            case 'Rescheduled': return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
            default: return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <main className="flex-1 px-6 py-6 md:px-10 md:py-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">My Interviews</h1>
                        <p className="text-foreground-muted mt-1">Manage and track your scheduled interviews and feedback.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-xl border border-border shadow-sm">
                        <div className="text-center px-4 border-r border-border">
                            <span className="block text-xl font-bold text-blue-600">{stats.upcoming}</span>
                            <span className="text-[10px] font-bold text-foreground-muted tracking-wider uppercase">Upcoming</span>
                        </div>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search company or role..."
                            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition text-foreground"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative filter-container">
                        <button
                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                            className="px-4 py-2.5 bg-card border border-border rounded-xl text-foreground hover:bg-background-muted transition flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto min-w-[120px]"
                        >
                            <Filter size={18} />
                            <span>{filterType === "All" ? "Filter" : filterType}</span>
                        </button>

                        {showFilterDropdown && (
                            <div className="absolute top-full mt-2 right-0 w-full min-w-[160px] bg-card border border-border rounded-lg shadow-lg z-10 py-1">
                                {["All", "Virtual", "In-person"].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => {
                                            setFilterType(type);
                                            setShowFilterDropdown(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-background-muted transition ${filterType === type ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" : "text-foreground"}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSyncCalendar}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto"
                    >
                        <Calendar size={18} />
                        <span className="whitespace-nowrap">Sync Calendar</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-border">
                    {["Upcoming", "Completed", "Cancelled"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-medium transition relative ${activeTab === tab ? "text-blue-600" : "text-foreground-muted hover:text-foreground"}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Interview List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredInterviews.length === 0 ? (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-background-muted rounded-full flex items-center justify-center mx-auto mb-4 text-foreground-muted">
                                <Calendar size={24} />
                            </div>
                            <h3 className="text-foreground font-medium">No {activeTab.toLowerCase()} interviews found</h3>
                            <p className="text-foreground-muted text-sm mt-1">Try adjusting your filters or search.</p>
                        </div>
                    ) : (
                        filteredInterviews.map((interview, index) => {
                            const { day, month, time } = formatDate(interview.date);
                            const isInPerson = interview.type === 'In-Person';

                            return (
                                <motion.div
                                    key={interview._id || index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm"
                                >
                                    <div className="flex flex-col md:flex-row gap-4 md:items-center w-full">
                                        {/* Top/Left Section: Date + Info */}
                                        <div className="flex gap-4 w-full md:flex-1 items-start">
                                            {/* Date Block */}
                                            <div className="shrink-0 flex flex-col items-center justify-center bg-background-muted rounded-xl w-16 h-16 md:w-20 md:h-20 border border-border">
                                                <span className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-wider">{month}</span>
                                                <span className="text-xl md:text-3xl font-bold text-foreground">{day}</span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex gap-3 items-start">
                                                    {/* Logo - Fallback */}
                                                    <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-blue-600`}>
                                                        {interview.company?.charAt(0) || "C"}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="text-base md:text-lg font-bold text-foreground truncate">{interview.role}</h3>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${getStatusColor(interview.status)}`}>
                                                                {interview.status}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-2 text-foreground-muted text-xs md:text-sm mt-0.5">
                                                            <span className="font-medium text-foreground truncate">{interview.company}</span>
                                                            <span>•</span>
                                                            <span className="whitespace-nowrap">{interview.round || "Interview"}</span>
                                                        </div>

                                                        {/* Mobile Time Display */}
                                                        <div className="flex items-center gap-3 mt-2 text-xs text-foreground-muted md:hidden">
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={12} />
                                                                {interview.time || time}
                                                            </span>
                                                            <span className={`flex items-center gap-1 ${isInPerson ? 'text-amber-600' : 'text-green-600'}`}>
                                                                {isInPerson ? <MapPin size={12} /> : <Video size={12} />}
                                                                {interview.platform || (isInPerson ? "In-Person" : "Virtual")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Desktop Details Row */}
                                                <div className="hidden md:flex flex-wrap items-center gap-4 mt-3 text-sm text-foreground-muted">
                                                    <span className={`flex items-center gap-1.5 ${isInPerson ? 'text-amber-600 font-medium' : 'text-green-600 font-medium'}`}>
                                                        {isInPerson ? <MapPin size={16} /> : <Video size={16} />}
                                                        {interview.platform || (isInPerson ? "In-Person" : "Virtual")}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock size={16} />
                                                        {interview.duration || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {/* Actions */}
                                        <div className="flex md:flex-row gap-3 w-full md:w-auto mt-2 md:mt-0 items-center">
                                            {/* Primary Action */}
                                            {isInPerson ? (
                                                <button
                                                    onClick={() => setSelectedInterview(interview)}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-background border border-border text-foreground rounded-xl font-medium hover:bg-background-muted transition text-sm"
                                                >
                                                    <MapPin size={16} />
                                                    View Map
                                                </button>
                                            ) : (
                                                /* Virtual Interview Logic */
                                                (() => {
                                                    const isCompletedOrCancelled = interview.status === 'Completed' || interview.status === 'Cancelled';
                                                    const canJoin = !isCompletedOrCancelled && interview.meetingLink;

                                                    return (
                                                        <a
                                                            href={canJoin ? interview.meetingLink : undefined}
                                                            target={canJoin ? "_blank" : undefined}
                                                            rel={canJoin ? "noopener noreferrer" : undefined}
                                                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition shadow-sm text-sm ${canJoin
                                                                ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                                                                : "bg-background-muted text-foreground-muted cursor-not-allowed"
                                                                }`}
                                                            onClick={(e) => !canJoin && e.preventDefault()}
                                                        >
                                                            <Video size={16} />
                                                            Join
                                                        </a>
                                                    );
                                                })()
                                            )}

                                            {/* Google Calendar Button */}
                                            <a
                                                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Interview: ${interview.company} - ${interview.role}`)}&details=${encodeURIComponent(`Round: ${interview.round}\nLink: ${interview.meetingLink || 'N/A'}`)}&location=${encodeURIComponent(interview.platform || 'Virtual')}&dates=${(() => {
                                                    // Parse date and time to YYYYMMDDTHHMMSSZ format
                                                    // This is simplified client-side parsing
                                                    try {
                                                        const d = new Date(interview.date);
                                                        let hours = 9, minutes = 0;
                                                        if (interview.time) {
                                                            const parts = interview.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                                                            if (parts) {
                                                                let h = parseInt(parts[1]);
                                                                let m = parseInt(parts[2]);
                                                                if (parts[3]?.toUpperCase() === 'PM' && h < 12) h += 12;
                                                                if (parts[3]?.toUpperCase() === 'AM' && h === 12) h = 0;
                                                                hours = h;
                                                                minutes = m;
                                                            }
                                                        }
                                                        d.setHours(hours, minutes, 0, 0);
                                                        const start = d.toISOString().replace(/-|:|\.\d\d\d/g, "");
                                                        d.setHours(hours + 1);
                                                        const end = d.toISOString().replace(/-|:|\.\d\d\d/g, "");
                                                        return `${start}/${end}`;
                                                    } catch (e) { return ""; }
                                                })()}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 bg-background border border-border text-foreground-muted hover:text-blue-600 rounded-xl hover:bg-background-muted transition flex items-center justify-center"
                                                title="Add to Google Calendar"
                                            >
                                                <Calendar size={18} />
                                            </a>

                                            {/* Details Button (Always last) */}
                                            <button
                                                onClick={() => setSelectedInterview(interview)}
                                                className="flex-1 md:flex-none px-4 py-2.5 bg-background border border-border text-foreground rounded-xl font-medium hover:bg-background-muted transition text-sm flex items-center justify-center gap-2"
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Interview Details Modal */}
                {selectedInterview && createPortal(
                    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedInterview(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-border max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-border flex justify-between items-start sticky top-0 bg-card z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">{selectedInterview.role}</h3>
                                    <p className="text-foreground-muted text-sm">{selectedInterview.company}</p>
                                </div>
                                <button onClick={() => setSelectedInterview(null)} className="text-foreground-muted hover:text-foreground p-1 rounded-full hover:bg-background-muted transition">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Date & Time</p>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                <Calendar size={15} className="text-blue-600" />
                                                {new Date(selectedInterview.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                            <p className="text-sm text-foreground flex items-center gap-2">
                                                <Clock size={15} className="text-blue-600" />
                                                {selectedInterview.time} <span className="text-foreground-muted">({selectedInterview.duration})</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Format</p>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                {selectedInterview.type === 'In-Person' ? <MapPin size={15} className="text-amber-600" /> : <Video size={15} className="text-green-600" />}
                                                {selectedInterview.type || 'Virtual'}
                                            </p>
                                            <p className="text-sm text-foreground pl-6">
                                                {selectedInterview.platform || 'Custom Platform'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5 pt-2 border-t border-border/50">
                                    <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Interview Status</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusColor(selectedInterview.status)}`}>
                                            {selectedInterview.status}
                                        </span>
                                        <span className="text-sm font-medium text-foreground">• {selectedInterview.round || 'General Interview'}</span>
                                    </div>
                                </div>

                                {(selectedInterview.meetingLink || selectedInterview.location) && (
                                    <div className="bg-background-muted/40 rounded-xl border border-border mt-2 overflow-hidden">
                                        <div className="bg-background-muted/60 px-4 py-2 border-b border-border/50 flex justify-between items-center">
                                            <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
                                                {selectedInterview.type === 'In-Person' ? 'Location' : 'Joining Link'}
                                            </p>
                                            {selectedInterview.type !== 'In-Person' && (
                                                <ExternalLink size={12} className="text-foreground-muted" />
                                            )}
                                        </div>
                                        <div className="p-4">
                                            {selectedInterview.type === 'In-Person' ? (
                                                <p className="text-sm text-foreground flex items-start gap-2 font-medium">
                                                    <MapPin size={16} className="text-amber-600 shrink-0 mt-0.5" />
                                                    {selectedInterview.location || "Location to be shared"}
                                                </p>
                                            ) : (
                                                <a
                                                    href={selectedInterview.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-2 break-all group transition-colors hover:text-blue-700"
                                                >
                                                    <span className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-md text-blue-600 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                                                        <Video size={14} />
                                                    </span>
                                                    {selectedInterview.meetingLink}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedInterview.feedback && (
                                    <div className="space-y-1.5 pt-2 border-t border-border/50">
                                        <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">Feedback / Notes</p>
                                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 p-3 rounded-xl">
                                            <p className="text-sm text-foreground italic">
                                                "{selectedInterview.feedback}"
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 border-t border-border flex justify-end gap-3 bg-background-muted/30 sticky bottom-0  z-10">
                                <button
                                    onClick={() => setSelectedInterview(null)}
                                    className="px-5 py-2.5 bg-background border border-border rounded-xl text-sm font-medium hover:bg-background-muted transition shadow-sm text-foreground"
                                >
                                    Close
                                </button>
                                {selectedInterview.meetingLink && selectedInterview.status !== 'Completed' && selectedInterview.status !== 'Cancelled' && (
                                    <a
                                        href={selectedInterview.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-sm hover:shadow-md"
                                    >
                                        Join Interview <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>,
                    document.body
                )}

                {/* Looking for more */}
                <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-background-muted/30">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
                        <Briefcase size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Looking for more opportunities?</h3>
                    <Link to="/student/jobs" className="mt-4 text-blue-600 font-medium hover:underline text-sm flex items-center gap-1">
                        Browse new job openings <ExternalLink size={14} />
                    </Link>
                </div>

            </div>
        </main>
    );
};

export default MyInterviews;
