import React, { useState, useEffect } from 'react';
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
import { getCompanyProfile, updateCompanyProfile } from '../../api/companyApi';

const CompanyProfile = () => {
    const [isEditing, setIsEditing] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // File Upload Refs
    const coverInputRef = React.useRef(null);
    const logoInputRef = React.useRef(null);

    // Initial State
    const [profileData, setProfileData] = useState({
        name: "",
        tagline: "",
        location: "",
        website: "",
        about: "",
        industry: "",
        size: "",
        founded: "",
        headquarters: "",
        social: {
            linkedin: "",
            twitter: "",
            website: ""
        },
        values: [],
        logo: "",
        coverImage: "",
        logoFile: null,
        coverFile: null
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await getCompanyProfile();
            // Merge with default structure to avoid undefined errors
            setProfileData(prev => ({
                ...prev,
                ...data,
                social: { ...prev.social, ...data.social },
                logoFile: null, // Reset files on fetch
                coverFile: null
            }));
        } catch (err) {
            console.error("Failed to fetch profile", err);
            setError("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Handle nested social fields logic if needed, or flat fields
        if (name.startsWith('social.')) {
            const socialField = name.split('.')[1];
            setProfileData(prev => ({
                ...prev,
                social: { ...prev.social, [socialField]: value }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setProfileData(prev => ({
                ...prev,
                [type === 'logo' ? 'logo' : 'coverImage']: previewUrl, // Preview
                [type === 'logo' ? 'logoFile' : 'coverFile']: file   // Actual File
            }));
        }
    };

    const triggerFileInput = (type) => {
        if (type === 'logo') logoInputRef.current.click();
        else coverInputRef.current.click();
    };

    const handleSave = async () => {
        try {
            // Create FormData
            const formData = new FormData();

            // Append basic fields
            Object.keys(profileData).forEach(key => {
                if (key === 'social') {
                    formData.append('social[linkedin]', profileData.social.linkedin);
                    formData.append('social[twitter]', profileData.social.twitter);
                    formData.append('social[website]', profileData.social.website);
                } else if (key === 'values' || key === 'logoFile' || key === 'coverFile') {
                    // Skip these specific handling below or skip non-primitives
                } else {
                    formData.append(key, profileData[key]);
                }
            });

            // Append Files
            if (profileData.logoFile) formData.append('logo', profileData.logoFile);
            if (profileData.coverFile) formData.append('coverImage', profileData.coverFile);

            // Handle Values array (if complex, might need stringify or loop)
            // For now assuming we might not be editing values, or handle simplified
            // If values are needed: formData.append('values', JSON.stringify(profileData.values));

            await updateCompanyProfile(formData);
            setIsEditing(false);
            // Optional: Show success toast
            fetchProfile(); // Refresh to get server paths
        } catch (err) {
            console.error("Failed to save profile", err);
            alert("Failed to save profile");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        fetchProfile(); // Revert changes
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto pb-12">
            {/* Header Section */}
            <div className="mb-8">
                {/* Cover Image & Logo Container */}
                <div className="relative mb-20">
                    <input
                        type="file"
                        ref={coverInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'cover')}
                    />
                    <input
                        type="file"
                        ref={logoInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'logo')}
                    />

                    <div className="h-64 rounded-xl overflow-hidden relative group">
                        <img
                            src={profileData.coverImage ? (profileData.coverImage.startsWith('blob:') ? profileData.coverImage : `http://localhost:5000${profileData.coverImage}`) : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10 transition-colors"></div>

                        {isEditing && (
                            <button
                                onClick={() => triggerFileInput('cover')}
                                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg shadow-sm flex items-center gap-2 transition-all"
                            >
                                <Camera size={14} />
                                Change Cover
                            </button>
                        )}
                    </div>

                    {/* Logo Box (Absolute) */}
                    <div className="absolute -bottom-16 left-8 w-32 h-32 bg-white rounded-xl shadow-lg p-2 flex items-center justify-center shrink-0 z-10">
                        {/* Logo or Placeholder */}
                        {profileData.logo ? (
                            <img
                                src={profileData.logo.startsWith('blob:') ? profileData.logo : `http://localhost:5000${profileData.logo}`}
                                alt="Logo"
                                className="w-full h-full object-contain rounded-lg"
                            />
                        ) : (
                            <div className="text-amber-500">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 22H22L12 2Z" fill="currentColor" fillOpacity="0.2" />
                                    <path d="M12 6L4.5 21H19.5L12 6Z" fill="currentColor" />
                                    <circle cx="12" cy="14" r="2" fill="white" />
                                </svg>
                            </div>
                        )}

                        {isEditing && (
                            <button
                                onClick={() => triggerFileInput('logo')}
                                className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                            >
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
                                            className="w-full p-1 bg-transparent border-b border-dashed border-gray-300 focus:border-blue-500 focus:outline-none dark:text-foreground"
                                        >
                                            <option className="dark:bg-slate-800" value="">Select Size</option>
                                            <option className="dark:bg-slate-800">1 - 10 employees</option>
                                            <option className="dark:bg-slate-800">10 - 50 employees</option>
                                            <option className="dark:bg-slate-800">50 - 200 employees</option>
                                            <option className="dark:bg-slate-800">200 - 1,000 employees</option>
                                            <option className="dark:bg-slate-800">1,000 - 5,000 employees</option>
                                            <option className="dark:bg-slate-800">5,000+ employees</option>
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
                                            <input name="social.linkedin" onChange={handleChange} value={profileData.social.linkedin} className="text-sm border-b border-gray-300 w-full focus:outline-none" placeholder="LinkedIn URL" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Twitter size={16} className="text-sky-500" />
                                            <input name="social.twitter" onChange={handleChange} value={profileData.social.twitter} className="text-sm border-b border-gray-300 w-full focus:outline-none" placeholder="Twitter URL" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <LinkIcon size={16} className="text-gray-500" />
                                            <input name="social.website" onChange={handleChange} value={profileData.social.website} className="text-sm border-b border-gray-300 w-full focus:outline-none" placeholder="Website URL" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        {profileData.social.linkedin && (
                                            <a href={profileData.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 dark:bg-background-muted hover:bg-blue-50 dark:hover:bg-blue-900/20 text-foreground-muted hover:text-blue-600 rounded-lg transition-colors border border-border">
                                                <Linkedin size={18} />
                                            </a>
                                        )}
                                        {profileData.social.twitter && (
                                            <a href={profileData.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 dark:bg-background-muted hover:bg-sky-50 dark:hover:bg-sky-900/20 text-foreground-muted hover:text-sky-500 rounded-lg transition-colors border border-border">
                                                <Twitter size={18} />
                                            </a>
                                        )}
                                        {profileData.social.website && (
                                            <a href={profileData.social.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 dark:bg-background-muted hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground-muted hover:text-foreground rounded-lg transition-colors border border-border">
                                                <LinkIcon size={18} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;
