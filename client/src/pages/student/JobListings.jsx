import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Briefcase, MapPin, Loader2, X } from "lucide-react";
import JobCard from "../../components/ui/JobCard";
import DashboardHeader from "../../components/student/DashboardHeader";
import api from "../../api/axios";

const JobListings = () => {
    const { studentData } = useOutletContext();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        type: "All",
        workMode: "All"
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data } = await api.get('/jobs');
            setJobs(data);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ type: "All", workMode: "All" });
        setSearchTerm("");
    };

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = (job.title || job.role).toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filters.type === "All" || job.type === filters.type;
        const matchesWorkMode = filters.workMode === "All" || job.workMode === filters.workMode;

        return matchesSearch && matchesType && matchesWorkMode;
    });

    return (
        <main className="flex-1 px-6 py-6 md:px-10 md:py-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Reusing Dashboard Header for consistent top bar, or creating a simpler one */}
                <DashboardHeader user={studentData?.user} showBrowseJobs={false} />

                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center"
                    >
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Find Your Dream Job</h1>
                            <p className="text-foreground-muted mt-1">Browse and apply to the best opportunities for you.</p>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by role or company..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition text-foreground"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition text-sm font-medium ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-card border-border text-foreground hover:bg-background-muted'}`}
                                >
                                    <Filter size={18} />
                                    <span className="hidden sm:inline">Filters</span>
                                </button>

                                {/* Filter Dropdown */}
                                <AnimatePresence>
                                    {showFilters && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute top-12 right-0 w-64 bg-card border border-border rounded-xl shadow-lg p-4 z-10"
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="font-semibold text-sm  text-foreground">Filters</span>
                                                <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">Clear all</button>
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-xs font-medium text-foreground-muted mb-1 block">Job Type</label>
                                                    <select
                                                        value={filters.type}
                                                        onChange={(e) => handleFilterChange('type', e.target.value)}
                                                        className="w-full p-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    >
                                                        <option value="All" className="bg-background text-foreground">All Types</option>
                                                        <option value="Full-time" className="bg-background text-foreground">Full-time</option>
                                                        <option value="Internship" className="bg-background text-foreground">Internship</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-foreground-muted mb-1 block">Work Mode</label>
                                                    <select
                                                        value={filters.workMode}
                                                        onChange={(e) => handleFilterChange('workMode', e.target.value)}
                                                        className="w-full p-2 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    >
                                                        <option value="All" className="bg-background text-foreground">All Modes</option>
                                                        <option value="Remote" className="bg-background text-foreground">Remote</option>
                                                        <option value="On-site" className="bg-background text-foreground">On-site</option>
                                                        <option value="Hybrid" className="bg-background text-foreground">Hybrid</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                    {/* Results */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20 col-span-full">
                            <Loader2 className="animate-spin text-blue-600" size={40} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map((job, index) => (
                                    <JobCard key={job._id || index} job={job} index={index} />
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center text-foreground-muted">
                                    No jobs found matching "{searchTerm}"
                                </div>
                            )}
                        </div>
                    )}

                    {/* Load More */}
                    {filteredJobs.length > 0 && (
                        <div className="flex justify-center mt-8">
                            <button className="px-6 py-2.5 border border-border bg-card rounded-lg text-sm font-medium text-foreground hover:bg-background-muted transition cursor-pointer">
                                Load More Jobs
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </main>
    );
};

export default JobListings;
