import React from 'react';
import { Calendar, ClipboardList, Users, TrendingUp } from 'lucide-react';

const stats = [
    {
        title: 'Interviews Today',
        value: '12',
        trend: '+2 from yesterday',
        trendColor: 'text-green-600',
        icon: Calendar,
        bgClass: 'bg-white dark:bg-card',
        iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
    },
    {
        title: 'Pending Feedback',
        value: '8',
        subtext: 'Needs attention',
        icon: ClipboardList,
        bgClass: 'bg-white dark:bg-card',
        iconBg: 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
    },
    {
        title: 'Total Shortlisted',
        value: '45',
        subtext: 'Across all active jobs',
        icon: Users,
        bgClass: 'bg-white dark:bg-card',
        iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
    },
];

const InterviewStats = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className={`${stat.bgClass} border border-border rounded-xl p-6 shadow-sm flex justify-between items-start`}>
                    <div>
                        <p className="text-foreground-muted text-sm font-medium mb-2">{stat.title}</p>
                        <h3 className="text-4xl font-bold text-foreground mb-2">{stat.value}</h3>
                        {stat.trend ? (
                            <div className={`flex items-center gap-1 text-xs font-semibold ${stat.trendColor}`}>
                                <TrendingUp size={14} />
                                {stat.trend}
                            </div>
                        ) : (
                            <p className="text-xs text-foreground-muted">{stat.subtext}</p>
                        )}
                    </div>
                    <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                        <stat.icon size={24} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InterviewStats;
