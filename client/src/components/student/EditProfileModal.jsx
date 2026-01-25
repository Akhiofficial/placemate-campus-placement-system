import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, User, Book, Briefcase, Link as LinkIcon, MapPin, Phone, Mail } from "lucide-react";
import api from "../../api/axios";

const EditProfileModal = ({ isOpen, onClose, profile, onProfileUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [countryCode, setCountryCode] = useState("+91");
    const [formData, setFormData] = useState({
        // Personal
        phone: "",
        location: "",
        permanentAddress: "",
        gender: "",
        dateOfBirth: "",
        bio: "",

        // Academic
        department: "",
        major: "",
        currentSemester: "",
        cgpa: "",
        graduationYear: "",
        universityRollNo: "",

        // Professional/Skills
        skills: "",
        linkedinUrl: "",
        portfolioUrl: "",
        resumeUrl: "",

        // Experience & Projects
        experience: [],
        projects: []
    });

    useEffect(() => {
        if (profile) {
            // Parse Phone Number
            let initialPhone = profile.phone || "";
            let initialCode = "+91";

            // Check for known country codes
            if (initialPhone.startsWith("+91")) {
                initialCode = "+91";
                initialPhone = initialPhone.slice(3);
            } else if (initialPhone.startsWith("+1")) {
                initialCode = "+1";
                initialPhone = initialPhone.slice(2);
            } else if (initialPhone.startsWith("+44")) {
                initialCode = "+44";
                initialPhone = initialPhone.slice(3);
            }

            // Clean up to just digits and limit to 10
            initialPhone = initialPhone.replace(/\D/g, '').slice(0, 10);

            setCountryCode(initialCode);

            setFormData({
                phone: initialPhone,
                location: profile.location || "",
                permanentAddress: profile.permanentAddress || "",
                gender: profile.gender || "",
                dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : "",
                bio: profile.bio || "",

                department: profile.department || "",
                major: profile.major || "",
                currentSemester: profile.currentSemester || "",
                cgpa: profile.cgpa || "",
                graduationYear: profile.graduationYear || "",
                universityRollNo: profile.universityRollNo || "",

                skills: profile.skills ? profile.skills.join(", ") : "",
                linkedinUrl: profile.linkedinUrl || "",
                portfolioUrl: profile.portfolioUrl || "",
                resumeUrl: profile.resumeUrl || "",

                experience: profile.experience || [],
                projects: profile.projects || []
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhoneChange = (e) => {
        // Allow only number
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
            setFormData(prev => ({ ...prev, phone: value }));
        }
    };

    // Dynamic Fields Handlers
    const handleArrayChange = (index, field, value, type) => {
        setFormData(prev => {
            const updated = [...prev[type]];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, [type]: updated };
        });
    };

    const addEntry = (type) => {
        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], type === 'experience'
                ? { title: '', company: '', startDate: '', endDate: '', current: false, description: '' }
                : { title: '', description: '', link: '', startDate: '' }]
        }));
    };

    const removeEntry = (index, type) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Validate phone
            if (formData.phone && formData.phone.length !== 10) {
                alert("Please enter a valid 10-digit phone number");
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                phone: formData.phone ? `${countryCode}${formData.phone}` : ""
            };

            const { data } = await api.put("/student/profile", payload);
            onProfileUpdate(data);
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            // alert("Failed to update profile"); // Optional
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-xl overflow-hidden flex flex-col border border-border"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border bg-card">
                        <h2 className="text-xl font-bold text-foreground">Edit Profile</h2>
                        <button onClick={onClose} className="p-2 hover:bg-background-muted rounded-full transition text-foreground-muted hover:text-foreground">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar */}
                        <div className="w-64 bg-background-muted/30 border-r border-border p-4 space-y-2 hidden md:block">
                            <button
                                onClick={() => setActiveTab("personal")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "personal" ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10" : "text-foreground-muted hover:text-foreground hover:bg-background-muted"}`}
                            >
                                <User size={18} /> Personal Details
                            </button>
                            <button
                                onClick={() => setActiveTab("academic")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "academic" ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10" : "text-foreground-muted hover:text-foreground hover:bg-background-muted"}`}
                            >
                                <Book size={18} /> Academic info
                            </button>
                            <button
                                onClick={() => setActiveTab("professional")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "professional" ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10" : "text-foreground-muted hover:text-foreground hover:bg-background-muted"}`}
                            >
                                <Briefcase size={18} /> Professional
                            </button>
                            <button
                                onClick={() => setActiveTab("portfolio")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${activeTab === "portfolio" ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10" : "text-foreground-muted hover:text-foreground hover:bg-background-muted"}`}
                            >
                                <Briefcase size={18} /> Exp & Projects
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">

                                {activeTab === "personal" && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">Phone Number</label>
                                                <div className="flex gap-2">
                                                    <select
                                                        className="w-24 px-2 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition text-sm"
                                                        value={countryCode}
                                                        onChange={(e) => setCountryCode(e.target.value)}
                                                    >
                                                        <option value="+91">+91 (IN)</option>
                                                        <option value="+1">+1 (US)</option>
                                                        <option value="+44">+44 (UK)</option>
                                                    </select>
                                                    <div className="relative flex-1">
                                                        <Phone className="absolute left-3 top-2.5 text-foreground-muted" size={16} />
                                                        <input
                                                            type="text"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handlePhoneChange}
                                                            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                                            placeholder="9999999999"
                                                            maxLength={10}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">Location</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-2.5 text-foreground-muted" size={16} />
                                                    <input
                                                        type="text"
                                                        name="location"
                                                        value={formData.location}
                                                        onChange={handleChange}
                                                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                                        placeholder="City, Country"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Bio</label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                rows="4"
                                                className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none"
                                                placeholder="Tell us a bit about yourself..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === "academic" && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">Department</label>
                                                <input
                                                    type="text"
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                                    placeholder="e.g. Computer Science"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">Major / Course</label>
                                                <input
                                                    type="text"
                                                    name="major"
                                                    value={formData.major}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                                    placeholder="e.g. B.Tech"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">Current Semester</label>
                                                <input
                                                    type="text"
                                                    name="currentSemester"
                                                    value={formData.currentSemester}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                                    placeholder="e.g. 6"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">CGPA</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    name="cgpa"
                                                    value={formData.cgpa}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">Graduation Year</label>
                                                <input
                                                    type="number"
                                                    name="graduationYear"
                                                    value={formData.graduationYear}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                                    placeholder="2024"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">University Roll No</label>
                                                <input
                                                    type="text"
                                                    name="universityRollNo"
                                                    value={formData.universityRollNo}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                                    placeholder="Roll No"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "professional" && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Skills</label>
                                            <p className="text-xs text-foreground-muted">Separate skills with commas</p>
                                            <textarea
                                                name="skills"
                                                value={formData.skills}
                                                onChange={handleChange}
                                                rows="3"
                                                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none"
                                                placeholder="React, Node.js, Python..."
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">LinkedIn URL</label>
                                                <input
                                                    type="url"
                                                    name="linkedinUrl"
                                                    value={formData.linkedinUrl}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                                    placeholder="https://linkedin.com/in/..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-foreground">Portfolio URL</label>
                                                <input
                                                    type="url"
                                                    name="portfolioUrl"
                                                    value={formData.portfolioUrl}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                                                    placeholder="https://myportfolio.com"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "portfolio" && (
                                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">

                                        {/* Experience Section */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-lg text-foreground">Experience</h3>
                                                <button type="button" onClick={() => addEntry('experience')} className="text-sm text-blue-600 font-medium hover:underline">+ Add Experience</button>
                                            </div>
                                            {formData.experience.map((exp, index) => (
                                                <div key={index} className="p-4 border border-border rounded-lg space-y-3 relative bg-gray-50 dark:bg-card/50 hover:border-blue-500/50 transition">
                                                    <button type="button" onClick={() => removeEntry(index, 'experience')} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                                                        <X size={16} />
                                                    </button>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <input type="text" placeholder="Title" value={exp.title} onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'experience')} className="w-full px-3 py-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleArrayChange(index, 'company', e.target.value, 'experience')} className="w-full px-3 py-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input type="date" placeholder="Start Date" value={exp.startDate ? exp.startDate.split('T')[0] : ''} onChange={(e) => handleArrayChange(index, 'startDate', e.target.value, 'experience')} className="w-full px-3 py-2 border border-border rounded bg-background text-foreground [scheme:dark] placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" />
                                                        <input type="date" placeholder="End Date" value={exp.endDate ? exp.endDate.split('T')[0] : ''} onChange={(e) => handleArrayChange(index, 'endDate', e.target.value, 'experience')} className="w-full px-3 py-2 border border-border rounded bg-background text-foreground [scheme:dark] placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" />
                                                    </div>
                                                    <textarea placeholder="Description" rows="2" value={exp.description} onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'experience')} className="w-full px-3 py-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none" />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Projects Section */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-lg text-foreground">Projects</h3>
                                                <button type="button" onClick={() => addEntry('projects')} className="text-sm text-blue-600 font-medium hover:underline">+ Add Project</button>
                                            </div>
                                            {formData.projects.map((proj, index) => (
                                                <div key={index} className="p-4 border border-border rounded-lg space-y-3 relative bg-gray-50 dark:bg-card/50 hover:border-blue-500/50 transition">
                                                    <button type="button" onClick={() => removeEntry(index, 'projects')} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                                                        <X size={16} />
                                                    </button>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input type="text" placeholder="Project Title" value={proj.title} onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'projects')} className="w-full px-3 py-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" />
                                                        <input type="url" placeholder="Project Link" value={proj.link} onChange={(e) => handleArrayChange(index, 'link', e.target.value, 'projects')} className="w-full px-3 py-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" />
                                                    </div>
                                                    <input type="date" placeholder="Start Date" value={proj.startDate ? proj.startDate.split('T')[0] : ''} onChange={(e) => handleArrayChange(index, 'startDate', e.target.value, 'projects')} className="w-full px-3 py-2 border border-border rounded bg-background text-foreground [scheme:dark] placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition" />
                                                    <textarea placeholder="Description" rows="2" value={proj.description} onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'projects')} className="w-full px-3 py-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition resize-none" />
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-border bg-card flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-border rounded-lg text-foreground font-medium hover:bg-background-muted transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditProfileModal;
