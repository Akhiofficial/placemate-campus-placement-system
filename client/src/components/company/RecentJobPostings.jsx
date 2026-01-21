import { Link, useNavigate } from 'react-router-dom';

const RecentJobPostings = ({ jobs = [] }) => {
    const navigate = useNavigate();


    // Helper to format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Helper to get initials
    const getInitials = (title) => {
        return title
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };
    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center bg-card">
                <h2 className="text-xl font-bold text-foreground">Recent Job Postings</h2>
                <Link to="/company/jobs" className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:underline">View All</Link>
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
                        {jobs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-foreground-muted">
                                    No  jobs posted yet.
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job) => (
                                <tr key={job._id} className="hover:bg-background-muted transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400`}>
                                                {getInitials(job.title)}
                                            </div>
                                            <div>
                                                <div className="text-foreground font-semibold">{job.title}</div>
                                                <div className="text-xs text-foreground-muted">{job.type} • {job.location}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-foreground-muted font-medium">{formatDate(job.createdAt)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${job.status === 'Open'
                                            ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-800'
                                            : 'bg-slate-800 text-white border-slate-700 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'Open' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                            {job.status === 'Open' ? 'Active' : job.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-foreground-muted font-medium text-xs">
                                                {job.applicantsCount || 0} Applicants
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => navigate('/company/jobs')}
                                            className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-4 border-t border-border flex flex-col md:flex-row gap-4 items-center justify-between bg-card">
                {/* Pagination Text - Adapting colors */}
                <span className="text-sm text-foreground-muted text-center md:text-left">Showing <span className="font-semibold text-foreground">1</span> to <span className="font-semibold text-foreground">3</span> of <span className="font-semibold text-foreground">12</span> jobs</span>
                <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end">
                    <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground-muted hover:bg-background-muted disabled:opacity-50 transition-colors bg-card cursor-pointer">Previous</button>
                    <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground-muted hover:bg-background-muted transition-colors bg-card cursor-pointer">Next</button>
                </div>
            </div>
        </div>
    );
};

export default RecentJobPostings;
