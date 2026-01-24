import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Bell,
    TrendingUp,
    Loader2
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import axios from '../../api/axios'; // Import centralized axios instance
import toast from 'react-hot-toast';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminDashboard = () => {
    const [stats, setStats] = useState([]);
    const [placementData, setPlacementData] = useState(null);
    const [offersData, setOffersData] = useState(null);
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isAddJobOpen, setIsAddJobOpen] = useState(false);
    const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get('/admin/dashboard-stats');
                const { stats, placementByDept, offersTrend, recentJobs } = res.data;

                setStats(stats);

                setPlacementData({
                    labels: placementByDept.labels,
                    datasets: [
                        {
                            label: 'Placed Students',
                            data: placementByDept.data,
                            backgroundColor: '#3b82f6',
                            borderRadius: 4,
                            barThickness: 20,
                        },
                    ],
                });

                setOffersData({
                    labels: offersTrend.labels,
                    datasets: [
                        {
                            label: 'Offers',
                            data: offersTrend.data,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointBackgroundColor: '#ffffff',
                            pointBorderColor: '#3b82f6',
                            pointBorderWidth: 2,
                        },
                    ],
                });

                // Process recent jobs to match UI structure if needed (already done in backend mostly)
                // Add statusColor based on status
                const processedJobs = recentJobs.map(job => {
                    let statusColor = 'bg-gray-100 text-gray-700';
                    if (job.status === 'Active' || job.status === 'Open') statusColor = 'bg-green-100 text-green-700';
                    else if (job.status === 'Pending') statusColor = 'bg-yellow-100 text-yellow-700';

                    return {
                        ...job,
                        statusColor,
                        // use a default logo if none provided
                        logo: job.companyLogo
                            ? (job.companyLogo.startsWith('http') || job.companyLogo.startsWith('data:')
                                ? job.companyLogo
                                : `http://localhost:5000/${job.companyLogo.startsWith('/') ? job.companyLogo.slice(1) : job.companyLogo}`)
                            : `https://api.dicebear.com/7.x/identicon/svg?seed=${job.company}`
                    };
                });
                setRecentJobs(processedJobs);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
                setLoading(false);
                // Could handle error state here
            }
        };

        fetchDashboardData();
    }, []);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                cornerRadius: 8,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f1f5f9',
                },
                ticks: {
                    display: false
                },
                border: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false
                }
            },
        },
        maintainAspectRatio: false,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center flex-1 gap-8">
                    <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                    {/* Search Bar */}
                    <div className="relative w-full max-w-md hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search students, companies..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-card border-none rounded-lg focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none text-sm"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => setIsAddJobOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        <Plus size={18} />
                        Add Job
                    </button>
                    <button onClick={() => setIsAddCompanyOpen(true)} className="flex items-center gap-2 bg-white dark:bg-card border border-gray-200 dark:border-border text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-accent transition-colors">
                        Add Company
                    </button>
                    <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-accent rounded-full transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-card"></span>
                    </button>
                    <div className="w-9 h-9 rounded-full bg-blue-100 overflow-hidden border border-gray-200">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            {/* Welcome Section */}
            <div>
                <h2 className="text-3xl font-bold text-foreground tracking-tight">Welcome back, Admin.</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Here is the placement overview for the 2024 season.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-card dark:bg-card p-6 rounded-xl border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.color}`}>{stat.change}</span>
                        </div>
                        <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                        {stat.progress !== undefined && (
                            <div className="mt-4 h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stat.progress}%` }}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Placement by Department */}
                <div className="bg-card dark:bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-foreground text-lg">Placement by Department</h3>
                            <p className="text-sm text-gray-500">2024 Season Distribution</p>
                        </div>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp size={14} /> +15%
                        </span>
                    </div>
                    <div className="h-64">
                        {placementData && <Bar options={chartOptions} data={placementData} />}
                    </div>
                </div>

                {/* Offers Trend */}
                <div className="bg-card dark:bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-bold text-foreground text-lg">Offers Trend</h3>
                            <p className="text-sm text-gray-500">Last 6 Months</p>
                        </div>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp size={14} /> +22%
                        </span>
                    </div>
                    <div className="h-64">
                        {offersData && <Line options={chartOptions} data={offersData} />}
                    </div>
                </div>
            </div>

            {/* Recent Job Postings Table */}
            <div className="bg-card dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-border">
                    <h3 className="font-bold text-foreground text-lg">Recent Job Postings</h3>
                    <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs uppercase text-gray-500 font-semibold tracking-wider border-b border-border">
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Posted Date</th>
                                <th className="px-6 py-4">Applicants</th>
                                <th className="px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {recentJobs.map((job, index) => (
                                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 p-1 flex items-center justify-center">
                                                <img
                                                    src={job.logo}
                                                    alt={job.company}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        e.target.onerror = null; // Prevent infinite loop
                                                        e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${job.company}`;
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground text-sm">{job.company}</p>
                                                <p className="text-xs text-gray-500">{job.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-foreground font-medium">{job.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{job.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex -space-x-2">
                                            {/* Dummy Avatars - could request real applicant avatars later */}
                                            {[...Array(Math.min(3, job.applicants))].map((_, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-card bg-gray-200 overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${index}-${i}`} alt="Applicant" />
                                                </div>
                                            ))}
                                            {job.applicants > 3 && (
                                                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-card bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                    +{job.applicants - 3}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.statusColor}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${job.status === 'Active' || job.status === 'Open' ? 'bg-green-500' : job.status === 'Pending' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                                            {job.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddJobModal isOpen={isAddJobOpen} onClose={() => setIsAddJobOpen(false)} onAdd={() => {
                toast.success("Job posted successfully");
                // Optionally trigger a refresh if needed, but not critical for MVP
            }} />

            <AddCompanyModal isOpen={isAddCompanyOpen} onClose={() => setIsAddCompanyOpen(false)} onAdd={() => {
                toast.success("Company added successfully");
            }} />
        </div>
    );
};

const AddJobModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        description: '',
        location: '',
        type: 'Full-time',
        salary: '',
        requirements: '',
        deadline: '',
        eligibility: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/admin/jobs', formData);
            toast.success("Job posted successfully");
            onAdd();
            onClose();
            setFormData({ title: '', company: '', description: '', location: '', type: 'Full-time', salary: '', requirements: '', deadline: '', eligibility: '' });
        } catch (err) {
            console.error("Error creating job:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-white/10 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Post New Job</h3>
                        <p className="text-sm text-muted-foreground mt-1">Create a new job listing for students</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors"
                    >
                        <Plus className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground ml-1">Job Title</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                                placeholder="e.g. Senior Frontend Engineer"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground ml-1">Company Name</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                                placeholder="e.g. Google"
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Description</label>
                        <textarea
                            required
                            className="w-full px-4 py-3 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all min-h-[120px] placeholder:text-muted-foreground/50 text-foreground resize-none"
                            placeholder="Detailed job description..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground ml-1">Location</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                                placeholder="e.g. Bangalore, Remote"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground ml-1">Type</label>
                            <div className="relative">
                                <select
                                    className="w-full px-4 py-3 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all appearance-none text-foreground cursor-pointer"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option>Full-time</option>
                                    <option>Internship</option>
                                    <option>Contract</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground ml-1">Salary</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                                value={formData.salary}
                                onChange={e => setFormData({ ...formData, salary: e.target.value })}
                                placeholder="e.g. 12-15 LPA"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground ml-1">Deadline</label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all text-foreground [scheme:dark]"
                                value={formData.deadline}
                                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Requirements</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                            value={formData.requirements}
                            onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                            placeholder="e.g. React, Node.js, MongoDB (comma separated)"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Eligibility</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                            value={formData.eligibility}
                            onChange={e => setFormData({ ...formData, eligibility: e.target.value })}
                            placeholder="e.g. B.Tech CSE / MCA 2024 Batch"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-border rounded-xl text-foreground font-medium hover:bg-accent transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
                        >
                            {loading ? 'Posting...' : 'Post Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AddCompanyModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        location: '',
        website: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/admin/companies', formData);
            toast.success("Company added successfully");
            onAdd();
            onClose();
            setFormData({ name: '', email: '', password: '', location: '', website: '' });
        } catch (err) {
            console.error("Error creating company:", err);
            console.log("Server Error Response:", err.response?.data);
            toast.error(err.response?.data?.msg || "Failed to create company");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-white/10 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Add New Company</h3>
                        <p className="text-sm text-muted-foreground mt-1">Register a company partner</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-colors"
                    >
                        <Plus className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Company Name</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-3 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Microsoft"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Email (Login ID)</label>
                        <input
                            required
                            type="email"
                            className="w-full px-4 py-3 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="hr@microsoft.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Password</label>
                        <input
                            required
                            type="password"
                            className="w-full px-4 py-3 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Location</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Headquarters City"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground ml-1">Website</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                            value={formData.website}
                            onChange={e => setFormData({ ...formData, website: e.target.value })}
                            placeholder="https://example.com"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-border rounded-xl text-foreground font-medium hover:bg-accent transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
                        >
                            {loading ? 'Adding...' : 'Add Company'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
