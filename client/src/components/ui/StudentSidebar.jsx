import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
  { name: "Profile", path: "/student/profile", icon: User },
  { name: "Job Listings", path: "/student/jobs", icon: Briefcase },
  { name: "My Applications", path: "/student/applications", icon: FileText },
  { name: "Interviews", path: "/student/interviews", icon: Calendar },
  { name: "Settings", path: "/student/settings", icon: Settings },
];

const StudentSidebar = () => {
  const [dark, setDark] = useState(false);

  // Apply dark mode to entire app
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col justify-between min-h-screen transition-colors duration-300">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="px-6 py-6 text-xl font-bold text-blue-600 tracking-tight">
          PlaceMate
        </div>

        {/* Profile Card */}
        <div className="mx-4 mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
            A
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">
              Alex Johnson
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comp. Sci · 2024
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-1 px-3">
          {menuItems.map(({ name, path, icon: Icon }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 shadow-sm"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={18} />
                {name}
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="px-3 pb-5 space-y-1">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          {dark ? "Light Mode" : "Dark Mode"}
        </button>

        <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <HelpCircle size={18} />
          Help Center
        </button>

        <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
