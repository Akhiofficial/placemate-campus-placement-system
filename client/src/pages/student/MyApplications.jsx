import { useState, useEffect } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, Send, Star, Calendar, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";



const MyApplications = () => {
    const [stats, setStats] = useState([
        { label: "Total Applied", value: "0", icon: Send, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
        { label: "Shortlisted", value: "0", icon: Star, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
        { label: "Interviews", value: "0", icon: Calendar, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-500/10" },
        { label: "Offers", value: "0", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 dark:bg-green-500/10" },
    ]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: "", status: "", sort: "newest" });
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalApps: 0 });

    const fetchStats = async () => {
        try {
            const response = await api.get("/applications/stats");
            const data = response.data;
            if (data) {
                setStats([
                    { label: "Total Applied", value: data.totalApplied || 0, icon: Send, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
                    { label: "Shortlisted", value: data.shortlisted || 0, icon: Star, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                    { label: "Interviews", value: data.interviews || 0, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-500/10" },
                    { label: "Offers", value: data.offers || 0, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 dark:bg-green-500/10" },
                ]);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: 10,
                search: filters.search,
                status: filters.status,
                sort: filters.sort,
            });
            const response = await api.get(`/applications/my?${queryParams}`);
            if (response.data && response.data.applications) {
                setApplications(response.data.applications);
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.data.pages,
                    totalApps: response.data.total
                }));
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchApplications();
        }, 300);
        return () => clearTimeout(debounce);
    }, [filters, pagination.page]);

    const handleSearchChange = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };




    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Applied': return "bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300 border-slate-200 dark:border-slate-600";
            case 'Shortlisted': return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
            case 'Interview': return "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20";
            case 'Offer':
            case 'Placed': return "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20";
            case 'Rejected': return "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    const handleStatusSelect = (status) => {
        setFilters(prev => ({ ...prev, status: status === "All Statuses" ? "" : status }));
        setPagination(prev => ({ ...prev, page: 1 }));
        setShowStatusDropdown(false);
    };

    const handleSortSelect = (sortValue) => {
        setFilters(prev => ({ ...prev, sort: sortValue }));
        setShowSortDropdown(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showStatusDropdown && !event.target.closest('.status-filter-container')) {
                setShowStatusDropdown(false);
            }
            if (showSortDropdown && !event.target.closest('.sort-filter-container')) {
                setShowSortDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showStatusDropdown, showSortDropdown]);

    return (
        <main className="flex-1 px-6 py-6 md:px-10 md:py-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-foreground-muted mb-1">
                            <Link to="/student/dashboard" className="hover:text-blue-600 transition">Home</Link>
                            <span>/</span>
                            <span className="text-foreground font-medium">My Applications</span>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
                        <p className="text-foreground-muted mt-1">Track the status of your job applications and interviews.</p>
                    </div>
                    <Link to="/student/jobs" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm flex items-center gap-2 self-start md:self-auto uppercase text-xs tracking-wide">
                        <Send size={16} />
                        Browse Jobs
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-card border border-border rounded-xl p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-foreground-muted text-sm font-medium flex items-center gap-2">
                                        {/* Icon can go here for extra flare */}
                                        {stat.label}
                                    </h3>
                                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                                </div>
                                <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters Bar */}
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search by company or role..."
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition text-foreground"
                            value={filters.search}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="relative status-filter-container">
                            <button
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                className="px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground flex items-center gap-2 hover:bg-background-muted transition min-w-[140px] justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <Filter size={16} className="text-foreground-muted" />
                                    <span>{filters.status || "All Statuses"}</span>
                                </div>
                                <ChevronDown size={14} className={`text-foreground-muted group-hover:text-foreground transition ${showStatusDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showStatusDropdown && (
                                <div className="absolute top-full mt-2 left-0 w-full min-w-[160px] bg-card border border-border rounded-lg shadow-lg z-10 py-1">
                                    {["All Statuses", "Applied", "Shortlisted", "Interview", "Offer", "Rejected"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusSelect(status)}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-background-muted transition ${(status === "All Statuses" && filters.status === "") || status === filters.status
                                                ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                                : "text-foreground"
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative sort-filter-container">
                            <button
                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                className="px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground flex items-center gap-2 hover:bg-background-muted transition min-w-[140px] justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-2 text-foreground-muted">
                                    <span className="text-foreground">{filters.sort === 'newest' ? 'Newest First' : 'Oldest First'}</span>
                                </div>
                                <ChevronDown size={14} className={`text-foreground-muted group-hover:text-foreground transition ${showSortDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showSortDropdown && (
                                <div className="absolute top-full mt-2 right-0 w-full min-w-[160px] bg-card border border-border rounded-lg shadow-lg z-10 py-1">
                                    {[
                                        { label: "Newest First", value: "newest" },
                                        { label: "Oldest First", value: "oldest" }
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSortSelect(option.value)}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-background-muted transition ${filters.sort === option.value
                                                ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                                                : "text-foreground"
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Applications List */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 px-6 py-4 bg-background-muted border-b border-border text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                        <div className="col-span-12 md:col-span-12 grid grid-cols-12">
                            <div className="col-span-5 md:col-span-4">Company & Role</div>
                            <div className="col-span-3 md:col-span-3 hidden md:block">Date Applied</div>
                            <div className="col-span-4 md:col-span-3 text-center md:text-left">Status</div>
                            <div className="col-span-3 md:col-span-2 text-right">Action</div>
                        </div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-border">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="p-4 bg-background-muted rounded-full mb-3">
                                    <Search size={24} className="text-foreground-muted" />
                                </div>
                                <h3 className="text-lg font-medium text-foreground">No applications found</h3>
                                <p className="text-foreground-muted text-sm mt-1 max-w-xs">
                                    Try adjusting your search or filters to find what you're looking for.
                                </p>
                            </div>
                        ) : (
                            applications.map((app, index) => (
                                <motion.div
                                    key={app._id || index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="grid grid-cols-12 px-6 py-5 items-center hover:bg-background-muted/50 transition"
                                >
                                    {/* Company info */}
                                    <div className="col-span-5 md:col-span-4 flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-blue-100 text-blue-600`}>
                                            {app.job?.company?.charAt(0) || "C"}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground text-sm">{app.job?.company || "Unknown Company"}</h4>
                                            <p className="text-xs text-foreground-muted mt-0.5">{app.job?.title || "Unknown Role"}</p>
                                            <p className="text-xs text-foreground-muted mt-0.5 md:hidden">ID: {app.applicationId || app._id?.slice(-6)}</p>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="col-span-3 md:col-span-3 hidden md:block">
                                        <p className="text-sm text-foreground font-medium">{new Date(app.createdAt).toLocaleDateString()}</p>
                                        <p className="text-xs text-foreground-muted mt-0.5">ID: {app.applicationId || app._id?.slice(-6)}</p>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-4 md:col-span-3 flex justify-center md:justify-start">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)} flex items-center gap-1.5`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${app.status === 'Applied' ? 'bg-slate-400' : app.status === 'Rejected' ? 'bg-red-500' : 'bg-current'}`}></span>
                                            {app.status}
                                        </span>
                                    </div>

                                    {/* Action */}
                                    <div className="col-span-3 md:col-span-2 text-right">
                                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-end gap-1 opacity-80 hover:opacity-100 transition">
                                            <span className="hidden sm:inline">View Details</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                            <p className="text-sm text-foreground-muted">
                                Showing page <span className="font-medium text-foreground">{pagination.page}</span> of <span className="font-medium text-foreground">{pagination.totalPages}</span>
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="px-3 py-1.5 border border-border rounded-lg text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-muted transition"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="px-3 py-1.5 border border-border rounded-lg text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-muted transition"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
};

export default MyApplications;
