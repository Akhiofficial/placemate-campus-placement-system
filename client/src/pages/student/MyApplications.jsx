import { motion } from "framer-motion";
import { Search, Filter, ChevronDown, Send, Star, Calendar, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Stats Data
const stats = [
    { label: "Total Applied", value: "12", icon: Send, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { label: "Shortlisted", value: "3", icon: Star, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
    { label: "Interviews", value: "2", icon: Calendar, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-500/10" },
    { label: "Offers", value: "1", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 dark:bg-green-500/10" },
];

// Applications Data
const applications = [
    {
        id: "#APP-2938",
        role: "Software Engineer Intern",
        company: "TechFlow Systems",
        logo: "T",
        logoBg: "bg-indigo-100 text-indigo-600",
        date: "Oct 24, 2023",
        status: "Shortlisted",
        statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
        action: "View Details"
    },
    {
        id: "#APP-2845",
        role: "Data Analyst",
        company: "FinServe Ltd.",
        logo: "F",
        logoBg: "bg-emerald-100 text-emerald-600",
        date: "Oct 20, 2023",
        status: "Applied",
        statusColor: "bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300 border-slate-200 dark:border-slate-600",
        action: "View Details"
    },
    {
        id: "#APP-2511",
        role: "Product Designer",
        company: "StartUp Hub",
        logo: "S",
        logoBg: "bg-rose-100 text-rose-600",
        date: "Oct 15, 2023",
        status: "Rejected",
        statusColor: "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20",
        action: "View Details"
    },
    {
        id: "#APP-1992",
        role: "Junior Network Engineer",
        company: "Global Networks",
        logo: "G",
        logoBg: "bg-blue-100 text-blue-600",
        date: "Sept 30, 2023",
        status: "Placed",
        statusColor: "bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20",
        action: "View Offer"
    },
    {
        id: "#APP-1854",
        role: "Business Analyst Intern",
        company: "Alpha Analytics",
        logo: "A",
        logoBg: "bg-purple-100 text-purple-600",
        date: "Sept 15, 2023",
        status: "Shortlisted",
        statusColor: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
        action: "View Details"
    },
];

const MyApplications = () => {
    return (
        <main className="flex-1 px-6 py-6 md:px-10 md:py-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-foreground-muted mb-1">
                            <Link to="/student/dashboard" className="hover:text-blue-600 transition">Home</Link>
                            <span>/</span>
                            <span className="text-foreground font-medium">My Applications</span>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
                        <p className="text-foreground-muted mt-1">Track the status of your job applications and interviews.</p>
                    </div>
                    <Link to="/student/jobs" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm flex items-center gap-2 self-start md:self-auto uppercase text-xs tracking-wide">
                        <Send size={16} />
                        Browse Jobs
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-card border border-border rounded-xl p-5 shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-foreground-muted text-sm font-medium flex items-center gap-2">
                                        {/* Icon can go here for extra flare */}
                                        {stat.label}
                                    </h3>
                                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                                </div>
                                <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Filters Bar */}
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search by company or role..."
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition text-foreground"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground flex items-center gap-2 hover:bg-background-muted transition min-w-[140px] justify-between group cursor-pointer">
                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-foreground-muted" />
                                <span>All Statuses</span>
                            </div>
                            <ChevronDown size={14} className="text-foreground-muted group-hover:text-foreground transition" />
                        </button>

                        <button className="px-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground flex items-center gap-2 hover:bg-background-muted transition min-w-[140px] justify-between group cursor-pointer">
                            <div className="flex items-center gap-2 text-foreground-muted">
                                <span className="text-foreground">Newest First</span>
                            </div>
                            <ChevronDown size={14} className="text-foreground-muted group-hover:text-foreground transition" />
                        </button>
                    </div>
                </div>

                {/* Applications List */}
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 px-6 py-4 bg-background-muted border-b border-border text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                        <div className="col-span-5 md:col-span-4">Company & Role</div>
                        <div className="col-span-3 md:col-span-3 hidden md:block">Date Applied</div>
                        <div className="col-span-4 md:col-span-3 text-center md:text-left">Status</div>
                        <div className="col-span-3 md:col-span-2 text-right">Action</div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-border">
                        {applications.map((app, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="grid grid-cols-12 px-6 py-5 items-center hover:bg-background-muted/50 transition"
                            >
                                {/* Company info */}
                                <div className="col-span-5 md:col-span-4 flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${app.logoBg}`}>
                                        {app.logo}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground text-sm">{app.company}</h4>
                                        <p className="text-xs text-foreground-muted mt-0.5">{app.role}</p>
                                        <p className="text-xs text-foreground-muted mt-0.5 md:hidden">ID: {app.id}</p>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="col-span-3 md:col-span-3 hidden md:block">
                                    <p className="text-sm text-foreground font-medium">{app.date}</p>
                                    <p className="text-xs text-foreground-muted mt-0.5">ID: {app.id}</p>
                                </div>

                                {/* Status */}
                                <div className="col-span-4 md:col-span-3 flex justify-center md:justify-start">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${app.statusColor} flex items-center gap-1.5`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${app.status === 'Applied' ? 'bg-slate-400' : app.status === 'Rejected' ? 'bg-red-500' : 'bg-current'}`}></span>
                                        {app.status}
                                    </span>
                                </div>

                                {/* Action */}
                                <div className="col-span-3 md:col-span-2 text-right">
                                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-end gap-1 opacity-80 hover:opacity-100 transition">
                                        <span className="hidden sm:inline">{app.action}</span>
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                        <p className="text-sm text-foreground-muted">
                            Showing <span className="font-medium text-foreground">1</span> to <span className="font-medium text-foreground">5</span> of <span className="font-medium text-foreground">12</span> applications
                        </p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 border border-border rounded-lg text-sm text-foreground opacity-50 cursor-not-allowed">Previous</button>
                            <button className="px-3 py-1.5 border border-border rounded-lg text-sm text-foreground hover:bg-background-muted transition">Next</button>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default MyApplications;
