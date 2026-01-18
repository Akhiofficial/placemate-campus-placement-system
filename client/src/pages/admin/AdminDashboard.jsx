import React from 'react';
import {
    Search,
    Plus,
    Bell,
    MoreHorizontal,
    Briefcase,
    Building2,
    Users,
    GraduationCap,
    TrendingUp
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
    // Mock Data for Charts
    const placementData = {
        labels: ['CS', 'IT', 'ECE', 'MECH', 'CIVIL'],
        datasets: [
            {
                label: 'Placed Students',
                data: [450, 380, 200, 150, 80],
                backgroundColor: '#3b82f6', // blue-500
                borderRadius: 4,
                barThickness: 20,
            },
        ],
    };

    const offersData = {
        labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
        datasets: [
            {
                label: 'Offers',
                data: [20, 45, 60, 55, 80, 100],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#3b82f6',
                pointBorderWidth: 2,
            },
        ],
    };

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

    // Stats Cards Data
    const stats = [
        { title: 'Total Students', value: '1,240', change: '+5%', color: 'bg-green-100 text-green-700' },
        { title: 'Placed Students', value: '850', change: '+12%', color: 'bg-green-100 text-green-700', progress: 70 },
        { title: 'Total Offers', value: '1,020', change: '+8%', color: 'bg-green-100 text-green-700' },
        { title: 'Avg Package', value: '$120k', change: '+10%', color: 'bg-green-100 text-green-700' },
    ];

    // Recent Job Postings Data
    const recentJobs = [
        {
            company: 'TechCorp Inc.',
            type: 'Software',
            role: 'Software Engineer',
            date: 'Oct 24, 2024',
            applicants: 42,
            status: 'Active',
            statusColor: 'bg-green-100 text-green-700',
            logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=TechCorp'
        },
        {
            company: 'Innovate Systems',
            type: 'Consulting',
            role: 'Business Analyst',
            date: 'Oct 22, 2024',
            applicants: 15,
            status: 'Pending',
            statusColor: 'bg-yellow-100 text-yellow-700',
            logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Innovate'
        },
        {
            company: 'FinSafe Bank',
            type: 'Finance',
            role: 'Data Scientist',
            date: 'Oct 20, 2024',
            applicants: 0,
            status: 'Closed',
            statusColor: 'bg-gray-100 text-gray-700',
            logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=FinSafe'
        },
        {
            company: 'Grid Energy',
            type: 'Energy',
            role: 'Operations Manager',
            date: 'Oct 18, 2024',
            applicants: 8,
            status: 'Active',
            statusColor: 'bg-green-100 text-green-700',
            logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=Grid'
        },
    ];

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
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        <Plus size={18} />
                        Add Job
                    </button>
                    <button className="flex items-center gap-2 bg-white dark:bg-card border border-gray-200 dark:border-border text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-accent transition-colors">
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
                        {stat.progress && (
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
                        <Bar options={chartOptions} data={placementData} />
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
                        <Line options={chartOptions} data={offersData} />
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
                                                <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground text-sm">{job.company}</p>
                                                <p className="text-xs text-gray-500">{job.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-foreground font-medium">{job.role}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{job.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex -space-x-2">
                                            {/* Dummy Avatars */}
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-card bg-gray-200 overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${index}-${i}`} alt="Applicant" />
                                                </div>
                                            ))}
                                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-card bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                                +{job.applicants > 3 ? job.applicants - 3 : 0}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.statusColor}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${job.status === 'Active' ? 'bg-green-500' : job.status === 'Pending' ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
                                            {job.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
