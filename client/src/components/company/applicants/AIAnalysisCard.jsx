import React from 'react';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle, Briefcase } from 'lucide-react';

const AIAnalysisCard = ({ analysis }) => {
    if (!analysis) return null;

    const { match_score = 0, strengths = [], weaknesses = [], relevant_projects = [] } = analysis;

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
        return 'text-orange-600 bg-orange-50 border-orange-200';
    };

    const scoreColorClass = getScoreColor(match_score);

    return (
        <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-8">
            <div className="p-6 border-b border-border bg-linear from-purple-50 to-white dark:from-slate-800 dark:to-slate-900">
                <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900 dark:text-white">
                    <Sparkles size={20} className="text-purple-600" /> AI Candidate Insights
                </h3>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Score Section */}
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bo border border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#eee"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={match_score >= 80 ? '#10b981' : match_score >= 60 ? '#3b82f6' : '#f97316'}
                                strokeWidth="3"
                                strokeDasharray={`${match_score}, 100`}
                                className="animate-[spin_1s_ease-out_reverse]"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{match_score}%</span>
                            <span className="text-xs text-gray-500 uppercase font-bold">Match</span>
                        </div>
                    </div>
                </div>

                {/* Analysis Lists */}
                <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                <TrendingUp size={16} className="text-emerald-500" /> Strengths
                            </h4>
                            <ul className="space-y-2">
                                {strengths.map((str, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                        {str}
                                    </li>
                                ))}
                                {strengths.length === 0 && <li className="text-sm text-gray-400 italic">No specific strengths detected.</li>}
                            </ul>
                        </div>

                        {/* Weaknesses */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                <AlertCircle size={16} className="text-orange-500" /> Areas for Review
                            </h4>
                            <ul className="space-y-2">
                                {weaknesses.map((weak, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0"></div>
                                        {weak}
                                    </li>
                                ))}
                                {weaknesses.length === 0 && <li className="text-sm text-gray-400 italic">No significant gaps found.</li>}
                            </ul>
                        </div>
                    </div>

                    {/* Relevant Projects */}
                    {relevant_projects && relevant_projects.length > 0 && (
                        <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                            <h4 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                <Briefcase size={16} className="text-blue-500" /> Relevant Projects
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {relevant_projects.map((proj, i) => (
                                    <div key={i} className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">{proj.title}</p>
                                        {proj.matchedKeywords && Array.isArray(proj.matchedKeywords) && (
                                            <p className="text-xs text-blue-600/80 dark:text-blue-400">
                                                Matches: {proj.matchedKeywords.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIAnalysisCard;
