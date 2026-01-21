import React from 'react';
import { Users, CheckCircle, BrainCircuit, TrendingUp } from 'lucide-react';

const stats = [
    {
        title: 'Total Applicants',
        value: '1,240',
        change: '+12%',
        icon: Users,
        bgClass: 'bg-white dark:bg-card',
        iconColor: 'text-blue-200', // Light icon for background effect
        trendColor: 'text-green-600 bg-green-50 dark:bg-green-500/10',
    },
    {
        title: 'Shortlisted Candidates',
        value: '85',
        change: '+5%',
        subtext: 'Ready for interview',
        icon: CheckCircle,
        bgClass: 'bg-white dark:bg-card',
        iconColor: 'text-green-200',
        trendColor: 'text-green-600 bg-green-50 dark:bg-green-500/10',
    },
    {
        title: 'Avg. Resume Score',
        value: '88',
        maxValue: '/100',
        change: '+2.4%',
        subtext: 'AI Based Assessment',
        icon: BrainCircuit,
        bgClass: 'bg-white dark:bg-card',
        iconColor: 'text-purple-200',
        trendColor: 'text-green-600 bg-green-50 dark:bg-green-500/10',
    },
];

const ApplicationsStats = ({ stats }) => {
    const displayStats = [
        {
            title: 'Total Applicants',
            value: stats?.totalApplicants || 0,
            change: '+12%', // Backend doesn't provide change yet
            icon: Users,
            bgClass: 'bg-white dark:bg-card',
            iconColor: 'text-blue-200',
            trendColor: 'text-green-600 bg-green-50 dark:bg-green-500/10',
        },
        {
            title: 'Shortlisted Candidates',
            value: stats?.shortlisted || 0,
            change: '+5%',
            subtext: 'Ready for interview',
            icon: CheckCircle,
            bgClass: 'bg-white dark:bg-card',
            iconColor: 'text-green-200',
            trendColor: 'text-green-600 bg-green-50 dark:bg-green-500/10',
        },
        {
            title: 'Avg. Resume Score',
            value: stats?.avgScore || 0,
            maxValue: '/100',
            change: '+2.4%',
            subtext: 'AI Based Assessment',
            icon: BrainCircuit,
            bgClass: 'bg-white dark:bg-card',
            iconColor: 'text-purple-200',
            trendColor: 'text-green-600 bg-green-50 dark:bg-green-500/10',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {displayStats.map((stat, index) => (
                <div key={index} className={`${stat.bgClass} border border-border rounded-xl p-6 shadow-sm relative overflow-hidden`}>
                    <div className="relative z-10">
                        <p className="text-foreground-muted text-sm font-medium mb-2">{stat.title}</p>
                        <div className="flex items-baseline gap-2 mb-2">
                            <h3 className="text-4xl font-bold text-foreground">
                                {stat.value}
                                {stat.maxValue && <span className="text-lg text-foreground-muted font-normal">{stat.maxValue}</span>}
                            </h3>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stat.trendColor}`}>
                                {stat.change}
                            </span>
                        </div>
                        {stat.subtext ? (
                            <p className="text-xs text-foreground-muted">{stat.subtext}</p>
                        ) : (
                            <p className="text-xs text-foreground-muted">Vs last week</p>
                        )}
                    </div>

                    {/* Background Icon Decoration */}
                    <div className={`absolute -right-4 -bottom-4 opacity-20 dark:opacity-10 transform rotate-12 ${stat.iconColor}`}>
                        <stat.icon size={100} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ApplicationsStats;
