import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Search,
    Clock,
    MapPin,
    Video,
    MonitorPlay
} from 'lucide-react';

const Interviews = () => {
    const { interviews } = useMockData();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('upcoming');

    const upcomingInterviews = interviews.filter(i => i.status === 'Upcoming');

    // Calculate stats
    const upcomingCount = upcomingInterviews.length;

    return (
        <div className="p-4 lg:p-8 animate-fade-in flex flex-col h-full overflow-y-auto no-scrollbar pb-20">
            <header className="mb-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">My Interviews</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage and track your scheduled interviews and feedback.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{upcomingCount}</span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Upcoming</span>
                </div>
            </header>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search company or role..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <button className="bg-blue-600 dark:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 active:scale-95">
                    Sync Calendar
                </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-700 mb-6">
                {['upcoming', 'completed', 'cancelled'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-bold capitalize transition-all relative ${activeTab === tab
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-4 mb-8">
                {activeTab === 'upcoming' && upcomingInterviews.map((interview) => (
                    <div key={interview.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md animate-fade-in group">
                        <div className="flex items-start gap-4">
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-center min-w-[80px] border border-slate-100 dark:border-slate-700">
                                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">{interview.date.split(' ')[0]}</div>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white">{interview.date.split(' ')[1]}</div>
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{interview.time}</div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{interview.role}</h3>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 uppercase">Scheduled</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-3">
                                    <Briefcase className="w-4 h-4" /> {interview.company}
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                                        {interview.type.includes('Virtual') ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                        {interview.type}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                        <Clock className="w-4 h-4" /> {interview.duration}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Details
                            </button>
                            <button className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95">
                                <Video className="w-4 h-4" /> Join
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* New Opportunities Card (Requested) */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-800/20 mt-auto hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                    <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Looking for more opportunities?</h3>
                <button
                    onClick={() => navigate('/student/jobs')}
                    className="text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline"
                >
                    Browse new job openings
                </button>
            </div>

        </div>
    );
};

export default Interviews;
