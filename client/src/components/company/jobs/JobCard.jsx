import React from 'react';
import { MapPin, DollarSign, Clock, Users, FileText, Calendar, Edit2, Code, Megaphone, Server, Palette } from 'lucide-react';

const JobCard = ({ job, onPublish, onView, onEdit }) => {

    // Status color mapping
    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
            case 'Draft': return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
            case 'Closed': return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500'; // Or specific closed style
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    // Icon mapping based on role (simple logic for demo)
    const getIcon = (title) => {
        if (title.includes('Software') || title.includes('Backend')) return Code;
        if (title.includes('Design')) return Palette; // Using Palette for design
        if (title.includes('Marketing')) return Megaphone;
        return Code;
    };

    const Icon = getIcon(job.title);

    // Icon background color mapping (could also be part of job data)
    const getIconBg = (title) => {
        if (title.includes('Software')) return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400';
        if (title.includes('Design')) return 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400';
        if (title.includes('Marketing')) return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
        return 'bg-gray-100 text-gray-600';
    }


    return (
        <div className={`bg-white dark:bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full ${job.status === 'Closed' ? 'opacity-75' : ''}`}>

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getIconBg(job.title)}`}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-foreground leading-tight mb-1">{job.title}</h3>
                        <p className="text-sm text-foreground-muted">{job.team} • {job.type}</p>
                    </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                    {job.status}
                </span>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-6 text-sm text-foreground-muted">
                <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {job.location}
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign size={16} />
                    {job.salary}
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {job.posted}
                </div>
            </div>

            {/* Metrics (Only for Active/Closed, maybe Draft has none or different) */}
            {job.status !== 'Draft' ? (
                <div className="grid grid-cols-3 divide-x divide-border border-t border-border py-4 mb-4">
                    <div className="text-center px-2">
                        <div className="text-xl font-bold text-foreground">{job.metrics?.applied || 0}</div>
                        <div className="text-xs text-foreground-muted">Applied</div>
                    </div>
                    <div className="text-center px-2">
                        <div className="text-xl font-bold text-foreground">{job.metrics?.inReview || 0}</div>
                        <div className="text-xs text-foreground-muted">In Review</div>
                    </div>
                    <div className="text-center px-2">
                        <div className="text-xl font-bold text-foreground">{job.metrics?.interview || 0}</div>
                        <div className="text-xs text-foreground-muted">Interview</div>
                    </div>
                </div>
            ) : (
                <div className="py-4 mb-4 border-t border-border flex items-center justify-center text-sm text-foreground-muted italic h-[76px]">
                    Not published yet
                </div>
            )}

            {/* Actions */}
            <div className="mt-auto flex gap-3">
                {job.status === 'Draft' ? (
                    <button
                        onClick={onPublish}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
                    >
                        Publish Now
                    </button>
                ) : (
                    <button
                        onClick={onView}
                        className="flex-1 flex items-center justify-center bg-white dark:bg-card border border-border hover:bg-gray-50 dark:hover:bg-background-muted text-foreground font-semibold py-2 rounded-lg text-sm transition-colors"
                    >
                        View Details
                    </button>
                )}

                <button
                    onClick={onEdit}
                    className="p-2 border border-border rounded-lg text-foreground-muted hover:text-foreground hover:bg-gray-50 dark:hover:bg-background-muted transition-colors"
                >
                    <Edit2 size={18} />
                </button>
            </div>

        </div>
    );
};

export default JobCard;
