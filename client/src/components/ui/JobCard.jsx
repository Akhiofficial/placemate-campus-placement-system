import { motion } from "framer-motion";

const JobCard = ({ job, index }) => {
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
                className={`w-10 h-10 ${job.logoBg} text-white rounded-lg flex items-center justify-center font-semibold mb-4`}
            >
                {job.logo}
            </div>

            {/* Content */}
            <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-blue-600 transition">
                    {job.role}
                </h3>
                <p className="text-sm text-foreground-muted mt-1">
                    {job.company} · {job.location}
                </p>
            </div>

            {/* Action */}
            <button className="mt-4 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition self-start cursor-pointer">
                View details →
            </button>
        </motion.div>
    );
};

export default JobCard;
