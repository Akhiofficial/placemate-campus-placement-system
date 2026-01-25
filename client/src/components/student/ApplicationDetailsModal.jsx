import React from 'react';
import { X, MapPin, IndianRupee, Clock, Calendar, Users, Briefcase, FileText, CheckCircle } from 'lucide-react';

const ApplicationDetailsModal = ({ application, onClose }) => {
    if (!application) return null;
    const job = application.job || {};

    const getStatusColor = (status) => {
        switch (status) {
            case 'Applied': return "bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300";
            case 'In Review': return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
            case 'Shortlisted': return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
            case 'Interview': return "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400";
            case 'Offer':
            case 'Placed': return "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400";
            case 'Rejected': return "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-card w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-white dark:bg-card z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground">{job.title || "Unknown Role"}</h2>
                        <p className="text-foreground-muted">{job.company || "Unknown Company"}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-background-muted rounded-full transition-colors text-foreground-muted hover:text-foreground"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

                    {/* Application Status Banner */}
                    <div className="p-4 bg-gray-50 dark:bg-background-muted/50 rounded-xl border border-border flex items-center justify-between">
                        <div>
                            <p className="text-xs text-foreground-muted uppercase font-bold mb-1">Application Status</p>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-sm font-semibold ${getStatusColor(application.status)}`}>
                                {application.status}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-foreground-muted uppercase font-bold mb-1">Applied On</p>
                            <p className="text-sm font-medium text-foreground">
                                {new Date(application.createdAt).toLocaleDateString("en-US", {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Job Key Info */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 dark:bg-background-muted rounded-lg">
                            <span className="text-xs text-foreground-muted uppercase font-bold block mb-1">Salary</span>
                            <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                                <IndianRupee size={14} className="text-foreground-muted" /> {job.salary || "Not Disclosed"}
                            </span>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-background-muted rounded-lg">
                            <span className="text-xs text-foreground-muted uppercase font-bold block mb-1">Location</span>
                            <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                                <MapPin size={14} className="text-foreground-muted" /> {job.location || "Remote"}
                            </span>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-background-muted rounded-lg">
                            <span className="text-xs text-foreground-muted uppercase font-bold block mb-1">Type</span>
                            <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                                <Clock size={14} className="text-foreground-muted" /> {job.type || "Full-time"}
                            </span>
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
                    {job.requirements && job.requirements.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold uppercase text-foreground-muted mb-3 flex items-center gap-2">
                                <FileText size={16} /> Requirements
                            </h3>
                            <ul className="list-disc list-inside text-foreground text-sm leading-relaxed space-y-1">
                                {Array.isArray(job.requirements) ? job.requirements.map((req, i) => (
                                    <li key={i}>{req}</li>
                                )) : <div className="whitespace-pre-wrap">{job.requirements}</div>}
                            </ul>
                        </div>
                    )}

                    {/* Application ID Footer */}
                    <div className="pt-4 border-t border-border text-center">
                        <p className="text-xs text-foreground-muted">Application ID: <span className="font-mono text-foreground">{application.applicationId || application._id}</span></p>
                    </div>

                </div>

                {/* Footer Modal Action */}
                <div className="p-6 border-t border-border bg-gray-50/50 dark:bg-background-muted/30 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailsModal;
