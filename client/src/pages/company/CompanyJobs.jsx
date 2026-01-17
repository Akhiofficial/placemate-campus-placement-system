import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import JobStats from '../../components/company/jobs/JobStats';
import JobFilters from '../../components/company/jobs/JobFilters';
import JobCard from '../../components/company/jobs/JobCard';

// Dummy data
const jobs = [
    {
        id: 1,
        title: 'Senior Software Engineer',
        team: 'Product Team',
        type: 'Full-time',
        status: 'Active',
        location: 'San Francisco, CA (Remote)',
        salary: '$120k - $150k / year',
        posted: 'Posted 2 days ago',
        metrics: { applied: 42, inReview: 12, interview: 5 }
    },
    {
        id: 2,
        title: 'Product Designer',
        team: 'Design Team',
        type: 'Full-time',
        status: 'Active',
        location: 'New York, NY (Hybrid)',
        salary: '$90k - $120k / year',
        posted: 'Posted 5 days ago',
        metrics: { applied: 86, inReview: 24, interview: 8 }
    },
    {
        id: 3,
        title: 'Marketing Specialist',
        team: 'Marketing Team',
        type: 'Full-time',
        status: 'Draft',
        location: 'Austin, TX (On-site)',
        salary: 'TBD',
        posted: 'Last edited 2 hours ago',
        metrics: { applied: 0, inReview: 0, interview: 0 }
    },
    {
        id: 4,
        title: 'Backend Developer',
        team: 'Engineering Team',
        type: 'Intern',
        status: 'Closed',
        location: 'Remote',
        salary: '$25 - $35 / hour',
        posted: 'Closed on Oct 12, 2023',
        metrics: { applied: 154, inReview: 0, interview: 0 }
    }
];

const CompanyJobs = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Breadcrumb & Header */}
            <div>
                <div className="flex items-center gap-2 text-sm text-foreground-muted mb-2">
                    <span>Dashboard</span>
                    <ChevronRight size={14} />
                    <span className="text-foreground font-medium">Job Postings</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Job Postings</h1>
                        <p className="text-foreground-muted mt-1">Manage your hiring campaigns and track applicant status.</p>
                    </div>
                    <Link to="/company/jobs/create" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm transition-all text-sm">
                        <Plus size={18} />
                        Create New Job
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <JobStats />

            {/* Filters */}
            <JobFilters />

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>

        </div>
    );
};

export default CompanyJobs;
