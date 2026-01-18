import React, { useState } from 'react';
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
    RefreshCw
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
    const [activeTab, setActiveTab] = useState('All Jobs');

    // Dummy Stats Data
    const stats = [
        { label: 'Total Jobs', value: '156', subtext: '+12 this week', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', trendColor: 'text-green-600' },
        { label: 'Active Openings', value: '42', subtext: 'Closing soon: 5', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', trendColor: 'text-muted-foreground' },
        { label: 'Pending Approval', value: '8', subtext: 'Needs attention', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', trendColor: 'text-red-500' },
        { label: 'Total Applications', value: '2.4k', subtext: '+18% vs last month', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', trendColor: 'text-green-600' },
    ];

    // Job Trends Chart Data
    const trendsData = {
        labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
            {
                label: 'Jobs Posted',
                data: [20, 35, 25, 45, 30, 55],
                borderColor: '#3B82F6',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
                    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#3B82F6',
                pointBorderWidth: 2,
                pointRadius: 4,
            },
        ],
    };

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
                grid: { color: '#e2e8f0', drawBorder: false }, // Will need adjustment for pure dark mode if grid color is issue, sticking to neutral
                ticks: { display: false }
            },
            x: {
                grid: { display: false },
            }
        },
    };

    // Popular Roles Data
    const popularRoles = [
        { role: 'Software Engineer', percent: 45, color: 'bg-blue-500' },
        { role: 'Data Analyst', percent: 25, color: 'bg-indigo-500' },
        { role: 'Product Manager', percent: 15, color: 'bg-emerald-500' },
        { role: 'UI/UX Designer', percent: 10, color: 'bg-teal-500' },
        { role: 'Others', percent: 5, color: 'bg-gray-400' },
    ];

    // Jobs Data
    const jobs = [
        { id: 1, title: 'Senior Software Engineer', company: 'TechCorp Inc.', type: 'Full-time', posted: 'Oct 24, 2024', location: 'Remote', applicants: 145, status: 'Active', statusColor: 'bg-green-100 text-green-950 dark:bg-green-900/30 dark:text-green-400', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TechCorp' },
        { id: 2, title: 'Marketing Intern', company: 'Innovate Systems', type: 'Internship', posted: 'Oct 22, 2024', location: 'On-site', applicants: 28, status: 'Pending', statusColor: 'bg-amber-100 text-amber-950 dark:bg-amber-900/30 dark:text-amber-400', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Innovate' },
        { id: 3, title: 'Product Designer', company: 'Creative Studios', type: 'Contract', posted: 'Oct 20, 2024', location: 'Hybrid', applicants: 56, status: 'Active', statusColor: 'bg-green-100 text-green-950 dark:bg-green-900/30 dark:text-green-400', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Creative' },
        { id: 4, title: 'Data Scientist', company: 'DataFlow', type: 'Full-time', posted: 'Oct 18, 2024', location: 'Remote', applicants: 89, status: 'Closed', statusColor: 'bg-gray-100 text-gray-950 dark:bg-gray-800 dark:text-gray-400', logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=DataFlow' },
    ];

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
                            placeholder="Search jobs, roles, ID..."
                            className="w-full pl-9 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-card text-foreground text-sm"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        <Plus className="w-4 h-4" />
                        Post New Job
                    </button>
                    <button className="flex items-center justify-center p-2 border border-border bg-card text-foreground rounded-lg hover:bg-accent transition-colors">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex justify-end text-xs text-muted-foreground items-center gap-1">
                Last updated: Today, 09:41 AM <RefreshCw className="w-3 h-3 cursor-pointer hover:text-foreground" />
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
                                    <span className={`text-xs font-semibold mb-1 ${stat.trendColor}`}>
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
                        <Line data={trendsData} options={trendsOptions} />
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
                        {popularRoles.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-medium text-foreground">{item.role}</span>
                                    <span className="text-muted-foreground text-xs">{item.percent}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                    <div
                                        className={`${item.color} h-1.5 rounded-full`}
                                        style={{ width: `${item.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
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
                                onClick={() => setActiveTab(tab)}
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
                        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-muted-foreground bg-card hover:bg-accent hover:text-foreground transition-colors">
                            <ArrowUpDown className="w-4 h-4" />
                            Sort
                        </button>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <th className="p-4 pl-6 cursor-pointer hover:text-foreground">Job Details <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4 cursor-pointer hover:text-foreground">Posted Date <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
                                    <th className="p-4">Applicants</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {jobs.map((job) => (
                                    <tr key={job.id} className="hover:bg-accent/50 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 dark:border-gray-700 p-1 flex items-center justify-center">
                                                    <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-foreground text-sm">{job.title}</div>
                                                    <div className="text-xs text-muted-foreground">{job.company} • {job.location}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                                                {job.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">
                                            {job.posted}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {[...Array(3)].map((_, i) => (
                                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-card bg-gray-200 overflow-hidden">
                                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${job.id}-${i}`} alt="Applicant" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-xs font-medium text-foreground">{job.applicants} Applied</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.statusColor}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${job.statusColor.replace('bg-', 'bg-opacity-100 bg-').split(' ')[0].replace('100', '500')}`}></span>
                                                {job.status}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination placeholder */}
                    <div className="p-4 border-t border-border flex justify-center bg-gray-50/30 dark:bg-gray-900/10">
                        <button className="text-sm text-muted-foreground hover:text-foreground font-medium">View All Jobs</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminJobs;
