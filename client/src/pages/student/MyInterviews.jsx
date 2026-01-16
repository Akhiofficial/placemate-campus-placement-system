import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, Clock, MapPin, Video, MoreVertical, ExternalLink } from "lucide-react";

const interviews = [
    {
        id: 1,
        role: "Junior Developer",
        company: "Tech Corp Inc.",
        logo: "T",
        logoBg: "bg-slate-900",
        date: "24",
        month: "OCT",
        time: "10:00 AM",
        duration: "45 mins",
        type: "Virtual Meeting (Zoom)",
        status: "Scheduled",
        statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
        round: "Technical Round",
        link: "#"
    },
    {
        id: 2,
        role: "UX Designer",
        company: "Creative Studio Agency",
        logo: "C",
        logoBg: "bg-purple-600",
        date: "26",
        month: "OCT",
        time: "02:30 PM",
        duration: "60 mins",
        type: "Building A, Room 404",
        isInPerson: true,
        status: "Round 2",
        statusColor: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
        round: "Design Critique"
    },
    {
        id: 3,
        role: "Data Scientist",
        company: "DataFlow Analytics",
        logo: "D",
        logoBg: "bg-green-600",
        date: "28",
        month: "OCT",
        time: "11:15 AM",
        duration: "30 mins",
        type: "Google Meet",
        status: "HR Round",
        statusColor: "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
        round: "Culture Fit",
        link: "#"
    }
];

const MyInterviews = () => {
    const [activeTab, setActiveTab] = useState("Upcoming");
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <main className="flex-1 px-6 py-6 md:px-10 md:py-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">My Interviews</h1>
                        <p className="text-foreground-muted mt-1">Manage and track your scheduled interviews and feedback.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-2 rounded-xl border border-border shadow-sm">
                        <div className="text-center px-4 border-r border-border">
                            <span className="block text-xl font-bold text-blue-600">3</span>
                            <span className="text-[10px] font-bold text-foreground-muted tracking-wider uppercase">Upcoming</span>
                        </div>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
                        <input
                            type="text"
                            placeholder="Search company or role..."
                            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition text-foreground"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="px-4 py-2.5 bg-card border border-border rounded-xl text-foreground hover:bg-background-muted transition flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto">
                        <Filter size={18} />
                    </button>
                    <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto">
                        <Calendar size={18} />
                        <span className="whitespace-nowrap">Sync Calendar</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-border">
                    {["Upcoming", "Completed", "Cancelled"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-medium transition relative ${activeTab === tab ? "text-blue-600" : "text-foreground-muted hover:text-foreground"}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Interview List */}
                <div className="space-y-4">
                    {activeTab === "Upcoming" && interviews.map((interview, index) => (
                        <motion.div
                            key={interview.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm"
                        >
                            <div className="flex flex-col md:flex-row gap-4 md:items-center w-full">
                                {/* Top/Left Section: Date + Info */}
                                <div className="flex gap-4 w-full md:flex-1 items-start">
                                    {/* Date Block */}
                                    <div className="shrink-0 flex flex-col items-center justify-center bg-background-muted rounded-xl w-16 h-16 md:w-20 md:h-20 border border-border">
                                        <span className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-wider">{interview.month}</span>
                                        <span className="text-xl md:text-3xl font-bold text-foreground">{interview.date}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex gap-3 items-start">
                                            {/* Logo */}
                                            <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-white font-bold text-sm ${interview.logoBg}`}>
                                                {interview.logo}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="text-base md:text-lg font-bold text-foreground truncate">{interview.role}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap ${interview.statusColor}`}>
                                                        {interview.status}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-foreground-muted text-xs md:text-sm mt-0.5">
                                                    <span className="font-medium text-foreground truncate">{interview.company}</span>
                                                    <span>•</span>
                                                    <span className="whitespace-nowrap">{interview.round}</span>
                                                </div>

                                                {/* Mobile Time Display (Moved here for better clustering) */}
                                                <div className="flex items-center gap-3 mt-2 text-xs text-foreground-muted md:hidden">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {interview.time}
                                                    </span>
                                                    <span className={`flex items-center gap-1 ${interview.isInPerson ? 'text-amber-600' : 'text-green-600'}`}>
                                                        {interview.isInPerson ? <MapPin size={12} /> : <Video size={12} />}
                                                        {interview.isInPerson ? "In-Person" : "Remote"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Desktop Details Row */}
                                        <div className="hidden md:flex flex-wrap items-center gap-4 mt-3 text-sm text-foreground-muted">
                                            <span className={`flex items-center gap-1.5 ${interview.isInPerson ? 'text-amber-600 font-medium' : 'text-green-600 font-medium'}`}>
                                                {interview.isInPerson ? <MapPin size={16} /> : <Video size={16} />}
                                                {interview.type}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={16} />
                                                {interview.duration}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-row gap-3 w-full md:w-auto mt-2 md:mt-0 items-center">
                                    {interview.link ? (
                                        <a
                                            href={interview.link}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-sm text-sm"
                                        >
                                            <Video size={16} />
                                            Join
                                        </a>
                                    ) : (
                                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-background border border-border text-foreground rounded-xl font-medium hover:bg-background-muted transition text-sm">
                                            View Map
                                        </button>
                                    )}
                                    <button className="flex-1 md:flex-none px-4 py-2.5 bg-background border border-border text-foreground rounded-xl font-medium hover:bg-background-muted transition text-sm">
                                        Details
                                    </button>
                                </div>
                            </div>

                        </motion.div>
                    ))}

                    {activeTab !== "Upcoming" && (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-background-muted rounded-full flex items-center justify-center mx-auto mb-4 text-foreground-muted">
                                <Calendar size={24} />
                            </div>
                            <h3 className="text-foreground font-medium">No {activeTab.toLowerCase()} interviews</h3>
                            <p className="text-foreground-muted text-sm mt-1">Your past and cancelled interviews will appear here.</p>
                        </div>
                    )}
                </div>

                {/* Looking for more */}
                <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-background-muted/30">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center text-blue-600 mb-4">
                        <Briefcase size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Looking for more opportunities?</h3>
                    <button className="mt-4 text-blue-600 font-medium hover:underline text-sm flex items-center gap-1">
                        Browse new job openings <ExternalLink size={14} />
                    </button>
                </div>

            </div>
        </main >
    );
};

// Missing icon import needed for the bottom card
import { Briefcase } from "lucide-react";

export default MyInterviews;
