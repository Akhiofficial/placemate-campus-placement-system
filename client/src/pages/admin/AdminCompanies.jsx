import React from 'react';
import {
    Search,
    Building2,
    FileText,
    Briefcase,
    TrendingUp,
    Download,
    Filter,
    MoreHorizontal,
    Eye,
    Ban
} from 'lucide-react';
import { Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
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
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminCompanies = () => {
    // Dummy Data for Stats
    const stats = [
        { label: 'Total Companies', value: '142', subtext: '+12 this month', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', trendColor: 'text-green-600' },
        { label: 'Pending Approval', value: '8', subtext: 'Needs review', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', trendColor: 'text-muted-foreground' },
        { label: 'Active Hiring', value: '45', subtext: 'Companies w/ open jobs', icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', trendColor: 'text-muted-foreground' },
        { label: 'Blocked/Inactive', value: '3', subtext: 'Restricted access', icon: Ban, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', trendColor: 'text-muted-foreground' },
    ];

    // Industry Distribution Chart
    const industryData = {
        labels: ['Technology', 'Finance', 'Consulting', 'Others'],
        datasets: [
            {
                data: [40, 25, 20, 15],
                backgroundColor: ['#3B82F6', '#8B5CF6', '#FBBF24', '#94A3B8'],
                borderWidth: 0,
            },
        ],
    };

    const industryOptions = {
        cutout: '70%',
        plugins: {
            legend: { display: false },
        },
        maintainAspectRatio: false,
    };

    // Registration Growth Chart
    const growthData = {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [
            {
                label: 'New Registrations',
                data: [12, 19, 15, 25, 22, 30],
                borderColor: '#10B981',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
            },
        ],
    };

    const growthOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#1e293b',
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: true, drawBorder: false, color: '#334155', tickColor: '#334155' }, // Darker grid for dark mode support? Can't really do conditional nicely without hook, picking a neutral slate
                ticks: { display: false }
            },
            x: {
                grid: { display: false },
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    // Dummy Company Data
    const companies = [
        {
            id: 1,
            name: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            industry: 'Technology',
            industryColor: 'bg-blue-100 text-blue-950 dark:bg-blue-900/30 dark:text-blue-300',
            contactName: 'Sarah Jenkins',
            contactEmail: 'sarah.j@techcorp.com',
            jobs: 5,
            status: 'Approved',
            statusColor: 'bg-green-100 text-green-950 dark:bg-green-900/30 dark:text-green-300'
        },
        {
            id: 2,
            name: 'Innovate Systems',
            location: 'Austin, TX',
            industry: 'Consulting',
            industryColor: 'bg-purple-100 text-purple-950 dark:bg-purple-900/30 dark:text-purple-300',
            contactName: 'Mike Ross',
            contactEmail: 'mike.r@innovate.com',
            jobs: 2,
            status: 'Pending',
            statusColor: 'bg-amber-100 text-amber-950 dark:bg-amber-900/30 dark:text-amber-300'
        },
        {
            id: 3,
            name: 'FinSafe Bank',
            location: 'New York, NY',
            industry: 'Finance',
            industryColor: 'bg-green-100 text-green-950 dark:bg-green-900/30 dark:text-green-300',
            contactName: 'Amanda Lee',
            contactEmail: 'a.lee@finsafe.com',
            jobs: 0,
            status: 'Approved',
            statusColor: 'bg-green-100 text-green-950 dark:bg-green-900/30 dark:text-green-300'
        },
        {
            id: 4,
            name: 'Grid Energy',
            location: 'Denver, CO',
            industry: 'Energy',
            industryColor: 'bg-orange-100 text-orange-950 dark:bg-orange-900/30 dark:text-orange-300',
            contactName: 'David Chen',
            contactEmail: 'd.chen@gridenergy.com',
            jobs: 1,
            status: 'Blocked',
            statusColor: 'bg-red-100 text-red-950 dark:bg-red-900/30 dark:text-red-300'
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Company Management</h1>
                    <div className="flex flex-1 md:max-w-xl gap-3 mt-4 md:mt-0">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search companies, HR contacts..."
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-card text-foreground"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <Building2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Company</span>
                    </button>
                    <button className="flex items-center gap-2 border border-border bg-card text-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export Report</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Registered Companies</h2>
                    <p className="text-muted-foreground text-sm">Manage corporate partners, view profiles, and approve registrations.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-card hover:bg-accent">
                            All Industries
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                    <div className="relative">
                        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-card hover:bg-accent">
                            All Statuses
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>


            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-start justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                            <div className="mt-2 text-left">
                                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                                <span className={`text-xs font-semibold ${stat.trendColor}`}>
                                    {index === 0 ? <span className="text-green-600 dark:text-green-400">↑ </span> : ''}
                                    {stat.subtext}
                                </span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Industry Distribution */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Industry Distribution</h3>
                    <div className="h-48 relative flex justify-center items-center flex-1">
                        <Doughnut data={industryData} options={industryOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-foreground">142</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span className="text-muted-foreground text-xs">Technology (40%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                            <span className="text-muted-foreground text-xs">Finance (25%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                            <span className="text-muted-foreground text-xs">Consulting (20%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                            <span className="text-muted-foreground text-xs">Others (15%)</span>
                        </div>
                    </div>
                </div>

                {/* Company Registrations */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Company Registrations</h3>
                            <p className="text-sm text-muted-foreground">New partners onboarded over last 6 months</p>
                        </div>
                        <span className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-semibold flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +8% Growth
                        </span>
                    </div>
                    <div className="flex-1 h-64 min-h-0 w-full mt-4">
                        <Line data={growthData} options={growthOptions} />
                    </div>
                </div>
            </div>

            {/* Categories / All Companies */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">All Companies</h3>
                    <div className="flex gap-2">
                        <button className="p-2 border border-border rounded-lg text-muted-foreground bg-card hover:bg-accent">
                            <Filter className="w-4 h-4" />
                        </button>
                        <button className="p-2 border border-border rounded-lg text-muted-foreground bg-card hover:bg-accent">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <th className="p-4 w-10">
                                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-transparent" />
                                </th>
                                <th className="p-4">Company Name</th>
                                <th className="p-4">Industry</th>
                                <th className="p-4">HR Contact</th>
                                <th className="p-4">Active Jobs</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {companies.map((company) => (
                                <tr key={company.id} className="hover:bg-accent/50 transition-colors">
                                    <td className="p-4">
                                        <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-transparent" />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                {/* Simple logo placeholder based on industry */}
                                                {company.industry === 'Technology' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
                                                {company.industry === 'Consulting' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                                                {company.industry === 'Finance' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                                {company.industry === 'Energy' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{company.name}</div>
                                                <div className="text-xs text-muted-foreground">{company.location}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${company.industryColor}`}>
                                            {company.industry}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <div className="font-medium text-foreground text-sm">{company.contactName}</div>
                                            <div className="text-xs text-muted-foreground">{company.contactEmail}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm font-semibold text-foreground">{company.jobs}</span>
                                        <span className="text-xs text-muted-foreground ml-1">Roles</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${company.statusColor}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${company.statusColor.replace('bg-', 'bg-opacity-100 bg-').split(' ')[0].replace('100', '500')}`}></span>
                                            {company.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                <Ban className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 border-t border-border flex justify-center">
                        <button className="text-sm text-muted-foreground hover:text-foreground font-medium">View All Companies</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCompanies;
