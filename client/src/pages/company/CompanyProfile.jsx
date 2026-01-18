import React, { useState } from 'react';
import {
    Camera,
    Edit,
    MapPin,
    Globe,
    Eye,
    Linkedin,
    Twitter,
    Link as LinkIcon,
    Building,
    Users,
    Calendar,
    Zap,
    Heart,
    Scale,
    TrendingUp,
    Plus,
    Save,
    X
} from 'lucide-react';

const CompanyProfile = () => {
    const [isEditing, setIsEditing] = useState(false);

    // Initial State (Mock Data)
    const [profileData, setProfileData] = useState({
        name: "Acme Corporation",
        tagline: "Innovating the future of enterprise software",
        location: "San Francisco, CA",
        website: "www.acmecorp.com",
        about: "Acme Corporation is a leading provider of innovative software solutions, dedicated to transforming the way businesses operate. Our mission is to empower organizations with cutting-edge technology that drives growth and efficiency.\n\nFounded in 2010 by a team of visionary engineers, we have grown from a small startup into a global enterprise with offices in 5 countries. We believe in the power of code to solve real-world problems. Our culture thrives on curiosity, collaboration, and a relentless pursuit of excellence. We are currently looking for passionate fresh graduates to join our engineering and product teams.",
        industry: "Technology / SaaS",
        size: "1,000 - 5,000 employees",
        founded: "2010",
        headquarters: "San Francisco, CA",
        social: {
            linkedin: "#",
            twitter: "#",
            website: "#"
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        console.log("Saving Profile Data:", profileData);
        setIsEditing(false);
        // Add API call logic here
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset logic if needed (or fetching from API again)
    };

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header Section */}
            <div className="mb-8">
                {/* Cover Image & Logo Container */}
                <div className="relative mb-20">
                    <div className="h-64 rounded-xl overflow-hidden relative group">
                        <img
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10 transition-colors"></div>

                        {isEditing && (
                            <button className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg shadow-sm flex items-center gap-2 transition-all">
                                <Camera size={14} />
                                Change Cover
                            </button>
                        )}
                    </div>

                    {/* Logo Box (Absolute) */}
                    <div className="absolute -bottom-16 left-8 w-32 h-32 bg-white rounded-xl shadow-lg p-2 flex items-center justify-center shrink-0 z-10">
                        {/* Placeholder Logo */}
                        <div className="text-amber-500">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 22H22L12 2Z" fill="currentColor" fillOpacity="0.2" />
                                <path d="M12 6L4.5 21H19.5L12 6Z" fill="currentColor" />
                                <circle cx="12" cy="14" r="2" fill="white" />
                            </svg>
                        </div>
                        {isEditing && (
                            <button className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                                <Camera size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Profile Header Info (Flow Content) */}
                <div className="px-8 flex flex-col md:flex-row items-end justify-between gap-4 -mt-4 pl-4 md:pl-44">
                    <div className="flex-1 w-full">
                        {isEditing ? (
                            <div className="space-y-3 max-w-2xl">
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleChange}
                                    className="text-3xl font-bold text-foreground bg-transparent border-b-2 border-dashed border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                                    placeholder="Company Name"
                                />
                                <input
                                    type="text"
                                    name="tagline"
                                    value={profileData.tagline}
                                    onChange={handleChange}
                                    className="text-lg text-foreground-muted font-medium bg-transparent border-b-2 border-dashed border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                                    placeholder="Company Tagline"
                                />
                                <div className="flex items-center gap-4 text-sm text-foreground-muted">
                                    <div className="flex items-center gap-1.5 flex-1">
                                        <MapPin size={16} />
                                        <input
                                            type="text"
                                            name="location"
                                            value={profileData.location}
                                            onChange={handleChange}
                                            className="bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5 flex-1">
                                        <Globe size={16} />
                                        <input
                                            type="text"
                                            name="website"
                                            value={profileData.website}
                                            onChange={handleChange}
                                            className="bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none"
                                            placeholder="www.example.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-foreground mb-1">{profileData.name}</h1>
                                <p className="text-lg text-foreground-muted font-medium mb-3">{profileData.tagline}</p>
                                <div className="flex items-center gap-4 text-sm text-foreground-muted">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={16} />
                                        <span>{profileData.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer">
                                        <Globe size={16} />
                                        <span>{profileData.website}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3 mb-1 shrink-0">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-semibold text-sm shadow-sm flex items-center gap-2 transition-all"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-sm flex items-center gap-2 transition-all"
                                >
                                    <Save size={16} />
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-background-muted text-foreground border border-border px-4 py-2 rounded-lg font-semibold text-sm shadow-sm flex items-center gap-2 transition-all">
                                    <Eye size={16} />
                                    View as Student
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-sm flex items-center gap-2 transition-all"
                                >
                                    <Edit size={16} />
                                    Edit Profile
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About Us */}
                    <div className="bg-white dark:bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-foreground">About Us</h2>
                        </div>
                        {isEditing ? (
                            <textarea
                                name="about"
                                value={profileData.about}
                                onChange={handleChange}
                                rows="6"
                                className="w-full p-4 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y"
                                placeholder="Tell candidates about your company's mission, vision, and culture..."
                            ></textarea>
                        ) : (
                            <p className="text-foreground-muted leading-relaxed whitespace-pre-line">
                                {profileData.about}
                            </p>
                        )}
                    </div>

                    {/* Values & Culture - (Simplified interaction for demo) */}
                    <div className="bg-white dark:bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-foreground">Values & Culture</h2>
                            {isEditing && (
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    <Plus size={16} />
                                    Add New
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Value Card 1 */}
                            <div className="bg-gray-50 dark:bg-background-muted p-4 rounded-lg border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-all group relative">
                                {isEditing && (
                                    <button className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 bg-white dark:bg-card rounded-full shadow-sm">
                                        <X size={12} />
                                    </button>
                                )}
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Zap size={20} />
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">Innovation First</h3>
                                {isEditing ? <input disabled placeholder="Description" className="w-full bg-transparent text-xs border-b border-dashed" value="We constantly push boundaries and explore new technologies." /> :
                                    <p className="text-xs text-foreground-muted">We constantly push boundaries and explore new technologies.</p>
                                }
                            </div>

                            {/* Value Card 2 */}
                            <div className="bg-gray-50 dark:bg-background-muted p-4 rounded-lg border border-transparent hover:border-green-100 dark:hover:border-green-900 transition-all group relative">
                                {isEditing && (
                                    <button className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 bg-white dark:bg-card rounded-full shadow-sm">
                                        <X size={12} />
                                    </button>
                                )}
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Heart size={20} />
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">Inclusivity</h3>
                                {isEditing ? <input disabled placeholder="Description" className="w-full bg-transparent text-xs border-b border-dashed" value="We build teams where everyone feels welcome and heard." /> :
                                    <p className="text-xs text-foreground-muted">We build teams where everyone feels welcome and heard.</p>
                                }
                            </div>

                            {/* Value Card 3 */}
                            <div className="bg-gray-50 dark:bg-background-muted p-4 rounded-lg border border-transparent hover:border-purple-100 dark:hover:border-purple-900 transition-all group relative">
                                {isEditing && (
                                    <button className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 bg-white dark:bg-card rounded-full shadow-sm">
                                        <X size={12} />
                                    </button>
                                )}
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Scale size={20} />
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">Work-Life Balance</h3>
                                {isEditing ? <input disabled placeholder="Description" className="w-full bg-transparent text-xs border-b border-dashed" value="Flexible hours and remote-first culture is our norm." /> :
                                    <p className="text-xs text-foreground-muted">Flexible hours and remote-first culture is our norm.</p>
                                }
                            </div>

                            {/* Value Card 4 */}
                            <div className="bg-gray-50 dark:bg-background-muted p-4 rounded-lg border border-transparent hover:border-amber-100 dark:hover:border-amber-900 transition-all group relative">
                                {isEditing && (
                                    <button className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 bg-white dark:bg-card rounded-full shadow-sm">
                                        <X size={12} />
                                    </button>
                                )}
                                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <TrendingUp size={20} />
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">Growth Mindset</h3>
                                {isEditing ? <input disabled placeholder="Description" className="w-full bg-transparent text-xs border-b border-dashed" value="Continuous learning opportunities for all employees." /> :
                                    <p className="text-xs text-foreground-muted">Continuous learning opportunities for all employees.</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-8">
                    {/* Company Details */}
                    <div className="bg-white dark:bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-foreground">Company Details</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-foreground-muted tracking-wide uppercase mb-2">Industry</h4>
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                    <Building size={18} className="text-foreground-muted" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="industry"
                                            value={profileData.industry}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none"
                                        />
                                    ) : (
                                        <span>{profileData.industry}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-foreground-muted tracking-wide uppercase mb-2">Company Size</h4>
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                    <Users size={18} className="text-foreground-muted" />
                                    {isEditing ? (
                                        <select
                                            name="size"
                                            value={profileData.size}
                                            onChange={handleChange}
                                            className="w-full p-1 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none"
                                        >
                                            <option>1 - 10 employees</option>
                                            <option>10 - 50 employees</option>
                                            <option>50 - 200 employees</option>
                                            <option>200 - 1,000 employees</option>
                                            <option>1,000 - 5,000 employees</option>
                                            <option>5,000+ employees</option>
                                        </select>
                                    ) : (
                                        <span>{profileData.size}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-foreground-muted tracking-wide uppercase mb-2">Founded</h4>
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                    <Calendar size={18} className="text-foreground-muted" />
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            name="founded"
                                            value={profileData.founded}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none"
                                        />
                                    ) : (
                                        <span>{profileData.founded}</span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-foreground-muted tracking-wide uppercase mb-2">Headquarters</h4>
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                    <MapPin size={18} className="text-foreground-muted" />
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="headquarters"
                                            value={profileData.headquarters}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none"
                                        />
                                    ) : (
                                        <span>{profileData.headquarters}</span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border mt-2">
                                <h4 className="text-xs font-bold text-foreground-muted tracking-wide uppercase mb-3">Social Media</h4>
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Linkedin size={16} className="text-blue-600" />
                                            <input className="text-sm border-b border-gray-300 w-full focus:outline-none" placeholder="LinkedIn URL" defaultValue="#" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Twitter size={16} className="text-sky-500" />
                                            <input className="text-sm border-b border-gray-300 w-full focus:outline-none" placeholder="Twitter URL" defaultValue="#" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <LinkIcon size={16} className="text-gray-500" />
                                            <input className="text-sm border-b border-gray-300 w-full focus:outline-none" placeholder="Website URL" defaultValue="#" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <a href="#" className="p-2 bg-gray-50 dark:bg-background-muted hover:bg-blue-50 dark:hover:bg-blue-900/20 text-foreground-muted hover:text-blue-600 rounded-lg transition-colors border border-border">
                                            <Linkedin size={18} />
                                        </a>
                                        <a href="#" className="p-2 bg-gray-50 dark:bg-background-muted hover:bg-sky-50 dark:hover:bg-sky-900/20 text-foreground-muted hover:text-sky-500 rounded-lg transition-colors border border-border">
                                            <Twitter size={18} />
                                        </a>
                                        <a href="#" className="p-2 bg-gray-50 dark:bg-background-muted hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground-muted hover:text-foreground rounded-lg transition-colors border border-border">
                                            <LinkIcon size={18} />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-lg font-bold mb-2">Profile Strength: Strong</h2>
                            <div className="w-full bg-black/20 rounded-full h-2 mb-4 backdrop-blur-sm">
                                <div className="bg-white rounded-full h-2 w-3/4 shadow-sm"></div>
                            </div>
                            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                                Complete your profile to attract 2x more applicants.
                            </p>
                            <button className="w-full bg-white text-blue-700 font-bold py-2.5 rounded-lg text-sm hover:bg-blue-50 transition-colors shadow-sm">
                                Complete Profile
                            </button>
                        </div>

                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;
