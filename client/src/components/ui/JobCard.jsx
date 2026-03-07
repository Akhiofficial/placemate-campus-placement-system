import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job, index }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            whileHover={{ y: -6 }}
            className="min-w-[240px] bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition group h-full flex flex-col"
        >
            {/* Logo */}
            <div
                className={`w-10 h-10 ${job.logoBg || 'bg-blue-600'} text-white rounded-lg flex items-center justify-center font-semibold mb-4 overflow-hidden`}
            >
                {job.companyLogo ? (
                    <img
                        src={job.companyLogo.startsWith('http') ? job.companyLogo : `${import.meta.env.VITE_API_URL}${job.companyLogo}`}
                        alt={job.company}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = job.company?.charAt(0).toUpperCase() || 'C'; }}
                    />
                ) : (
                    job.logo || job.company?.charAt(0).toUpperCase() || 'C'
                )}
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition">
                    {job.role || job.title}
                </h3>
                <p className="text-sm text-foreground-muted mt-1">
                    {job.company} · {job.location}
                </p>
            </div>

            {/* Action */}
            <button
                onClick={() => navigate(`/student/jobs/${job._id}`)}
                className="mt-4 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition self-start cursor-pointer"
            >
                View details →
            </button>
        </motion.div>
    );
};

export default JobCard;
