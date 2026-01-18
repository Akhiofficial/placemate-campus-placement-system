import React, { useState } from 'react';
import { Eye, MoreHorizontal, Download, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const ApplicationsTable = ({ candidates }) => {
    const [selected, setSelected] = useState([]);

    const toggleSelect = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(i => i !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Shortlisted': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30';
            case 'Pending': return 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-100 dark:border-amber-500/30';
            case 'Rejected': return 'bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-100 dark:border-rose-500/30';
            default: return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const getMatchColor = (score) => {
        if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
        if (score >= 70) return 'text-blue-600 dark:text-blue-400';
        return 'text-orange-500 dark:text-orange-400';
    };

    const getMatchLabel = (score) => {
        if (score >= 90) return { text: 'Strong Match', color: 'text-purple-600 dark:text-purple-400', icon: true };
        if (score < 70) return { text: 'Skill Gap', color: 'text-orange-600 dark:text-orange-400', icon: false, warning: true };
        return null;
    };


    return (
        <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white dark:bg-card border-b border-border text-xs uppercase text-gray-400 dark:text-gray-500 font-bold tracking-wider">
                            <th className="p-4 w-12 pl-6">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            </th>
                            <th className="p-4">Candidate</th>
                            <th className="p-4">Degree / CGPA</th>
                            <th className="p-4">Top Skills</th>
                            <th className="p-4">AI Match <Sparkles size={12} className="inline text-purple-600 mb-0.5 ml-1" /></th>
                            <th className="p-4">Status</th>
                            <th className="p-4 pr-6 w-12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-border">
                        {candidates.map((candidate) => {
                            const matchLabel = getMatchLabel(candidate.aiMatch);

                            return (
                                <tr key={candidate.id} className="hover:bg-gray-50/80 dark:hover:bg-background-muted transition-colors group bg-white dark:bg-card">
                                    <td className="p-4 pl-6">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(candidate.id)}
                                            onChange={() => toggleSelect(candidate.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={candidate.image} alt={candidate.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-border shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-foreground text-sm">{candidate.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-foreground-muted">{candidate.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-900 dark:text-foreground font-semibold">{candidate.degree}</div>
                                        <div className="text-xs text-white bg-slate-900 dark:bg-slate-700 px-2 py-1 rounded w-fit mt-1">{candidate.cgpa}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-2">
                                            {candidate.skills.slice(0, 2).map((skill, i) => (
                                                <span key={i} className="text-xs px-3 py-1 bg-[#e0e7ff] dark:bg-indigo-900/20 text-[#4338ca] dark:text-indigo-00 rounded-lg font-semibold border border-indigo-100 dark:border-indigo-900/30">
                                                    {skill}
                                                </span>
                                            ))}
                                            {candidate.skills.length > 2 && (
                                                <span className="text-xs px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-semibold">
                                                    +{candidate.skills.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 min-w-[140px]">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={`text-base font-bold ${getMatchColor(candidate.aiMatch).split(' ')[0]}`}>{candidate.aiMatch}/100</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-800 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${candidate.aiMatch >= 90 ? 'bg-emerald-400' : candidate.aiMatch >= 70 ? 'bg-blue-500' : 'bg-orange-500'}`}
                                                style={{ width: `${candidate.aiMatch}%` }}
                                            ></div>
                                        </div>
                                        {matchLabel && (
                                            <div className={`text-[10px] mt-1 font-bold flex items-center gap-1 ${matchLabel.color}`}>
                                                {matchLabel.icon && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block"></span>}
                                                {matchLabel.warning && <span className="text-orange-500">⚠</span>}
                                                {matchLabel.text}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(candidate.status)}`}>
                                            {candidate.status}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6">
                                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-border bg-gray-50/30 dark:bg-card flex flex-col md:flex-row justify-between items-center gap-4">
                <span className="text-sm text-foreground-muted">Showing {candidates.length} results</span>
                <div className="flex items-center gap-1">
                    <button className="p-1 px-3 border border-border bg-white dark:bg-card rounded hover:bg-gray-50 dark:hover:bg-background-muted text-foreground-muted disabled:opacity-50">
                        <ChevronLeft size={16} />
                    </button>
                    <button className="px-3 py-1 border border-blue-500 bg-blue-600 text-white rounded text-sm font-medium">1</button>
                    <button className="px-3 py-1 border border-border bg-white dark:bg-card text-foreground hover:bg-gray-50 dark:hover:bg-background-muted rounded text-sm font-medium">2</button>
                    <button className="px-3 py-1 border border-border bg-white dark:bg-card text-foreground hover:bg-gray-50 dark:hover:bg-background-muted rounded text-sm font-medium">3</button>
                    <span className="px-2 text-foreground-muted">...</span>
                    <button className="p-1 px-3 border border-border bg-white dark:bg-card rounded hover:bg-gray-50 dark:hover:bg-background-muted text-foreground-muted">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsTable;
