import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateApplicationStatus } from '../../api/adminApi';
import api from '../../api/axios';
import {
    Search,
    FileText,
    Hourglass,
    Calendar,
    CheckCircle,
    Download,
    Filter,
    Eye,
    Pencil,
    MoreHorizontal,
    ChevronDown,
    X,
    User,
    Briefcase,
    GraduationCap,
    Github,
    Linkedin,
    ExternalLink
} from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminApplications = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalApplications: 0,
        pendingReview: 0,
        interviewsScheduled: 0,
        placedCandidates: 0
    });
    const [statusDist, setStatusDist] = useState(null);
    const [companyDemand, setCompanyDemand] = useState([]);
    const [applications, setApplications] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        status: 'All Statuses',
        company: 'All Companies',
        semester: '2026-2027'
    });

    const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false);

    const navigate = useNavigate();

    // Modal States
    // const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Removed
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    // const [selectedStudent, setSelectedStudent] = useState(null); // Removed
    const [selectedAppForUpdate, setSelectedAppForUpdate] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [modalLoading, setModalLoading] = useState(false);

    // Helper to get dates from semester
    const getSemesterDates = (semester) => {
        if (!semester || semester === 'All') return { startDate: null, endDate: null };

        // Custom mapping for requested periods
        switch (semester) {
            case '2025-2026':
                return { startDate: '2025-06-01', endDate: '2026-05-31' };
            case '2026-2027':
                // Adjusted to include early 2026 as per user request (Current Data is Jan 2026)
                return { startDate: '2026-01-01', endDate: '2027-05-31' };
            case '2027-2028':
                return { startDate: '2027-06-01', endDate: '2028-05-31' };
            default:
                return { startDate: null, endDate: null };
        }
    };

    // Fetch Data
    useEffect(() => {
        fetchDashboardData();
        fetchApplications();
    }, []);

    // Also refetch applications when filters change (debounce search if needed, but for now direct)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchApplications();
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/admin/application-stats');
            const { stats, statusDistribution, companyDemand } = res.data;

            setStats(stats);
            setCompanyDemand(companyDemand);

            // Process Status Dist
            const distLabels = ['Applied', 'Interview', 'Placed', 'Rejected'];
            const distData = [0, 0, 0, 0]; // Order matches labels

            statusDistribution.forEach(item => {
                if (item._id === 'Applied' || item._id === 'Shortlisted') distData[0] += item.count;
                else if (item._id === 'Interview') distData[1] += item.count;
                else if (item._id === 'Hired' || item._id === 'Offer') distData[2] += item.count;
                else if (item._id === 'Rejected') distData[3] += item.count;
            });

            setStatusDist({
                labels: distLabels,
                datasets: [
                    {
                        data: distData,
                        backgroundColor: ['#3B82F6', '#A855F7', '#22C55E', '#EF4444'],
                        borderWidth: 0,
                    },
                ],
            });

        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.status !== 'All Statuses') queryParams.append('status', filters.status);
            if (filters.company !== 'All Companies') queryParams.append('company', filters.company);

            const { startDate, endDate } = getSemesterDates(filters.semester);
            if (startDate && endDate) {
                queryParams.append('startDate', startDate);
                queryParams.append('endDate', endDate);
            }

            const res = await api.get(`/admin/applications?${queryParams.toString()}`);

            const formattedApps = res.data.map((app) => ({
                id: app._id,
                studentIdRaw: app.student, // Keep raw ID for fetching profile
                student: app.studentUser?.name || 'Unknown',
                studentId: app.studentProfile?.universityRollNo || 'N/A',
                role: app.job?.title || 'Unknown',
                company: app.job?.company || 'Unknown',
                date: new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: app.status,
                statusColor: getStatusColor(app.status),
                avatar: app.studentProfile?.profilePictureUrl || `https://ui-avatars.com/api/?name=${app.studentUser?.name || 'User'}&background=random`
            }));

            setApplications(formattedApps);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Applied': return 'bg-blue-100 text-blue-950 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Shortlisted': return 'bg-amber-100 text-amber-950 dark:bg-amber-900/30 dark:text-amber-300';
            case 'Interview': return 'bg-purple-100 text-purple-950 dark:bg-purple-900/30 dark:text-purple-300';
            case 'Hired':
            case 'Offer': return 'bg-green-100 text-green-950 dark:bg-green-900/30 dark:text-green-300';
            case 'Rejected': return 'bg-red-100 text-red-950 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-950';
        }
    };

    const statsCards = [
        { label: 'Total Applications', value: stats.totalApplications.toLocaleString(), subtext: 'All time', trend: 'neutral', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Action Required', value: stats.pendingReview.toLocaleString(), subtext: 'Pending review', trend: 'neutral', icon: Hourglass, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        { label: 'Interviews Scheduled', value: stats.interviewsScheduled.toLocaleString(), subtext: 'Next 7 days', trend: 'neutral', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { label: 'Placed Candidates', value: stats.placedCandidates.toLocaleString(), subtext: 'Offers accepted', trend: 'neutral', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    ];

    const defaultStatusData = {
        labels: ['Applied', 'Interview', 'Placed', 'Rejected'],
        datasets: [{ data: [0, 0, 0, 0], backgroundColor: ['#3B82F6', '#A855F7', '#22C55E', '#EF4444'], borderWidth: 0 }]
    };

    const statusOptions = {
        cutout: '75%',
        plugins: { legend: { display: false } },
        maintainAspectRatio: false,
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/admin/applications/export', {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'applications_report.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error exporting report:", error);
        }
    };

    const semesterOptions = [
        { value: 'All', label: 'All Semesters' },
        { value: '2025-2026', label: 'Past: 2025-2026' },
        { value: '2026-2027', label: 'Current: 2026-2027' },
        { value: '2027-2028', label: 'Future: 2027-2028' }
    ];

    // Action Handlers
    const handleViewProfile = (applicationId) => {
        navigate(`/admin/applications/${applicationId}`);
    };

    const openUpdateModal = (app) => {
        setSelectedAppForUpdate(app);
        setNewStatus(app.status);
        setIsUpdateModalOpen(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedAppForUpdate) return;

        try {
            setModalLoading(true);
            await updateApplicationStatus(selectedAppForUpdate.id, newStatus);

            // Refresh list
            fetchApplications();
            fetchDashboardData(); // Update stats too
            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Applications Overview</h1>
                    <p className="text-muted-foreground text-sm">Monitor and manage student job applications in real-time.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search application ID, student name..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-9 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-card text-foreground text-sm"
                        />
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center justify-center gap-2 border border-border bg-card text-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>

                    {/* Custom Semester Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsSemesterDropdownOpen(!isSemesterDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card text-foreground text-sm font-medium hover:bg-accent focus:outline-none min-w-[180px] justify-between"
                        >
                            <span>
                                {semesterOptions.find(opt => opt.value === filters.semester)?.label || filters.semester}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isSemesterDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSemesterDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-full min-w-[180px] bg-card border border-border rounded-lg shadow-lg z-50 py-1">
                                {semesterOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setFilters({ ...filters, semester: option.value });
                                            setIsSemesterDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors ${filters.semester === option.value ? 'bg-accent/50 text-blue-600 font-medium' : 'text-foreground'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                        {/* Overlay to close on click outside */}
                        {isSemesterDropdownOpen && (
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsSemesterDropdownOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, index) => (
                    <div key={index} className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
                            </div>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <div className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                            {stat.subtext}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status Distribution */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Status Distribution</h3>
                    <div className="h-48 relative flex justify-center">
                        <Doughnut data={statusDist || defaultStatusData} options={statusOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-foreground">{stats.totalApplications > 1000 ? (stats.totalApplications / 1000).toFixed(1) + 'k' : stats.totalApplications}</span>
                            <span className="text-sm text-muted-foreground">Total</span>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                            <span className="text-muted-foreground text-xs">Applied/Shortlisted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                            <span className="text-muted-foreground text-xs">Interview</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                            <span className="text-muted-foreground text-xs">Placed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                            <span className="text-muted-foreground text-xs">Rejected</span>
                        </div>
                    </div>
                </div>

                {/* Top Companies Demand */}
                <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Top Companies Demand</h3>
                            <p className="text-sm text-muted-foreground">Number of active applications per company</p>
                        </div>
                        <button className="text-xs text-blue-600 font-medium hover:underline">View Full Report</button>
                    </div>
                    <div className="space-y-6">
                        {companyDemand.length > 0 ? (
                            companyDemand.map((company, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-foreground">{company._id}</span>
                                        <span className="text-muted-foreground">{company.count} Apps</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                                        <div
                                            className={`bg-blue-500 h-2.5 rounded-full`}
                                            style={{ width: `${(company.count / stats.totalApplications) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-sm">No data available</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Applications Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Manage Applications</h3>
                    <div className="flex gap-2">
                        {/* Simple filtering handled by fetchApplications via state */}
                        <select
                            className="px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-card focus:outline-none"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option>All Statuses</option>
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Placed (Offer)</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        {/* Company filter could be dynamic but static for now for simplicity of this change */}
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Job Role</th>
                                    <th className="p-4">Applied Date</th>
                                    <th className="p-4">Current Status</th>
                                    <th className="p-4 text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr><td colSpan="5" className="p-4 text-center text-muted-foreground">Loading...</td></tr>
                                ) : applications.length === 0 ? (
                                    <tr><td colSpan="5" className="p-4 text-center text-muted-foreground">No applications found.</td></tr>
                                ) : (
                                    applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-accent/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                                                        <img src={app.avatar} alt={app.student} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-foreground text-sm">{app.student}</div>
                                                        <div className="text-xs text-muted-foreground">ID: {app.studentId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-medium text-foreground text-sm">{app.role}</div>
                                                <div className="text-xs text-muted-foreground">{app.company}</div>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {app.date}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.statusColor}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewProfile(app.id)}
                                                        className="p-1.5 border border-border rounded hover:bg-accent transition-colors"
                                                        title="View Profile"
                                                    >
                                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                                    </button>
                                                    <button
                                                        onClick={() => openUpdateModal(app)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded text-xs font-medium hover:bg-accent transition-colors text-foreground"
                                                    >
                                                        Update
                                                        <Pencil className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Update Status Modal */}
            {isUpdateModalOpen && selectedAppForUpdate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border">
                        <div className="p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground">Update Application Status</h2>
                            <p className="text-sm text-muted-foreground mt-1">Change status for {selectedAppForUpdate.student}</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">New Status</label>
                                <select
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="Shortlisted">Shortlisted</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Offer">Placed (Offer)</option>
                                    <option value="Hired">Hired</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            {newStatus === 'Interview' && (
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Interview Date</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Optional: Schedule interview now</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/20 rounded-b-xl">
                            <button
                                onClick={() => setIsUpdateModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                disabled={modalLoading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {modalLoading ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminApplications;
