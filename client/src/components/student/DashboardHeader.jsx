import { Bell, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import NotificationsDropdown from "../common/NotificationsDropdown";

const DashboardHeader = ({ user, showBrowseJobs = true }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      {/* Left: Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground leading-tight">
          Welcome back,{" "}
          <span className="text-blue-600">{user?.name?.split(' ')[0] || 'Student'}</span> 👋
        </h1>
        <p className="text-foreground-muted mt-1">
          Here’s what’s happening with your job applications today.
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-card border border-border text-foreground-muted hover:bg-background-muted transition cursor-pointer"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>

        {/* Notification */}
        <NotificationsDropdown />

        {/* Primary Action */}
        {showBrowseJobs && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/student/jobs')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm cursor-pointer"
          >
            Browse Jobs
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
