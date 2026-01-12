import { Bell } from "lucide-react";
import { motion } from "framer-motion";

const DashboardHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Left: Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
          Welcome back,{" "}
          <span className="text-blue-600">Student</span> 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Here’s what’s happening with your job applications today.
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notification */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          <Bell size={18} />
        </motion.button>

        {/* Primary Action */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
        >
          Browse Jobs
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
