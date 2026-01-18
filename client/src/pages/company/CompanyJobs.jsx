import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import JobStats from '../../components/company/jobs/JobStats';
import JobFilters from '../../components/company/jobs/JobFilters';
import JobCard from '../../components/company/jobs/JobCard';
import JobDetailsModal from '../../components/company/jobs/JobDetailsModal';
import EditJobModal from '../../components/company/jobs/EditJobModal';

// Dummy Data
const initialJobs = [
    {
        id: 1,
        title: 'Senior Software Engineer',
        team: 'Product Team',
        type: 'Full-time',
        status: 'Active',
        location: 'San Francisco, CA (Remote)',
        salary: '$120k - $150k / year',
        posted: 'Posted 2 days ago',
        metrics: { applied: 42, inReview: 12, interview: 5 },
        description: 'We are looking for a Senior Software Engineer to lead our product team. You will be responsible for designing scalable architectures and mentoring junior developers.',
        skills: 'React, Node.js, AWS, TypeScript',
        workMode: 'Remote',
        requirements: 'Bachelor\'s degree in Computer Science, 5+ years of experience.'
    },
    {
        id: 2,
        title: 'Product Designer',
        team: 'Design Team',
        type: 'Full-time',
        status: 'Active',
        location: 'New York, NY',
        salary: '$90k - $120k / year',
        posted: 'Posted 5 days ago',
        metrics: { applied: 86, inReview: 24, interview: 8 },
        description: 'Join our creative team to design intuitive user experiences. You will work closely with product managers and engineers to build beautiful interfaces.',
        skills: 'Figma, UI/UX, Prototyping, User Research',
        workMode: 'Hybrid',
        requirements: 'Portfolio demonstrating strong design skills, proficiency in Figma.'
    },
    {
        id: 3,
        title: 'Marketing Specialist',
        team: 'Marketing Team',
        type: 'Full-time',
        status: 'Draft',
        location: 'Austin, TX',
        salary: 'TBD',
        posted: 'Last edited 2 hours ago',
        metrics: { applied: 0, inReview: 0, interview: 0 },
        description: 'We need a marketing specialist to drive our growth campaigns. Experience in SEO and content marketing is a plus.',
        skills: 'SEO, Content Marketing, Google Analytics, Social Media',
        workMode: 'On-site',
        requirements: 'Experience with digital marketing tools, strong communication skills.'
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
        metrics: { applied: 154, inReview: 0, interview: 0 },
        description: 'Internship opportunity for backend development enthusiasts. Learn from industry experts and work on real-world projects.',
        skills: 'Python, Django, SQL, API Development',
        workMode: 'Remote',
        requirements: 'Basic understanding of backend concepts, willingness to learn.'
    }
];

const CompanyJobs = () => {
    const [jobs, setJobs] = React.useState(initialJobs);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('All');
    const [typeFilter, setTypeFilter] = React.useState('All');

    // Modal State
    const [viewJob, setViewJob] = React.useState(null);
    const [editJob, setEditJob] = React.useState(null);

    const handlePublishJob = (id) => {
        setJobs(jobs.map(job =>
            job.id === id ? { ...job, status: 'Active', posted: 'Just now', metrics: { applied: 0, inReview: 0, interview: 0 } } : job
        ));
    };

    const handleSaveJob = (updatedJob) => {
        setJobs(jobs.map(job =>
            job.id === updatedJob.id ? updatedJob : job
        ));
    };

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
            <JobFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
            />

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.filter(job => {
                    const statusMatch = statusFilter === 'All' || job.status === statusFilter;
                    const typeMatch = typeFilter === 'All' || job.type === typeFilter;
                    const searchMatch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        job.location.toLowerCase().includes(searchQuery.toLowerCase());
                    return statusMatch && typeMatch && searchMatch;
                }).map(job => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onPublish={() => handlePublishJob(job.id)}
                        onView={() => setViewJob(job)}
                        onEdit={() => setEditJob(job)}
                    />
                ))}
            </div>

            {/* Modals */}
            <JobDetailsModal
                job={viewJob}
                onClose={() => setViewJob(null)}
            />

            <EditJobModal
                job={editJob}
                onClose={() => setEditJob(null)}
                onSave={handleSaveJob}
            />

        </div>
    );
};

export default CompanyJobs;
