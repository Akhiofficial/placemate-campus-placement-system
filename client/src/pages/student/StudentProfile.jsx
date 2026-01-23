import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Github, Linkedin, Download, FileText, Edit, Globe, Loader2, Upload, Camera, Briefcase } from "lucide-react";
import api from "../../api/axios";
import EditProfileModal from "../../components/student/EditProfileModal";

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false); // For Resume
    const [imageUploading, setImageUploading] = useState(false); // For Images
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/student/profile');
            setProfile(data);
        } catch (err) {
            console.error("Error fetching profile:", err);
            // If 404, profile remains null
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert("Image size should be less than 5MB");
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/gif', 'image/jpg'].includes(file.type)) {
            alert("Only JPEG, PNG, and GIF images are allowed");
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', type);

        setImageUploading(true);
        try {
            const { data } = await api.post('/student/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update profile with new URL
            setProfile(prev => ({
                ...prev,
                [type === 'profile' ? 'profilePictureUrl' : 'coverImageUrl']: data.imageUrl
            }));

        } catch (error) {
            console.error("Image upload failed", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setImageUploading(false);
            e.target.value = null;
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (file.size > 5 * 1024 * 1024) { // 5MB
            alert("File size should be less than 5MB");
            return;
        }

        if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
            alert("Only PDF and DOC/DOCX files are allowed");
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        setUploading(true);
        try {
            const { data } = await api.post('/student/resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Update profile with new resume URL
            setProfile(prev => ({
                ...prev,
                resumeUrl: data.resumeUrl
            }));

        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload resume. Please try again.");
        } finally {
            setUploading(false);
            // Reset input value to allow re-uploading same file if needed
            e.target.value = null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const user = profile?.user || {};
    const displayName = user.name || "Student";
    const displayEmail = user.email || "No email";

    // Construct subtitle/headline
    const getSubtitle = () => {
        if (profile?.currentSemester && profile?.major) {
            return `${profile.currentSemester} Sem ${profile.major} Student`;
        }
        if (profile?.major) return `${profile.major} Student`;
        return "Student";
    };

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
                    <div className="h-48 relative bg-gray-100 group">
                        {/* Banner Image or Gradient */}
                        {profile?.coverImageUrl ? (
                            <img src={profile.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-linear-to-r from-blue-600 to-indigo-600"></div>
                        )}

                        {/* Edit Banner Button (Visible on Hover) */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <label className="cursor-pointer bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition flex items-center justify-center">
                                {imageUploading ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'cover')} disabled={imageUploading} />
                            </label>
                        </div>
                    </div>

                    <div className="px-6 pb-6 mt-12 md:mt-0 flex flex-col md:flex-row md:items-end gap-6 relative">
                        {/* Profile Image (Overlapping) */}
                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0 md:-top-16">
                            <div className="relative group w-32 h-32 rounded-full border-4 border-card bg-white shadow-md overflow-hidden">
                                {profile?.profilePictureUrl ? (
                                    <img src={profile.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-4xl text-blue-600 font-bold">
                                        {displayName.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                {/* Edit Avatar Overlay */}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                    {imageUploading ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} />}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'profile')} disabled={imageUploading} />
                                </label>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 mt-20 md:mt-4 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
                                    <p className="text-foreground-muted font-medium">{getSubtitle()}</p>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-foreground-muted">
                                        {profile?.location && (
                                            <span className="flex items-center gap-1.5">
                                                <MapPin size={16} /> {profile.location}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1.5">
                                            <Mail size={16} /> {displayEmail}
                                        </span>
                                        {profile?.phone && (
                                            <span className="flex items-center gap-1.5">
                                                <Phone size={16} /> {profile.phone}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm cursor-pointer"
                                >
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
                                {profile?.bio || "No bio added yet. Click 'Edit Profile' to add a bio."}
                            </p>
                        </div>

                        {/* Skills */}
                        {/* Skills */}
                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {profile?.skills && profile.skills.length > 0 ? (
                                    profile.skills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1.5 rounded-lg bg-background-muted text-foreground font-medium text-sm border border-border">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-sm text-foreground-muted">No skills added yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Experience Section */}
                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                                <Briefcase size={20} className="text-orange-600" /> Experience
                            </h2>
                            {profile?.experience && profile.experience.length > 0 ? (
                                <div className="space-y-6">
                                    {profile.experience.map((exp, i) => (
                                        <div key={i} className="relative pl-6 border-l-2 border-border">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-600 dark:bg-blue-900"></div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-foreground">{exp.title}</h4>
                                                <span className="text-xs font-semibold bg-background-muted px-2 py-1 rounded text-foreground-muted">
                                                    {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} -
                                                    {exp.current ? ' Present' : new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-blue-600 mb-2">{exp.company}</p>
                                            <p className="text-sm text-foreground-muted leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-foreground-muted italic">No experience added yet.</p>
                            )}
                        </div>

                        {/* Projects Section */}
                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                                <FileText size={20} className="text-purple-600" /> Projects
                            </h2>
                            {profile?.projects && profile.projects.length > 0 ? (
                                <div className="space-y-6">
                                    {profile.projects.map((proj, i) => (
                                        <div key={i} className="relative pl-6 border-l-2 border-border">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-100 border-2 border-purple-600 dark:bg-purple-900"></div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-foreground">{proj.title}</h4>
                                                <span className="text-xs font-semibold bg-background-muted px-2 py-1 rounded text-foreground-muted">
                                                    {proj.startDate && new Date(proj.startDate).getFullYear()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-foreground-muted leading-relaxed mb-3">{proj.description}</p>
                                            {proj.link && (
                                                <a href={proj.link} target="_blank" rel="noopener" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                    <Globe size={12} /> View Project
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-foreground-muted italic">No projects added yet.</p>
                            )}
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
                                    <span className="font-bold text-foreground">{profile?.cgpa || "N/A"}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border">
                                    <span className="text-foreground-muted">Course/Major</span>
                                    <span className="font-medium text-foreground text-right">{profile?.major || "N/A"}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-border">
                                    <span className="text-foreground-muted">Graduation Year</span>
                                    <span className="font-medium text-foreground">{profile?.graduationYear || "N/A"}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-foreground-muted">Department</span>
                                    <span className="font-medium text-foreground text-right">{profile?.department || "N/A"}</span>
                                </div>
                            </div>
                        </div>


                        {/* Resume - Interactive Upload */}
                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Resume</h2>

                            <div className="relative group">
                                <div className={`p-6 rounded-xl border-dashed border-2 flex flex-col items-center justify-center text-center transition ${profile?.resumeUrl ? "border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800" : "border-border bg-background-muted/30 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/10"}`}>

                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-full mb-3 flex items-center justify-center bg-background shadow-xs">
                                        {uploading ? (
                                            <Loader2 className="animate-spin text-blue-600" size={24} />
                                        ) : (
                                            <FileText className="text-blue-600" size={24} />
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div className="space-y-1">
                                        {profile?.resumeUrl ? (
                                            <>
                                                <p className="font-medium text-foreground">Resume Uploaded</p>
                                                <div className="flex items-center justify-center gap-3 pt-1">
                                                    <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-foreground-muted hover:text-blue-600 transition underline underline-offset-2 relative z-20">
                                                        View
                                                    </a>
                                                    <span className="text-border">|</span>
                                                    <span className="text-xs font-medium text-blue-600 group-hover:underline cursor-pointer relative z-10">
                                                        Update Resume
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-medium text-foreground">Upload Resume</p>
                                                <p className="text-xs text-foreground-muted">PDF or DOC, Max 5MB</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Hidden Input - Covers container for easy click */}
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    title={profile?.resumeUrl ? "Click to update resume" : "Click to upload resume"}
                                />
                            </div>
                        </div>

                        {/* Social Profiles */}
                        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Social Profiles</h2>
                            <div className="space-y-3">
                                {profile?.githubUrl && ( // Note: Model doesn't have githubUrl explicitly, but User might have it? Model has portfolioUrl, linkedinUrl. I'll use those.
                                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-muted transition border border-transparent hover:border-border">
                                        <Github size={20} className="text-foreground" />
                                        <span className="text-sm font-medium text-foreground">GitHub</span>
                                    </a>
                                )}
                                {profile?.linkedinUrl && (
                                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-muted transition border border-transparent hover:border-border">
                                        <Linkedin size={20} className="text-blue-600" />
                                        <span className="text-sm font-medium text-foreground">LinkedIn</span>
                                    </a>
                                )}
                                {profile?.portfolioUrl && (
                                    <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-muted transition border border-transparent hover:border-border">
                                        <Globe size={20} className="text-green-600" />
                                        <span className="text-sm font-medium text-foreground">Portfolio</span>
                                    </a>
                                )}
                                {!profile?.linkedinUrl && !profile?.portfolioUrl && (
                                    <p className="text-sm text-foreground-muted">No social links added.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={profile}
                onProfileUpdate={(updatedProfile) => {
                    // Merge updated profile with existing user data to ensure user object persists if backend doesn't return it logic is:
                    // Backend returns profile. If populate is used in update, good.
                    // The updateProfile controller returns `res.json(profile)`.
                    // The updateProfile controller DOES NOT seem to populate user in response! 
                    // So we must manually preserve the user object from the old state.
                    setProfile(prev => ({
                        ...updatedProfile,
                        user: prev.user // wrapper to keep the user details
                    }));
                }}
            />
        </motion.main>
    );
};

export default StudentProfile;
