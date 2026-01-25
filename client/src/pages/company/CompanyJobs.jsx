import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import JobStats from '../../components/company/jobs/JobStats';
import JobFilters from '../../components/company/jobs/JobFilters';
import JobCard from '../../components/company/jobs/JobCard';
import JobDetailsModal from '../../components/company/jobs/JobDetailsModal';
import EditJobModal from '../../components/company/jobs/EditJobModal';
import { getCompanyJobs, getJobPostingsStats, updateJob, deleteJob } from '../../api/companyApi';

const CompanyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [workModeFilter, setWorkModeFilter] = useState('All');

    // Modal State
    const [viewJob, setViewJob] = useState(null);
    const [editJob, setEditJob] = useState(null);

    // Fetch Jobs and Stats
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [jobsData, statsData] = await Promise.all([
                    getCompanyJobs(),
                    getJobPostingsStats()
                ]);

                // Map backend job data to frontend component structure
                const formattedJobs = jobsData.map(job => ({
                    id: job._id,
                    title: job.title,
                    team: job.department, // Backend has department, Frontend UI uses team
                    type: job.type,
                    status: job.status,
                    location: job.location,
                    salary: job.salary,
                    posted: new Date(job.createdAt).toLocaleDateString(),
                    metrics: {
                        applied: job.appliedCount || 0,
                        inReview: job.reviewCount || 0,
                        interview: job.interviewCount || 0
                    },
                    description: job.description,
                    skills: job.tags?.join(', ') || '',
                    workMode: job.workMode,
                    requirements: job.requirements?.join('\n')
                }));

                setJobs(formattedJobs);
                setStats(statsData);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const handlePublishJob = (id) => {
        // Placeholder for publish API call

        // Optimistic update
        setJobs(jobs.map(job =>
            job.id === id ? { ...job, status: 'Open' } : job
        ));
    };

    const handleSaveJob = async (updatedJob) => {
        try {


            // Map frontend UpdateJob data structure back to backend API payload
            // Note: updatedJob comes from EditJobModal which has fields: title, team, type, location, salary, status, description, skills, workMode, requirements

            const apiPayload = {
                title: updatedJob.title,
                department: updatedJob.team, // Map team -> department
                type: updatedJob.type,
                location: updatedJob.location,
                salary: updatedJob.salary,
                status: updatedJob.status,
                description: updatedJob.description,
                requirements: updatedJob.skills ? updatedJob.skills.split(',').map(s => s.trim()) : [], // Convert skills string to array? Or does backend handle it? 
                // Wait, EditJobModal sends skills as string, and also requirements as string.
                // The backend expects requirements as an array ideally, but I handled dynamic fields carefully.
                // Looking at createJob, requirements is an array.
                // EditJobModal has "requirements" text area.

                workMode: updatedJob.workMode
            };

            // If requirements is a string in EditJobModal (which it seems to be in the code I viewed earlier), split it
            if (typeof updatedJob.requirements === 'string') {
                // Try to split by new line or comma? 
                // EditJobModal placeholder says "Enter job requirements..."
                apiPayload.requirements = updatedJob.requirements.split('\n').filter(s => s.trim());
            }

            // Also map skills to tags? or merge into requirements?
            // The EditJobModal has separate skills input. 
            // The backend CreateJob uses `tags`. Let's map skills to `tags`.
            if (typeof updatedJob.skills === 'string') {
                apiPayload.tags = updatedJob.skills.split(',').map(s => s.trim());
            }

            const response = await updateJob(updatedJob.id, apiPayload);

            // Re-fetch or update local state correctly from backend response
            setJobs(jobs.map(job =>
                job.id === updatedJob.id ? {
                    ...job,
                    /* Update fields from response */
                    title: response.title,
                    team: response.department,
                    type: response.type,
                    status: response.status,
                    location: response.location,
                    salary: response.salary,
                    description: response.description,
                    workMode: response.workMode,
                    /* Format Arrays to Strings for UI */
                    skills: response.tags?.join(', ') || '',
                    requirements: response.requirements?.join('\n') || ''
                } : job
            ));

        } catch (error) {
            console.error("Failed to update job:", error);
            alert("Failed to save changes. Please try again.");
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
            return;
        }

        try {
            await deleteJob(id);
            // Remove from state
            setJobs(jobs.filter(job => job.id !== id));
            // Update stats if needed (optional, or just decrement)
        } catch (error) {
            console.error("Failed to delete job:", error);
            alert("Failed to delete job. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

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
            <JobStats stats={stats} />

            {/* Filters */}
            <JobFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                workModeFilter={workModeFilter}
                setWorkModeFilter={setWorkModeFilter}
            />

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.filter(job => {
                    const statusMatch = statusFilter === 'All' || job.status === statusFilter;
                    const typeMatch = typeFilter === 'All' || job.type === typeFilter;
                    const workModeMatch = workModeFilter === 'All' || job.workMode === workModeFilter;
                    const searchMatch =
                        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        job.location.toLowerCase().includes(searchQuery.toLowerCase());
                    return statusMatch && typeMatch && workModeMatch && searchMatch;
                }).map(job => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onPublish={() => handlePublishJob(job.id)}
                        onView={() => setViewJob(job)}
                        onEdit={() => setEditJob(job)}
                        onDelete={() => handleDeleteJob(job.id)}
                    />
                ))}
                {jobs.length === 0 && (
                    <div className="col-span-full text-center py-10 text-foreground-muted">
                        No jobs found. Create your first job posting!
                    </div>
                )}
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
