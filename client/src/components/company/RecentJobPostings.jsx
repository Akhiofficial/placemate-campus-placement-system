import React from 'react';

const jobs = [
    {
        id: 1,
        title: 'Software Engineer I',
        type: 'Full-time • Remote',
        date: 'Oct 24, 2023',
        status: 'Active',
        applicants: 45,
        initials: 'SE',
        iconBg: 'bg-blue-100 dark:bg-blue-500/20',
        iconText: 'text-blue-600 dark:text-blue-400',
        applicantsImages: [
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
        ]
    },
    {
        id: 2,
        title: 'Product Design Intern',
        type: 'Internship • On-site',
        date: 'Oct 20, 2023',
        status: 'Active',
        applicants: 20,
        initials: 'PD',
        iconBg: 'bg-pink-100 dark:bg-pink-500/20',
        iconText: 'text-pink-600 dark:text-pink-400',
        applicantsImages: [
            "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
        ]
    },
    {
        id: 3,
        title: 'Data Analyst',
        type: 'Full-time • Hybrid',
        date: 'Sep 15, 2023',
        status: 'Closed',
        applicants: 102,
        initials: 'DA',
        iconBg: 'bg-orange-100 dark:bg-orange-500/20',
        iconText: 'text-orange-600 dark:text-orange-400',
        applicantsImages: [
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Steve"
        ]
    },
];

const RecentJobPostings = () => {
    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center bg-card">
                <h2 className="text-xl font-bold text-foreground">Recent Job Postings</h2>
                <button className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-foreground-muted">
                    <thead className="bg-background-muted text-xs uppercase text-foreground-muted font-semibold">
                        <tr>
                            <th className="px-6 py-4">Job Title</th>
                            <th className="px-6 py-4">Date Posted</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Applicants</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-background-muted transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${job.iconBg} ${job.iconText}`}>
                                            {job.initials}
                                        </div>
                                        <div>
                                            <div className="text-foreground font-semibold">{job.title}</div>
                                            <div className="text-xs text-foreground-muted">{job.type}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-foreground-muted font-medium">{job.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${job.status === 'Active'
                                            ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-800'
                                            : 'bg-slate-800 text-white border-slate-700 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {job.applicantsImages.map((img, i) => (
                                                <img key={i} src={img} alt="Applicant" className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover" />
                                            ))}
                                        </div>
                                        <span className="text-foreground-muted font-medium text-xs">
                                            {job.applicants} Applicants
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-border flex items-center justify-between bg-card">
                {/* Pagination Text - Adapting colors */}
                <span className="text-sm text-foreground-muted">Showing <span className="font-semibold text-foreground">1</span> to <span className="font-semibold text-foreground">3</span> of <span className="font-semibold text-foreground">12</span> jobs</span>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground-muted hover:bg-background-muted disabled:opacity-50 transition-colors bg-card cursor-pointer">Previous</button>
                    <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground-muted hover:bg-background-muted transition-colors bg-card cursor-pointer">Next</button>
                </div>
            </div>
        </div>
    );
};

export default RecentJobPostings;
