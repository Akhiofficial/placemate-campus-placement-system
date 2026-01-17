import React from 'react';
import { useMockData } from '../../context/MockDataContext';
import {
    Calendar,
    ArrowRight,
    Bell,
    CircleCheck,
    Search,
    Download,
    Eye
} from 'lucide-react';

const StudentDashboard = () => {
    const { user, applications, jobs } = useMockData();

    // Derived Stats
    const totalApplications = applications.length;
    const interviewsScheduled = applications.filter(app => app.status === 'Interview').length;
    const offersReceived = applications.filter(app => app.status === 'Offer').length;

    return (
        <div className="p-4 lg:p-8 animate-fade-in">
            {/* Header */}
            <header className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-1 text-slate-900 dark:text-white">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Here is what is happening with your job applications today.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-none transition-all duration-300 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-110 active:scale-95">
                        <Bell className="w-5 h-5" />
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-600/40 active:scale-95">
                        <Search className="w-4 h-4" />
                        Browse Jobs
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in delay-100">
                <StatCard
                    title="Total Applications"
                    value={totalApplications}
                    trend="↑ 20%"
                    trendUp={true}
                    icon={ArrowRight}
                    iconBg="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                />
                <StatCard
                    title="Interviews Scheduled"
                    value={interviewsScheduled}
                    trend="↑ 1 new"
                    trendUp={true}
                    icon={Calendar}
                    iconBg="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                />
                <StatCard
                    title="Offers Received"
                    value={offersReceived}
                    trend="Pending review"
                    trendUp={true}
                    icon={CircleCheck}
                    iconBg="bg-green-50 dark:bg-green-900/20 text-emerald-600 dark:text-emerald-400"
                />
            </div>

            {/* Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 animate-fade-in delay-200">

                {/* Recent Applications (Left 2/3) */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm dark:shadow-none transition-colors duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Applications</h2>
                        <button className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline transition-all">View All</button>
                    </div>

                    <div className="space-y-4">
                        {applications.slice(0, 4).map((app, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.01] cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-500 dark:text-slate-300 transition-transform group-hover:scale-110">
                                        {app.initial}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{app.company}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{app.role}</p>
                                    </div>
                                </div>
                                <div className="hidden sm:block text-sm text-slate-500 dark:text-slate-400">{app.date}</div>
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 
                                        ${app.status === 'Applied' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                            app.status === 'Interview' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                                                app.status === 'Offer' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                                                    app.status === 'Rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                                                        'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'} 
                                        transition-all hover:bg-opacity-80`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Academic Profile (Right 1/3) */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm dark:shadow-none transition-colors duration-500">
                        <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Academic Profile</h2>

                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 transition-all duration-300 hover:scale-105">
                                <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">CGPA</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-slate-900 dark:text-white">{user.cgpa}</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">/4.0</span>
                                </div>
                            </div>
                            <div className="flex-1 bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 transition-all duration-300 hover:scale-105">
                                <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">YEAR</p>
                                <span className="text-3xl font-bold text-slate-900 dark:text-white">{user.year}</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 mb-6 hover:-translate-y-1 transition-transform duration-300">
                            <p className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-2">MAJOR</p>
                            <p className="font-bold text-lg leading-tight text-slate-900 dark:text-white">{user.major}</p>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Resume</h3>
                                <span className="text-xs text-slate-400">Last updated: 2d ago</span>
                            </div>
                            <div className="border-2 border-dashed border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/10 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:scale-[1.02] active:scale-95 transition-all duration-300 group">
                                <div className="bg-white dark:bg-slate-700 p-2 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                    <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <p className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">{user.resume}</p>
                                <p className="text-xs text-blue-400">Click to replace or drag new file</p>
                            </div>
                            <button className="w-full mt-4 flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline">
                                <Eye className="w-4 h-4" /> Preview Resume
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Section (Using Jobs from Context) */}
            <div className="animate-fade-in delay-300">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recommended for you</h2>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:scale-110 active:scale-90 transition-all">←</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:scale-110 active:scale-90 transition-all">→</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {jobs.slice(0, 4).map((job, index) => (
                        <JobCard
                            key={job.id}
                            job={job}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Helper Components
const StatCard = ({ title, value, trend, trendUp, icon: Icon, iconBg }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm dark:shadow-none flex items-start justify-between cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mb-2">{title}</p>
                <div className="flex items-baseline gap-3">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
                    <span className={`text-sm font-bold ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {trend}
                    </span>
                </div>
            </div>
            <div className={`p-2.5 rounded-xl ${iconBg} bg-opacity-10 transition-transform duration-300 hover:rotate-12`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    );
};

const JobCard = ({ job }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer group shadow-sm flex flex-col hover:border-blue-400 dark:hover:border-blue-500/50">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-10 h-10 rounded-lg ${job.logoBg} flex items-center justify-center text-white font-bold text-sm shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                {job.initial}
            </div>
            <div className="text-slate-300 dark:text-slate-600 group-hover:text-blue-400 dark:group-hover:text-blue-400 transition-colors">
                <div className="w-4 h-6 bg-slate-100 dark:bg-slate-700 rounded-sm group-hover:bg-blue-50 dark:group-hover:bg-blue-900/50 transition-colors"></div>
            </div>
        </div>
        <h3 className="font-bold text-base mb-1 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.role}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{job.company} • {job.location}</p>
    </div>
);

export default StudentDashboard;
