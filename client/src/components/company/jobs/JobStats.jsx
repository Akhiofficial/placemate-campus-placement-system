import React from 'react';
import { Briefcase, Users, FileText, CheckCircle } from 'lucide-react';

const JobStats = ({ stats }) => {
    // Default structure if no stats provided
    const displayStats = [
        {
            title: 'Total Active Jobs',
            value: stats?.activeJobs || '0',
            icon: CheckCircle,
            bgClass: 'bg-white dark:bg-card',
            iconBg: 'bg-green-100 dark:bg-green-500/20',
            iconColor: 'text-green-600 dark:text-green-400',
        },
        {
            title: 'Total Applicants',
            value: stats?.totalApplicants || '0',
            icon: Users,
            bgClass: 'bg-white dark:bg-card',
            iconBg: 'bg-blue-100 dark:bg-blue-500/20',
            iconColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            title: 'Pending Reviews',
            value: stats?.pendingReviews || '0',
            icon: FileText,
            bgClass: 'bg-white dark:bg-card',
            iconBg: 'bg-orange-100 dark:bg-orange-500/20',
            iconColor: 'text-orange-600 dark:text-orange-400',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {displayStats.map((stat, index) => (
                <div key={index} className={`${stat.bgClass} border border-border rounded-xl p-6 shadow-sm flex items-center justify-between`}>
                    <div>
                        <p className="text-foreground-muted text-sm font-medium mb-1">{stat.title}</p>
                        <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                    </div>
                    <div className={`p-3 rounded-full ${stat.iconBg} ${stat.iconColor}`}>
                        <stat.icon size={24} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default JobStats;
