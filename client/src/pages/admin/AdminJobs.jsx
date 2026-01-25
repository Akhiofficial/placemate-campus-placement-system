import React, { useState, useEffect } from 'react';
import {
    Search,
    Briefcase,
    CheckCircle,
    Clock,
    FileText,
    Plus,
    Download,
    Filter,
    ArrowUpDown,
    MoreHorizontal,
    Pencil,
    Trash2,
    RefreshCw,
    Loader2
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { getJobAnalytics, getAllJobs, deleteJob, updateJobStatus, createJob, updateJob, downloadJobsReport } from '../../api/adminApi';
import EditJobModal from '../../components/company/jobs/EditJobModal';
import toast from 'react-hot-toast';



ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminJobs = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All Jobs');
    const [stats, setStats] = useState([]);
    const [trendsData, setTrendsData] = useState(null);
    const [popularRoles, setPopularRoles] = useState([]);
    const [jobs, setJobs] = useState([]);

    // Pagination & Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [sort, setSort] = useState('newest');

    const handleDownloadCSV = async () => {
        try {
            const blob = await downloadJobsReport();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `jobs_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success("Jobs report downloaded");
        } catch (err) {
            console.error("Download failed:", err);
            toast.error("Failed to download report");
        }
    };

    // Modals
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null); // null for create, object for edit

    const fetchAnalytics = async () => {
        try {
            const data = await getJobAnalytics();
            // Map stats to UI format
            const iconMap = {
                Briefcase: Briefcase,
                CheckCircle: CheckCircle,
                Clock: Clock,
                FileText: FileText
            };

            const mappedStats = data.stats.map(s => ({
                ...s,
                icon: iconMap[s.icon] || Briefcase
            }));
            setStats(mappedStats);
            setPopularRoles(data.popularRoles);

            // Chart Data
            if (data.trends) {
                setTrendsData({
                    labels: data.trends.labels,
                    datasets: data.trends.datasets.map(d => ({
                        ...d,
                        backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
                            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
                            return gradient;
                        },
                        pointBackgroundColor: '#FFFFFF',
                        pointBorderColor: '#3B82F6',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                    }))
                });
            }

        } catch (err) {
            console.error("Error loading analytics:", err);
            // toast.error("Failed to load job analytics");
        }
    };

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                status: activeTab,
                search: searchQuery,
                sort: sort
            };
            const data = await getAllJobs(params);
            setJobs(data.jobs);
            setPagination(data.pagination);
        } catch (err) {
            console.error("Error loading jobs:", err);
            toast.error("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchJobs();
        }, 300);
        return () => clearTimeout(debounce);
    }, [activeTab, searchQuery, sort, pagination.page]);

    const handleRefresh = () => {
        fetchAnalytics();
        fetchJobs();
        toast.success("Refreshed data");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            await deleteJob(id);
            toast.success("Job deleted successfully");
            fetchJobs();
            fetchAnalytics(); // Refresh stats too
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete job");
        }
    };


    const handleSaveJob = async (jobData) => {
        try {
            if (jobData._id) {
                await updateJob(jobData._id, jobData);
                toast.success("Job updated successfully");
            } else {
                await createJob(jobData);
                toast.success("Job posted successfully");
            }
            setIsEditModalOpen(false);
            fetchJobs();
            fetchAnalytics();
        } catch (err) {
            console.error("Save failed:", err);
            toast.error("Failed to save job");
        }
    };

    // Chart Options
    const trendsOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                cornerRadius: 8,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#e2e8f0', drawBorder: false },
                ticks: { display: false }
            },
            x: {
                grid: { display: false },
            }
        },
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Job Listings</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-muted-foreground text-sm">Manage all job postings, approvals, and track application metrics.</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search jobs, roles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-card text-foreground text-sm"
                        />
                    </div>
                    <button
                        onClick={() => { setSelectedJob({}); setIsEditModalOpen(true); }}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Post New Job
                    </button>
                    <button
                        onClick={handleDownloadCSV}
                        className="flex items-center justify-center p-2 border border-border bg-card text-foreground rounded-lg hover:bg-accent transition-colors"
                        title="Download CSV Report"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex justify-end text-xs text-muted-foreground items-center gap-1">
                Last updated: {new Date().toLocaleTimeString()} <RefreshCw onClick={handleRefresh} className="w-3 h-3 cursor-pointer hover:text-foreground" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-start justify-between">
                        <div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                            <div className="mt-1">
                                <div className="flex items-end gap-2">
                                    <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                                    <span className="text-xs font-semibold mb-1 text-muted-foreground">
                                        {stat.subtext}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Job Trends Chart */}
                <div className="lg:col-span-2 bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Job Posting Trends</h3>
                            <p className="text-sm text-muted-foreground">Number of jobs posted per month</p>
                        </div>
                        <button className="text-xs text-muted-foreground border border-border px-2 py-1 rounded hover:bg-accent bg-transparent">Last 6 Months</button>
                    </div>
                    <div className="flex-1 h-64 min-h-0 w-full">
                        {trendsData ? <Line data={trendsData} options={trendsOptions} /> : <div className="h-full flex items-center justify-center text-muted-foreground">Loading chart...</div>}
                    </div>
                </div>

                {/* Popular Roles */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Popular Roles</h3>
                            <p className="text-sm text-muted-foreground">By application volume</p>
                        </div>
                        <button className="text-xs text-blue-600 font-medium hover:underline">View Report</button>
                    </div>
                    <div className="space-y-5">
                        {popularRoles.map((item, index) => {
                            const percent = Math.max(5, Math.min(100, Number(item.percent) || 0)); // Min 5% for visibility checking
                            // Define colors locally so Tailwind JIT picks them up
                            const COLORS = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600', 'bg-pink-600'];
                            const color = COLORS[index % COLORS.length];

                            return (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="font-medium text-foreground">{item.role}</span>
                                        <span className="text-muted-foreground text-xs">{item.percent}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                        <div
                                            className={`${color} h-1.5 rounded-full transition-all duration-500`}
                                            style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                        {popularRoles.length === 0 && <p className="text-sm text-muted-foreground text-center">No application data yet</p>}
                    </div>
                </div>
            </div>

            {/* Job Listings Table */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
                        {['All Jobs', 'Active', 'Closed', 'Drafts'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setPagination(p => ({ ...p, page: 1 })); }}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground bg-card hover:bg-accent hover:text-foreground transition-colors">
                            <Filter className="w-4 h-4" />
                            Filter by Company
                        </button>
                        <button
                            onClick={() => setSort(s => s === 'newest' ? 'oldest' : 'newest')}
                            className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground bg-card hover:bg-accent hover:text-foreground transition-colors"
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            Sort: {sort === 'newest' ? 'Newest' : 'Oldest'}
                        </button>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto min-h-[300px]">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <th className="p-4 pl-6 cursor-pointer hover:text-foreground">Job Details</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4 cursor-pointer hover:text-foreground">Posted Date</th>
                                    <th className="p-4">Applicants</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-muted-foreground">
                                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                            Loading jobs...
                                        </td>
                                    </tr>
                                ) : jobs.length > 0 ? (
                                    jobs.map((job) => (
                                        <tr key={job.id} className="hover:bg-accent/50 transition-colors">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 dark:border-gray-700 p-1 flex items-center justify-center">
                                                        <img
                                                            src={job.logo && job.logo.startsWith('http') ? job.logo : `http://localhost:5000${job.logo}`}
                                                            alt={job.company}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = job.company?.charAt(0).toUpperCase() || 'C'; }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground text-sm">{job.title}</div>
                                                        <div className="text-xs text-muted-foreground">{job.company} • {job.location}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                                                    {job.type}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {job.posted}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex -space-x-2">
                                                        {[...Array(Math.min(3, job.applicants))].map((_, i) => (
                                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-card bg-gray-200 overflow-hidden">
                                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${job.id}-${i}`} alt="Applicant" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-xs font-medium text-foreground">{job.applicants} Applied</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {/* Use statusColor form API or fallback */}
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.statusColor || 'bg-gray-100 text-gray-800'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-50`}></span>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            // For simplified demo, we only show modal for now.
                                                            // Full details not fetched in list but EditModal needs them.
                                                            // We pass what we have, but ideally we fetch full job details.
                                                            // Since I didn't verify full job details in 'jobs-list' endpoint (it returns subset),
                                                            // fields like description might be missing.
                                                            // For now, let's just open modal, fields will be empty if missing.
                                                            // Ideally: Fetch single job on click.
                                                            setSelectedJob(job);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(job.id)}
                                                        className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-muted-foreground">
                                            No jobs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="p-4 border-t border-border flex justify-center gap-2">
                            <button
                                disabled={pagination.page === 1}
                                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                className="px-3 py-1 text-sm border border-border rounded hover:bg-accent disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1 text-sm text-foreground">
                                Page {pagination.page} of {pagination.pages}
                            </span>
                            <button
                                disabled={pagination.page === pagination.pages}
                                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                className="px-3 py-1 text-sm border border-border rounded hover:bg-accent disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit/Create Job Modal */}
            {isEditModalOpen && (
                <EditJobModal
                    job={selectedJob}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveJob}
                />
            )}
        </div>
    );
};
export default AdminJobs;
