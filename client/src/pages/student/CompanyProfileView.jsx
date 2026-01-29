import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin,
    Globe,
    Linkedin,
    Twitter,
    Link as LinkIcon,
    Building,
    Users,
    Calendar,
    ArrowLeft,
    Share2,
    Mail
} from 'lucide-react';
import api from '../../api/axios';

const CompanyProfileView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/company/public/${id}`);
                setProfile(data);
            } catch (err) {
                console.error("Failed to fetch company profile", err);
                setError("Failed to load company profile.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col h-screen items-center justify-center space-y-4 bg-background">
                <p className="text-destructive font-medium text-lg">{error || "Company not found"}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-primary hover:underline font-medium"
                >
                    <ArrowLeft size={20} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12 animate-in fade-in duration-500">
            {/* Navigation Bar */}
            <div className="bg-card border-b border-border sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                        <ArrowLeft className='dark:text-foreground' size={18} />
                        <span className="dark:text-foreground">Back to Listings</span>
                    </button>
                    <div className="flex gap-2">
                        {/* Placeholder for future actions like 'Share' or 'Save' */}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

                {/* Hero Section */}
                <div className="relative mb-24">
                    {/* Cover Image */}
                    <div className="h-64 md:h-80 w-full rounded-2xl overflow-hidden relative shadow-md group">
                        <img
                            src={profile.coverImage ? `http://localhost:5000${profile.coverImage}` : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"}
                            alt="Cover"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-80"></div>
                    </div>

                    {/* Profile Header Card */}
                    <div className="absolute -bottom-16 left-0 right-0 px-4 md:px-10 flex">
                        <div className="flex flex-col md:flex-row items-end w-full gap-6">

                            {/* Logo */}
                            <div className="relative shrink-0">
                                <div className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-card rounded-2xl shadow-xl p-1.5 ring-4 ring-background">
                                    <div className="w-full h-full bg-white rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 flex items-center justify-center">
                                        {profile.logo ? (
                                            <img
                                                src={`http://localhost:5000${profile.logo}`}
                                                alt="Logo"
                                                className="w-full h-full object-contain p-2"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full bg-primary/10 text-primary">
                                                <span className="text-5xl font-bold">{profile.name?.charAt(0) || 'C'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="flex-1 pb-2 md:pb-1 text-foreground dark:text-foreground">
                                <div className="flex flex-col md:block">
                                    <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-foreground mb-1">{profile.name}</h1>
                                    {profile.tagline && (
                                        <p className="text-lg text-muted-foreground font-medium mb-3">{profile.tagline}</p>
                                    )}
                                </div>

                                <div className="hidden md:flex flex-wrap items-center gap-6 text-sm font-medium text-black hover:text-primary cursor-pointer dark:text-white">
                                    {profile.location && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={16} className="text-primary" />
                                            <span>{profile.location}</span>
                                        </div>
                                    )}
                                    {profile.website && (
                                        <a
                                            href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-black dark:text-white hover:text-primary transition-colors"
                                        >
                                            <Globe size={16} className="text-primary" />
                                            <span>Website</span>
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Actions (visible on desktop) */}
                            <div className="hidden md:flex gap-3 pb-4">
                                {profile.website && (
                                    <a
                                        href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-2.5 bg-primary dark:text-white text-primary-foreground hover:bg-primary/90 font-medium rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center gap-2"
                                    >
                                        Visit Website
                                        <LinkIcon size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Info Strip (visible on mobile only) */}
                <div className="md:hidden mt-20 mb-8 space-y-4 px-2">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {profile.location && (
                            <div className="flex items-center gap-1.5">
                                <MapPin size={16} className="text-primary" />
                                <span>{profile.location}</span>
                            </div>
                        )}
                        {profile.website && (
                            <a
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5  hover:text-primary transition-colors"
                            >
                                <Globe size={16} className="text-primary" />
                                <span>{profile.website}</span>
                            </a>
                        )}
                    </div>
                </div>


                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (Content) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About Section */}
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                    <Building size={24} />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">About Us</h2>
                            </div>
                            <div className="prose prose-gray text-foreground dark:prose-invert max-w-none">
                                <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                                    {profile.about || "No description provided."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="space-y-6">
                        {/* Company Stats */}
                        <div className="bg-card border text-foreground border-border rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-foreground mb-6">Company Overview</h3>

                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                                        <Building size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Industry</p>
                                        <p className="font-medium text-foreground">{profile.industry || "Not specified"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg shrink-0">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Company Size</p>
                                        <p className="font-medium text-foreground">{profile.size || "Not specified"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg shrink-0">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Founded</p>
                                        <p className="font-medium text-foreground">{profile.founded || "Not specified"}</p>
                                    </div>
                                </div>

                                {profile.headquarters && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg shrink-0">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Headquarters</p>
                                            <p className="font-medium hover:text-foreground">{profile.headquarters}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {profile.social && (profile.social.linkedin || profile.social.twitter || profile.social.website) && (
                                <div className="mt-8 pt-6 border-t border-border">
                                    <h4 className="text-sm font-semibold text-foreground mb-4">Connect with us</h4>
                                    <div className="flex gap-3">
                                        {profile.social.linkedin && (
                                            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-background hover:bg-blue-50 dark:hover:bg-blue-900/20 text-muted-foreground hover:text-blue-600 border border-border rounded-xl transition-all hover:scale-105 shadow-sm">
                                                <Linkedin size={20} />
                                            </a>
                                        )}
                                        {profile.social.twitter && (
                                            <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-background hover:bg-sky-50 dark:hover:bg-sky-900/20 text-muted-foreground hover:text-sky-500 border border-border rounded-xl transition-all hover:scale-105 shadow-sm">
                                                <Twitter size={20} />
                                            </a>
                                        )}
                                        {profile.social.website && (
                                            <a href={profile.social.website} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-background hover:bg-gray-50 dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground border border-border rounded-xl transition-all hover:scale-105 shadow-sm">
                                                <Globe size={20} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Contact Card (Optional addition for fullness) */}
                        <div className="bg-linear-to-br text-foreground from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Mail size={20} className="text-primary" />
                                <h3 className="font-bold text-foreground">Get in Touch</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Interested in opportunities at {profile.name}? Check out our open positions or follow us for updates.
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfileView;
