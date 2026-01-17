import React, { useState } from 'react';
import { useMockData } from '../../context/MockDataContext';
import {
    Search,
    Filter,
    MapPin,
    Briefcase,
    Clock,
    DollarSign,
    CircleCheck
} from 'lucide-react';

const JobListings = () => {
    const { jobs, applyForJob, applications } = useMockData();

    // Local State for Search/Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All'); // All, Full-time, Internship, Remote

    // Filter Logic
    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || job.tags.includes(filterType);
        return matchesSearch && matchesFilter;
    });

    const isApplied = (jobId) => applications.some(app => app.jobId === jobId);

    return (
        <div className="p-4 lg:p-8 animate-fade-in relative h-full flex flex-col overflow-y-auto no-scrollbar">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Available Opportunities</h1>
                <p className="text-slate-500 dark:text-slate-400">Explore and apply to top companies hiring now.</p>
            </header>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by role, company, or skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {['All', 'Full-time', 'Internship', 'Remote'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all
                                ${filterType === type
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-500 dark:hover:text-blue-400'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                    <button className="px-4 py-2 rounded-lg font-medium text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-2 hover:bg-slate-100 hover:dark:bg-slate-700/50">
                        <Filter className="w-4 h-4" /> More Filters
                    </button>
                </div>
            </div>

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                {filteredJobs.map((job, index) => (
                    <div
                        key={job.id}
                        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 flex flex-col animate-fade-in group"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-4">
                                <div className={`w-12 h-12 rounded-xl ${job.logoBg} flex items-center justify-center text-white text-lg font-bold shadow-md`}>
                                    {job.initial}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{job.role}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{job.company}</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-blue-500 transition-colors">
                                <div className="w-1 h-1 bg-current rounded-full mb-1"></div>
                                <div className="w-1 h-1 bg-current rounded-full mb-1"></div>
                                <div className="w-1 h-1 bg-current rounded-full"></div>
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {job.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-y-3 text-sm mb-6">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <DollarSign className="w-4 h-4" /> {job.salary}
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <MapPin className="w-4 h-4" /> {job.location}
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <Briefcase className="w-4 h-4" /> {job.type}
                            </div>
                            <div className="flex items-center gap-2 text-orange-500 dark:text-orange-400 font-medium">
                                <Clock className="w-4 h-4" /> {job.posted}
                            </div>
                        </div>

                        <div className="mt-auto flex gap-3">
                            <button className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 hover:dark:bg-slate-700">
                                Details
                            </button>
                            <button
                                onClick={() => applyForJob(job)}
                                disabled={isApplied(job.id)}
                                className={`flex-1 py-2.5 rounded-xl font-medium text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                                    ${isApplied(job.id)
                                        ? 'bg-green-600 cursor-default hover:bg-green-600'
                                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                                    }`}
                            >
                                {isApplied(job.id) ? (
                                    <>
                                        <CircleCheck className="w-4 h-4" /> Applied
                                    </>
                                ) : 'Apply Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobListings;
