import React from 'react';
import { X, MapPin, DollarSign, Clock, Calendar, Users, Briefcase, FileText } from 'lucide-react';

const JobDetailsModal = ({ job, onClose }) => {
    if (!job) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-card w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{job.title}</h2>
                        <p className="text-foreground-muted">{job.team} • {job.type}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-background-muted rounded-full transition-colors text-foreground-muted hover:text-foreground"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

                    {/* Key Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-gray-50 dark:bg-background-muted rounded-lg">
                            <span className="text-xs text-foreground-muted uppercase font-bold block mb-1">Status</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${job.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                                job.status === 'Draft' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' :
                                    'bg-gray-100 text-gray-500'
                                }`}>
                                {job.status}
                            </span>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-background-muted rounded-lg">
                            <span className="text-xs text-foreground-muted uppercase font-bold block mb-1">Salary</span>
                            <span className="text-sm font-semibold text-foreground">{job.salary}</span>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-background-muted rounded-lg">
                            <span className="text-xs text-foreground-muted uppercase font-bold block mb-1">Location</span>
                            <span className="text-sm font-semibold text-foreground wrap-break-words" title={`${job.location} (${job.workMode})`}>
                                {job.location} <span className="text-xs font-normal text-foreground-muted">({job.workMode || 'On-site'})</span>
                            </span>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-background-muted rounded-lg">
                            <span className="text-xs text-foreground-muted uppercase font-bold block mb-1">Applicants</span>
                            <span className="text-sm font-semibold text-foreground">{job.metrics?.applied || 0}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-bold uppercase text-foreground-muted mb-3 flex items-center gap-2">
                            <Briefcase size={16} /> Job Description
                        </h3>
                        <div className="text-foreground text-sm leading-relaxed space-y-4 whitespace-pre-wrap">
                            {job.description || "No description provided."}
                        </div>
                    </div>

                    {/* Requirements */}
                    {job.requirements && (
                        <div>
                            <h3 className="text-sm font-bold uppercase text-foreground-muted mb-3 flex items-center gap-2">
                                <FileText size={16} /> Requirements
                            </h3>
                            <div className="text-foreground text-sm leading-relaxed space-y-4 whitespace-pre-wrap">
                                {job.requirements}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {job.skills && (
                        <div>
                            <h3 className="text-sm font-bold uppercase text-foreground-muted mb-3 flex items-center gap-2">
                                <Users size={16} /> Required Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.split(',').map((skill, index) => (
                                    <span key={index} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium border border-blue-100 dark:border-blue-800">
                                        {skill.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-gray-50/50 dark:bg-background-muted/30 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-white dark:hover:bg-card transition-colors"
                    >
                        Close
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors">
                        View Applicants
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsModal;
