import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Briefcase, DollarSign, Clock, Building, Calendar, CheckCircle } from "lucide-react";
import api from "../../api/axios";

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            const { data } = await api.get(`/jobs/${id}`);
            setJob(data);
        } catch (error) {
            console.error("Failed to fetch job", error);
            // navigate('/student/jobs'); // Optional: redirect on error
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        try {
            setApplying(true);
            const response = await api.post(`/applications/${id}`);
            alert('Application submitted successfully!'); // or a toast
            // Optionally update local state to show "Applied" instead of button
            // Refetch job details or update a local status flag if backend supported "hasApplied"
        } catch (error) {
            console.error("Application failed", error);
            const msg = error.response?.data?.msg || "Failed to apply. Please try again.";
            alert(msg);
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold text-foreground mb-4">Job Not Found</h2>
                <button
                    onClick={() => navigate('/student/jobs')}
                    className="text-blue-600 hover:underline"
                >
                    Back to Jobs
                </button>
            </div>
        );
    }

    return (
        <main className="flex-1 px-6 py-8 md:px-10">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/student/jobs')}
                    className="flex items-center gap-2 text-foreground-muted hover:text-foreground mb-6 transition"
                >
                    <ArrowLeft size={18} />
                    Back to Jobs
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-2xl p-8 shadow-sm"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between mb-8 pb-8 border-b border-border">
                        <div className="flex gap-5">
                            <div className={`w-20 h-20 ${job.logoBg || 'bg-blue-600'} text-white rounded-xl flex items-center justify-center font-bold text-3xl overflow-hidden shadow-sm`}>
                                {job.companyLogo ? (
                                    <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
                                ) : (
                                    job.company?.charAt(0).toUpperCase() || 'C'
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 mt-2 text-foreground-muted">
                                    <span className="flex items-center gap-1.5">
                                        <Building size={16} /> {job.company}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MapPin size={16} /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock size={16} /> {job.type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[160px]">
                            <button
                                onClick={handleApply}
                                disabled={applying}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {applying ? "Applying..." : "Apply Now"}
                            </button>
                            <div className="text-center text-sm text-foreground-muted">
                                Posted {new Date(job.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-xl font-bold text-foreground mb-3">Job Description</h3>
                                <div className="prose prose-blue max-w-none text-foreground-muted whitespace-pre-line">
                                    {job.description}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-foreground mb-3">Requirements</h3>
                                <ul className="space-y-2">
                                    {(Array.isArray(job.requirements)
                                        ? job.requirements
                                        : (job.requirements ? job.requirements.split('\n') : []))
                                        .map((req, i) => (
                                            <li key={i} className="flex gap-3 text-foreground-muted">
                                                <CheckCircle className="text-blue-600 shrink-0 mt-1" size={18} />
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    {(!job.requirements || job.requirements.length === 0) && <p className="text-foreground-muted">No specific requirements listed.</p>}
                                </ul>
                            </section>

                            {job.responsibility && (
                                <section>
                                    <h3 className="text-xl font-bold text-foreground mb-3">Key Responsibilities</h3>
                                    <div className="text-foreground-muted whitespace-pre-line">
                                        {job.responsibility}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <div className="bg-background-muted/50 p-6 rounded-xl space-y-4">
                                <h3 className="font-semibold text-foreground">Job Overview</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                            <DollarSign size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-foreground-muted mb-0.5">Salary</p>
                                            <p className="font-medium text-foreground">
                                                {job.salary || `${job.salaryMin} - ${job.salaryMax}` || "Not Disclosed"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-foreground-muted mb-0.5">Work Mode</p>
                                            <p className="font-medium text-foreground">{job.workMode || "On-Site"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-foreground-muted mb-0.5">Deadline</p>
                                            <p className="font-medium text-foreground">
                                                {job.deadline ? new Date(job.deadline).toLocaleDateString() : "ASAP"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            {job.tags && (
                                <div>
                                    <h3 className="font-semibold text-foreground mb-3">Skills & Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(job.tags)
                                            ? job.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-background-muted text-foreground-muted rounded-full text-sm font-medium">
                                                    {tag}
                                                </span>
                                            ))
                                            : job.tags.split(',').map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-background-muted text-foreground-muted rounded-full text-sm font-medium">
                                                    {tag.trim()}
                                                </span>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default JobDetails;
