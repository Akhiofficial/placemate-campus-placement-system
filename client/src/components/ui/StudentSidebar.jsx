import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  X
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const menuItems = [
  { name: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
  { name: "Profile", path: "/student/profile", icon: User },
  { name: "Job Listings", path: "/student/jobs", icon: Briefcase },
  { name: "My Applications", path: "/student/applications", icon: FileText },
  { name: "Interviews", path: "/student/interviews", icon: Calendar },
  { name: "Settings", path: "/student/settings", icon: Settings },
];

const SidebarContent = ({ theme, toggleTheme, onClose }) => (
  <div className="flex flex-col h-full justify-between">
    {/* Top Section */}
    <div>
      {/* Logo */}
      <div className="px-6 py-6 flex items-center justify-between">
        <span className="text-xl font-bold text-blue-600 tracking-tight">PlaceMate</span>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-foreground-muted hover:text-foreground">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="mx-4 mb-6 p-4 bg-background-muted rounded-xl flex items-center gap-4 transition-colors">
        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-lg">
          A
        </div>
        <div className="leading-tight">
          <p className="font-semibold text-sm text-foreground">
            Alex Johnson
          </p>
          <p className="text-xs text-foreground-muted">
            Comp. Sci · 2024
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="space-y-1 px-3">
        {menuItems.map(({ name, path, icon: Icon }, index) => (
          <NavLink
            key={name}
            to={path}
            onClick={onClose} // Close sidebar on mobile when link clicked
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${isActive
                ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 shadow-sm"
                : "text-foreground-muted hover:bg-background-muted"
              }`
            }
          >
            <Icon size={18} />
            {name}
          </NavLink>
        ))}
      </nav>
    </div>

    {/* Bottom Section */}
    <div className="px-3 pb-5 space-y-1">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleTheme}
        className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-foreground-muted hover:bg-background-muted transition cursor-pointer"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        {theme === 'dark' ? "Light Mode" : "Dark Mode"}
      </button>

      <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-foreground-muted hover:bg-background-muted transition cursor-pointer">
        <HelpCircle size={18} />
        Help Center
      </button>

      <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer">
        <LogOut size={18} />
        Logout
      </button>
    </div>
  </div>
);

const StudentSidebar = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col min-h-screen transition-colors duration-300 fixed md:relative z-30">
        <SidebarContent theme={theme} toggleTheme={toggleTheme} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 md:hidden glass"
            />
            {/* Sidebar Slide-in */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 md:hidden overflow-y-auto"
            >
              <SidebarContent theme={theme} toggleTheme={toggleTheme} onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentSidebar;
