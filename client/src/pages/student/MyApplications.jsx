import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import {
    Search,
    Filter,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';

const MyApplications = () => {
    const { applications } = useMockData();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredApps = applications.filter(app =>
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Applied': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
            case 'Shortlisted': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
            case 'Interview': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
            case 'Rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            case 'Offer': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
            default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200';
        }
    };

    const stats = {
        total: applications.length,
        shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
        interviews: applications.filter(a => a.status === 'Interview').length,
        offers: applications.filter(a => a.status === 'Offer').length
    };

    return (
        <div className="p-4 lg:p-8 animate-fade-in flex flex-col h-full relative">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">My Applications</h1>
                <p className="text-slate-500 dark:text-slate-400">Track the status of your job applications and interviews.</p>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Applied', value: stats.total, icon: '📋' },
                    { label: 'Shortlisted', value: stats.shortlisted, icon: '⭐' },
                    { label: 'Interviews', value: stats.interviews, icon: '📅' },
                    { label: 'Offers', value: stats.offers, icon: '✅' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xl">{stat.icon}</span>
                            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.label}</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by company or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <button className="px-4 py-3 rounded-xl font-medium text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-100 hover:dark:bg-slate-700 transition-colors">
                    <Filter className="w-4 h-4" /> All Statuses
                </button>
            </div>

            {/* Application List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                                <th className="text-left py-4 pl-6 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Company & Role</th>
                                <th className="text-left py-4 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Date Applied</th>
                                <th className="text-left py-4 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                                <th className="text-right py-4 pr-6 font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {filteredApps.map((app, index) => (
                                <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                                    <td className="py-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm text-white shadow-sm transition-transform group-hover:scale-110
                                                ${app.company.includes('Google') ? 'bg-blue-600' :
                                                    app.company.includes('Uber') ? 'bg-black' :
                                                        app.company.includes('Instagram') ? 'bg-pink-600' :
                                                            app.company.includes('Amazon') ? 'bg-orange-500' :
                                                                'bg-slate-500'
                                                }`}
                                            >
                                                {app.initial}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{app.company}</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{app.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">{app.date}</span>
                                            <span className="text-[10px] opacity-60">ID: #APP-{app.id}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit ${getStatusStyle(app.status)}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-6 text-right">
                                        <button className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm font-bold flex items-center gap-1 ml-auto group-hover:underline">
                                            View Details <ArrowUpRight className="w-4 h-4" />
                                        </button>
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

export default MyApplications;
