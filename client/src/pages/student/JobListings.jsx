import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Briefcase, MapPin } from "lucide-react";
import JobCard from "../../components/ui/JobCard";
import DashboardHeader from "../../components/student/DashboardHeader";

// Dummy Data (Extended)
const allJobs = [
    { role: "UX Designer", company: "Uber", location: "San Francisco", logo: "U", logoBg: "bg-black" },
    { role: "Backend Engineer", company: "Google", location: "Remote", logo: "G", logoBg: "bg-blue-600" },
    { role: "iOS Developer", company: "Instagram", location: "New York", logo: "I", logoBg: "bg-pink-500" },
    { role: "Cloud Architect", company: "Amazon", location: "Seattle", logo: "A", logoBg: "bg-orange-500" },
    { role: "Product Manager", company: "Airbnb", location: "San Francisco", logo: "A", logoBg: "bg-rose-500" },
    { role: "Frontend Dev", company: "Netflix", location: "Los Gatos", logo: "N", logoBg: "bg-red-600" },
    { role: "Data Scientist", company: "Spotify", location: "Stockholm", logo: "S", logoBg: "bg-green-500" },
    { role: "DevOps Engineer", company: "Microsoft", location: "Redmond", logo: "M", logoBg: "bg-blue-500" },
];

const JobListings = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");

    const filteredJobs = allJobs.filter((job) =>
        job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="flex-1 px-6 py-6 md:px-10 md:py-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Reusing Dashboard Header for consistent top bar, or creating a simpler one */}
                <DashboardHeader />

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
                            <button className="px-4 py-2.5 bg-card border border-border rounded-xl text-foreground hover:bg-background-muted transition flex items-center gap-2 cursor-pointer">
                                <Filter size={18} />
                                <span className="hidden sm:inline">Filters</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job, index) => (
                                <JobCard key={index} job={job} index={index} />
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-foreground-muted">
                                No jobs found matching "{searchTerm}"
                            </div>
                        )}
                    </div>

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
