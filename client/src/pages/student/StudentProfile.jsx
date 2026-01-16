import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Github, Linkedin, Download, FileText, Edit } from "lucide-react";

const StudentProfile = () => {
    return (
        <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 px-6 py-6 md:px-10 md:py-8"
        >
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Profile Header Card */}
                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden relative">
                    {/* Banner */}
                    <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-600"></div>

                    <div className="px-6 pb-6 mt-12 md:mt-0 flex flex-col md:flex-row md:items-end gap-6 relative">
                        {/* Profile Image (Overlapping) */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 md:-top-10">
                            <div className="w-32 h-32 rounded-full border-4 border-card bg-white shadow-md overflow-hidden">
                                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-4xl text-blue-600 font-bold">
                                    A
                                </div>
                                {/* <img src="..." alt="Profile" className="w-full h-full object-cover" /> */}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 mt-20 md:mt-4 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">Alex Johnson</h1>
                                    <p className="text-foreground-muted font-medium">Final Year Computer Science Student</p>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-foreground-muted">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin size={16} /> San Francisco, CA
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Mail size={16} /> alex.j@university.edu
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Phone size={16} /> +1 (555) 000-0000
                                        </span>
                                    </div>
                                </div>

                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm cursor-pointer">
                                    <Edit size={16} />
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: About, Skills, Experience */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* About Section */}
                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">About Me</h2>
                            <p className="text-foreground-muted leading-relaxed">
                                Passionate Computer Science student with a strong foundation in full-stack development.
                                Experienced in building scalable web applications using React, Node.js, and MongoDB.
                                Always eager to learn new technologies and apply them to solve real-world problems.
                                Looking for opportunities to kickstart my career as a Software Engineer.
                            </p>
                        </div>

                        {/* Experience / Projects */}
                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Featured Projects</h2>
                            <div className="space-y-6">
                                {/* Project 1 */}
                                <div className="pb-6 border-b border-border last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-foreground">E-Commerce Platform</h3>
                                            <p className="text-sm text-foreground-muted">Full Stack Developer · 2023</p>
                                        </div>
                                        <a href="#" className="text-blue-600 hover:underline text-sm">View Project</a>
                                    </div>
                                    <p className="text-sm text-foreground-muted mt-2">
                                        Developed a fully functional e-commerce site with cart management, user authentication, and payment gateway integration using MERN stack.
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 text-xs font-medium">React</span>
                                        <span className="px-2.5 py-1 rounded-md bg-green-50 dark:bg-green-500/10 text-green-600 text-xs font-medium">Node.js</span>
                                    </div>
                                </div>

                                {/* Project 2 */}
                                <div className="pb-6 border-b border-border last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-foreground">Task Management App</h3>
                                            <p className="text-sm text-foreground-muted">Frontend Lead · 2023</p>
                                        </div>
                                        <a href="#" className="text-blue-600 hover:underline text-sm">View Project</a>
                                    </div>
                                    <p className="text-sm text-foreground-muted mt-2">
                                        Built a Trello-style drag-and-drop task manager. Implemented real-time updates using Socket.io and collaborative features.
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 text-xs font-medium">Vue.js</span>
                                        <span className="px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-500/10 text-purple-600 text-xs font-medium">Firebase</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    "JavaScript", "React", "Node.js", "Python", "SQL", "MongoDB",
                                    "Git", "Docker", "AWS", "Tailwind CSS", "TypeScript"
                                ].map(skill => (
                                    <span key={skill} className="px-3 py-1.5 rounded-lg bg-background-muted text-foreground font-medium text-sm border border-border">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Academic Details, Resume, Socials */}
                    <div className="space-y-6">

                        {/* Academic Stats */}
                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Academic Basics</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-border">
                                    <span className="text-foreground-muted">CGPA</span>
                                    <span className="font-bold text-foreground">3.8 / 4.0</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border">
                                    <span className="text-foreground-muted">Course</span>
                                    <span className="font-medium text-foreground text-right">B.Tech - CSE</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border">
                                    <span className="text-foreground-muted">Year</span>
                                    <span className="font-medium text-foreground">2024 (Final Year)</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-foreground-muted">University</span>
                                    <span className="font-medium text-foreground text-right">Tech State Univ</span>
                                </div>
                            </div>
                        </div>


                        {/* Resume */}
                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Resume</h2>
                            <div className="p-4 rounded-xl border-2 border-dashed border-border flex items-center gap-4 bg-background-muted/50 cursor-pointer hover:border-blue-500 transition group">
                                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-500/10 text-red-600 flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium text-foreground truncate group-hover:text-blue-600 transition">Alex_Johnson_Resume.pdf</p>
                                    <p className="text-xs text-foreground-muted">Last updated 2 days ago</p>
                                </div>
                                <Download size={18} className="text-foreground-muted hover:text-foreground" />
                            </div>
                        </div>

                        {/* Social Profiles */}
                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Social Profiles</h2>
                            <div className="space-y-3">
                                <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-muted transition border border-transparent hover:border-border">
                                    <Github size={20} className="text-foreground" />
                                    <span className="text-sm font-medium text-foreground">github.com/alexj</span>
                                </a>
                                <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-muted transition border border-transparent hover:border-border">
                                    <Linkedin size={20} className="text-blue-600" />
                                    <span className="text-sm font-medium text-foreground">linkedin.com/in/alexj</span>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </motion.main>
    );
};

export default StudentProfile;
