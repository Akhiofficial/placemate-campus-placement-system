import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMockData } from '../../context/MockDataContext';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    Calendar,
    Settings,
    User,
    LogOut,
    Moon,
    Sun,
    CircleHelp
} from 'lucide-react';

const DashboardLayout = () => {
    const { toggleTheme, themeMode } = useMockData();
    const isDarkMode = themeMode === 'dark';
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans overflow-hidden transition-colors duration-500">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] hidden md:flex flex-col transition-colors duration-500 z-20">
                <div className="p-6 pb-2">
                    <div className="flex items-center gap-2 mb-8 animate-fade-in">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-blue-600">PlaceMate</span>
                    </div>

                    {/* Profile Section in Sidebar */}
                    <UserQuickView />
                </div>

                <nav className="flex-1 px-4 space-y-1 animate-fade-in delay-200">
                    <NavItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={isActive('/student/dashboard')}
                        onClick={() => navigate('/student/dashboard')}
                    />
                    <NavItem
                        icon={User}
                        label="Profile"
                        active={isActive('/student/profile')}
                        onClick={() => navigate('/student/profile')}
                    />
                    <NavItem
                        icon={Briefcase}
                        label="Job Listings"
                        active={isActive('/student/jobs')}
                        badge="New"
                        onClick={() => navigate('/student/jobs')}
                    />
                    <NavItem
                        icon={FileText}
                        label="My Applications"
                        active={isActive('/student/applications')}
                        onClick={() => navigate('/student/applications')}
                    />
                    <NavItem
                        icon={Calendar}
                        label="Interviews"
                        active={isActive('/student/interviews')}
                        onClick={() => navigate('/student/interviews')}
                    />
                    <NavItem
                        icon={Settings}
                        label="Settings"
                        active={isActive('/student/settings')}
                        onClick={() => navigate('/student/settings')}
                    />
                </nav>

                <div className="p-4 space-y-1 mt-auto animate-fade-in delay-300">
                    <div
                        onClick={toggleTheme}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:scale-[1.02] active:scale-95"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        <span className="font-medium text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </div>

                    <NavItem icon={CircleHelp} label="Help Center" />

                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-[1.02] active:scale-95 mt-4 group">
                        <LogOut className="w-4 h-4 text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300" />
                        <span className="font-bold text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto w-full relative">
                <Outlet />
            </main>
        </div>
    );
};

// Helper Components
const UserQuickView = () => {
    const { user } = useMockData();
    return (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-6 flex items-center gap-3 border border-slate-200 dark:border-slate-800 animate-fade-in delay-100 hover:scale-[1.02] transition-transform duration-300">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/20">
                {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div>
                <p className="text-sm font-bold truncate max-w-[120px] text-slate-900 dark:text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{user?.major || 'Student'}</p>
            </div>
        </div>
    )
}

const NavItem = ({ icon: Icon, label, active, badge, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center justify-between px-4 py-3 mx-2 rounded-lg cursor-pointer transition-all duration-200 group relative overflow-hidden
        ${active
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 scale-[1.02]'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:scale-[1.02]'
            } active:scale-95`}
    >
        <div className="flex items-center gap-3 relative z-10">
            <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 duration-300 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
            <span className={`font-medium text-sm ${active ? 'font-bold' : ''}`}>{label}</span>
        </div>
        {badge && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
                {badge}
            </span>
        )}
    </div>
);

export default DashboardLayout;
