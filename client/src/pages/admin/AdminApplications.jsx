import React from 'react';
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
    ChevronDown
} from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminApplications = () => {
    // Stats Data
    const stats = [
        { label: 'Total Applications', value: '3,450', subtext: '+12% this week', trend: 'up', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Action Required', value: '128', subtext: 'Pending admin review', trend: 'neutral', icon: Hourglass, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        { label: 'Interviews Scheduled', value: '450', subtext: 'For upcoming 7 days', trend: 'neutral', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { label: 'Placed Candidates', value: '892', subtext: '', trend: 'neutral', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', isProgress: true, progress: 75 },
    ];

    // Status Distribution Chart
    const statusData = {
        labels: ['Applied', 'Interview', 'Placed', 'Rejected'],
        datasets: [
            {
                data: [40, 20, 25, 15],
                backgroundColor: ['#3B82F6', '#A855F7', '#22C55E', '#EF4444'],
                borderWidth: 0,
            },
        ],
    };

    const statusOptions = {
        cutout: '75%',
        plugins: {
            legend: { display: false },
        },
        maintainAspectRatio: false,
    };

    // Top Companies Demand
    const companyDemand = [
        { name: 'TechCorp Inc.', apps: 452, percent: 85, color: 'bg-blue-600' },
        { name: 'Innovate Systems', apps: 320, percent: 60, color: 'bg-blue-500' },
        { name: 'FinSafe Bank', apps: 210, percent: 40, color: 'bg-blue-400' },
        { name: 'Grid Energy', apps: 150, percent: 30, color: 'bg-blue-300' },
    ];

    // Applications Table Data
    const applications = [
        {
            id: 1,
            student: 'Sarah Jenkins',
            studentId: 'CS-24-001',
            role: 'Software Engineer',
            company: 'TechCorp Inc.',
            date: 'Oct 24, 2024',
            status: 'Applied',
            statusColor: 'bg-blue-100 text-blue-950 dark:bg-blue-900/30 dark:text-blue-300',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
        },
        {
            id: 2,
            student: 'Michael Chen',
            studentId: 'IT-24-042',
            role: 'Business Analyst',
            company: 'Innovate Systems',
            date: 'Oct 22, 2024',
            status: 'Shortlisted',
            statusColor: 'bg-amber-100 text-amber-950 dark:bg-amber-900/30 dark:text-amber-300',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
        },
        {
            id: 3,
            student: 'Priya Sharma',
            studentId: 'ECE-24-115',
            role: 'Data Scientist',
            company: 'FinSafe Bank',
            date: 'Oct 20, 2024',
            status: 'Interview',
            statusColor: 'bg-purple-100 text-purple-950 dark:bg-purple-900/30 dark:text-purple-300',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
        },
    ];

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
                            className="w-full pl-9 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-card text-foreground text-sm"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 border border-border bg-card text-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                    <div className="relative">
                        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg bg-card text-foreground text-sm font-medium hover:bg-accent">
                            Fall Semester 2024
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
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

                        {stat.isProgress ? (
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                                <div
                                    className="bg-green-500 h-1.5 rounded-full"
                                    style={{ width: `${stat.progress}%` }}
                                ></div>
                            </div>
                        ) : (
                            <div className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                                {stat.subtext}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status Distribution */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Status Distribution</h3>
                    <div className="h-48 relative flex justify-center">
                        <Doughnut data={statusData} options={statusOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-foreground">3.4k</span>
                            <span className="text-sm text-muted-foreground">Total</span>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                            <span className="text-muted-foreground text-xs">Applied (40%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                            <span className="text-muted-foreground text-xs">Interview (20%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                            <span className="text-muted-foreground text-xs">Placed (25%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                            <span className="text-muted-foreground text-xs">Rejected (15%)</span>
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
                        {companyDemand.map((company, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-foreground">{company.name}</span>
                                    <span className="text-muted-foreground">{company.apps} Apps</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                                    <div
                                        className={`${company.color} h-2.5 rounded-full`}
                                        style={{ width: `${company.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Applications Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Manage Applications</h3>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-card hover:bg-accent transition-colors">
                            All Statuses
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-foreground bg-card hover:bg-accent transition-colors">
                            All Companies
                            <ChevronDown className="w-4 h-4" />
                        </button>
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
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-accent/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                                                    <img src={app.avatar} alt={app.student} />
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
                                                <button className="p-1.5 border border-border rounded hover:bg-accent transition-colors">
                                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                                <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded text-xs font-medium hover:bg-accent transition-colors text-foreground">
                                                    Update
                                                    <Pencil className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminApplications;
