import React from 'react';
import { Briefcase, Users, Calendar, CheckCircle } from 'lucide-react';

const StatsCards = ({ stats }) => {
    const {
        activeJobs = 0,
        totalApplicants = 0,
        interviews = 0,
        offersReleased = 0
    } = stats || {};

    const statItems = [
        {
            title: 'Active Jobs',
            value: activeJobs,
            change: 'Just updated',
            icon: Briefcase,
            bgClass: 'bg-blue-100 dark:bg-blue-500/20',
            textClass: 'text-blue-600 dark:text-blue-400',
            changeColor: 'text-foreground-muted',
        },
        {
            title: 'Total Applicants',
            value: totalApplicants,
            change: 'Across all jobs',
            icon: Users,
            bgClass: 'bg-indigo-100 dark:bg-indigo-500/20',
            textClass: 'text-indigo-600 dark:text-indigo-400',
            changeColor: 'text-foreground-muted',
        },
        {
            title: 'Interviews',
            value: interviews,
            change: 'Scheduled',
            icon: Calendar,
            bgClass: 'bg-purple-100 dark:bg-purple-500/20',
            textClass: 'text-purple-600 dark:text-purple-400',
            changeColor: 'text-foreground-muted',
        },
        {
            title: 'Offers Released',
            value: offersReleased,
            change: 'Accepted & Pending',
            icon: CheckCircle,
            bgClass: 'bg-green-100 dark:bg-green-500/20',
            textClass: 'text-green-600 dark:text-green-400',
            changeColor: 'text-foreground-muted',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statItems.map((stat, index) => (
                <div key={index} className="bg-card border border-border rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-foreground-muted text-sm font-medium">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-foreground mt-2">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-lg flex items-center justify-center ${stat.bgClass} ${stat.textClass}`}>
                            <stat.icon size={20} />
                        </div>
                    </div>
                    <div>
                        <span className={`text-sm font-medium ${stat.changeColor}`}>
                            {stat.change}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
