import React, { useState } from 'react';
import { ChevronRight, Info, FileText, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createJob } from '../../api/companyApi';

const CreateJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        type: 'Full-time',
        workMode: 'On-site',
        salaryMin: '',
        salaryMax: '',
        description: '',
        requirements: '',
        department: '', // Added department
        location: ''    // Added location
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validation
        if (!formData.title || !formData.description || !formData.salaryMin || !formData.salaryMax || !formData.location || !formData.department) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        try {
            const jobPayload = {
                title: formData.title,
                type: formData.type,
                workMode: formData.workMode,
                salary: `₹${formData.salaryMin} - ₹${formData.salaryMax} LPA`,
                description: formData.description,
                requirements: formData.requirements.split('\n').filter(line => line.trim() !== ''), // Split by new line
                department: formData.department,
                location: formData.location,
                tags: [] // Can add tags UI later
            };

            await createJob(jobPayload);
            navigate('/company/jobs');
        } catch (err) {
            console.error("Failed to create job:", err);
            setError(typeof err === 'string' ? err : "Failed to create job. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-12">
            {/* Breadcrumb & Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-foreground-muted mb-2">
                    <Link to="/company/jobs" className="hover:text-foreground transition-colors">Job Postings</Link>
                    <ChevronRight size={14} />
                    <span className="text-foreground font-medium">Create New Job</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Create New Job Posting</h1>
                        <p className="text-foreground-muted mt-1">Fill in the details to publish a new recruitment opportunity for students.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/company/jobs')}
                            className="px-5 py-2.5 bg-white dark:bg-card border border-border rounded-lg font-semibold text-foreground hover:bg-gray-50 dark:hover:bg-background-muted transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? 'Publishing...' : 'Publish Job'}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Basic Information Section */}
                <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-border bg-gray-50/50 dark:bg-card flex items-center gap-2">
                        <Info className="text-blue-600" size={20} />
                        <h2 className="font-bold text-lg text-foreground">Basic Information</h2>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Job Title */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Job Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                type="text"
                                placeholder="e.g. Senior Software Engineer"
                                className="w-full px-4 py-2.5 bg-white dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Department */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Department/Team <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. Engineering, Design"
                                    className="w-full px-4 py-2.5 bg-white dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                />
                            </div>
                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="e.g. New York, Remote"
                                    className="w-full px-4 py-2.5 bg-white dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Job Type */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Job Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all custom-select appearance-none"
                                >
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Internship</option>
                                    <option>Contract</option>
                                </select>
                            </div>
                            {/* Work Mode */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Work Mode <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="workMode"
                                    value={formData.workMode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all custom-select appearance-none"
                                >
                                    <option>On-site</option>
                                    <option>Remote</option>
                                    <option>Hybrid</option>
                                </select>
                            </div>
                        </div>

                        {/* Salary Range */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Salary Range (Annual in LPA) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</div>
                                    <input
                                        name="salaryMin"
                                        value={formData.salaryMin}
                                        onChange={handleChange}
                                        type="number"
                                        placeholder="Min"
                                        className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                                <span className="text-foreground-muted font-medium">to</span>
                                <div className="relative flex-1">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</div>
                                    <input
                                        name="salaryMax"
                                        value={formData.salaryMax}
                                        onChange={handleChange}
                                        type="number"
                                        placeholder="Max"
                                        className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Details Section */}
                <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-border bg-gray-50/50 dark:bg-card flex items-center gap-2">
                        <FileText className="text-blue-600" size={20} />
                        <h2 className="font-bold text-lg text-foreground">Job Details</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Job Description */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Job Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                placeholder="Describe the role, responsibilities, and team environment..."
                                className="w-full px-4 py-3 bg-white dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 resize-y"
                            ></textarea>
                        </div>

                        {/* Requirements */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Requirements & Skills <span className="text-red-500">*</span> (Separate each requirement by a new line)
                            </label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                rows="6"
                                placeholder="List key technical skills and soft skills required..."
                                className="w-full px-4 py-3 bg-white dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 resize-y"
                            ></textarea>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    );
};

export default CreateJob;
