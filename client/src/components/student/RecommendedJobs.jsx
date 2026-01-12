import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const jobs = [
  {
    role: "UX Designer",
    company: "Uber",
    location: "San Francisco",
    logo: "U",
    logoBg: "bg-black",
  },
  {
    role: "Backend Engineer",
    company: "Google",
    location: "Remote",
    logo: "G",
    logoBg: "bg-blue-600",
  },
  {
    role: "iOS Developer",
    company: "Instagram",
    location: "New York",
    logo: "I",
    logoBg: "bg-pink-500",
  },
  {
    role: "Cloud Architect",
    company: "Amazon",
    location: "Seattle",
    logo: "A",
    logoBg: "bg-orange-500",
  },
];

const RecommendedJobs = () => {
  return (
    <div className="mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Recommended for you
        </h2>

        <button className="hidden md:flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline">
          View all
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Cards */}
      <div className="flex gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
        {jobs.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            whileHover={{ y: -6 }}
            className="min-w-[240px] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition group"
          >
            {/* Logo */}
            <div
              className={`w-10 h-10 ${job.logoBg} text-white rounded-lg flex items-center justify-center font-semibold mb-4`}
            >
              {job.logo}
            </div>

            {/* Content */}
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition">
              {job.role}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {job.company} · {job.location}
            </p>

            {/* Action */}
            <button className="mt-4 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition">
              View details →
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedJobs;
