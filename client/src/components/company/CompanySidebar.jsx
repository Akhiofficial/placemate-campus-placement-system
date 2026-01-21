import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Calendar,
    Building,
    LogOut,
    Moon,
    Sun,
    X,
    Settings,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const menuItems = [
    { name: "Dashboard", path: "/company/dashboard", icon: LayoutDashboard },
    { name: "Job Postings", path: "/company/jobs", icon: Briefcase },
    { name: "Applicants", path: "/company/applicants", icon: Users },
    { name: "Interview Schedule", path: "/company/interviews", icon: Calendar },
    { name: "Company Profile", path: "/company/profile", icon: Building },
];

const SidebarContent = ({ theme, toggleTheme, onClose, user }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");
            navigate("/");
        }
    };

    return (
        <div className="flex flex-col h-full bg-card text-foreground transition-colors duration-300">
            {/* Top Section */}
            <div className="flex-1">
                {/* Logo */}
                <div className="px-6 py-8 flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
                            <span className="text-xl font-bold text-foreground tracking-tight">PlaceMate</span>
                        </div>
                        <span className="text-xs text-foreground-muted font-medium tracking-wider uppercase mt-1 ml-10">Recruiter Panel</span>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="md:hidden text-foreground-muted hover:text-foreground">
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Menu */}
                <nav className="space-y-1 px-4 mt-2">
                    {menuItems.map(({ name, path, icon: Icon }) => (
                        <NavLink
                            key={name}
                            to={path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 shadow-sm"
                                    : "text-foreground-muted hover:bg-background-muted hover:text-foreground"
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
            <div className="px-4 pb-6 space-y-4">
                {/* Dark Mode Toggle */}
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-foreground hover:bg-background-muted transition-colors cursor-pointer"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    {theme === 'dark' ? "Light Mode" : "Dark Mode"}
                </button>

                {/* Settings */}
                <NavLink
                    to="/company/settings"
                    onClick={onClose}
                    className={({ isActive }) =>
                        `flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${isActive
                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600'
                            : 'text-foreground hover:bg-background-muted'}`
                    }
                >
                    <Settings size={20} />
                    Settings
                </NavLink>

                {/* Log Out */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer group">
                    <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                    Log Out
                </button>

                {/* Profile Card */}
                <div className="pt-4 mt-2 border-t border-border">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center overflow-hidden shrink-0 border border-border">
                            {user?.companyLogo ? (
                                <img
                                    src={`http://localhost:5000${user.companyLogo}`}
                                    alt="Company Logo"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;
                                    }}
                                />
                            ) : user?.name ? (
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                "U"
                            )}
                        </div>
                        <div className="leading-tight overflow-hidden">
                            <p className="font-semibold text-sm text-foreground truncate">
                                {user?.name || 'Recruiter'}
                            </p>
                            <p className="text-xs text-foreground-muted truncate">
                                {user?.companyName || 'Company'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CompanySidebar = ({ isOpen, onClose, user }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 bg-card border-r border-border flex-col min-h-screen transition-colors duration-300 sticky top-0 h-screen overflow-y-auto">
                <SidebarContent theme={theme} toggleTheme={toggleTheme} user={user} />
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
                            className="fixed inset-0 bg-black/50 z-40 md:hidden glass-dark"
                        />
                        {/* Sidebar Slide-in */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-50 md:hidden overflow-y-auto"
                        >
                            <SidebarContent theme={theme} toggleTheme={toggleTheme} onClose={onClose} user={user} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default CompanySidebar;
