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
    DollarSign
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
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col h-screen items-center justify-center space-y-4">
                <p className="text-red-500 font-medium">{error || "Company not found"}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                    <ArrowLeft size={16} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="mb-8">
                {/* Back Button */}
                <div className="mb-4 pt-4 px-4 sm:px-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors"
                    >
                        <ArrowLeft size={18} />
                        <span>Back</span>
                    </button>
                </div>

                {/* Cover Image & Logo Container */}
                <div className="relative mb-20">
                    <div className="h-64 rounded-xl overflow-hidden relative shadow-sm">
                        <img
                            src={profile.coverImage ? `http://localhost:5000${profile.coverImage}` : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
                    </div>

                    {/* Logo Box (Absolute) */}
                    <div className="absolute -bottom-16 left-8 w-32 h-32 bg-white rounded-xl shadow-lg p-2 flex items-center justify-center shrink-0 z-10 border border-gray-100">
                        {profile.logo ? (
                            <img
                                src={`http://localhost:5000${profile.logo}`}
                                alt="Logo"
                                className="w-full h-full object-contain rounded-lg"
                            />
                        ) : (
                            <div className="text-amber-500 flex items-center justify-center w-full h-full bg-amber-50 rounded-lg">
                                <span className="text-4xl font-bold opacity-50">{profile.name?.charAt(0) || 'C'}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Header Info */}
                <div className="px-8 flex flex-col md:flex-row items-end justify-between gap-4 -mt-4 pl-4 md:pl-44">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-foreground mb-1">{profile.name}</h1>
                        {profile.tagline && (
                            <p className="text-lg text-foreground-muted font-medium mb-3">{profile.tagline}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
                            {profile.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={16} />
                                    <span>{profile.location}</span>
                                </div>
                            )}
                            {profile.website && (
                                <a
                                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                                >
                                    <Globe size={16} />
                                    <span>{profile.website}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-0">
                {/* Left Column (2/3) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About Us */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-foreground">About Us</h2>
                        </div>
                        <p className="text-foreground-muted leading-relaxed whitespace-pre-line">
                            {profile.about || "No description provided."}
                        </p>
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-8">
                    {/* Company Details */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-foreground">Company Details</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-foreground-muted tracking-wide uppercase mb-2">Industry</h4>
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                    <Building size={18} className="text-foreground-muted" />
                                    <span>{profile.industry || "Not specified"}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-foreground-muted tracking-wide uppercase mb-2">Company Size</h4>
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                    <Users size={18} className="text-foreground-muted" />
                                    <span>{profile.size || "Not specified"}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-foreground-muted tracking-wide uppercase mb-2">Founded</h4>
                                <div className="flex items-center gap-2 text-foreground font-medium">
                                    <Calendar size={18} className="text-foreground-muted" />
                                    <span>{profile.founded || "Not specified"}</span>
                                </div>
                            </div>

                            {profile.headquarters && (
                                <div>
                                    <h4 className="text-xs font-bold text-foreground-muted tracking-wide uppercase mb-2">Headquarters</h4>
                                    <div className="flex items-center gap-2 text-foreground font-medium">
                                        <MapPin size={18} className="text-foreground-muted" />
                                        <span>{profile.headquarters}</span>
                                    </div>
                                </div>
                            )}

                            {profile.social && (profile.social.linkedin || profile.social.twitter || profile.social.website) && (
                                <div className="pt-4 border-t border-border mt-2">
                                    <h4 className="text-xs font-bold text-foreground-muted tracking-wide uppercase mb-3">Social Media</h4>
                                    <div className="flex gap-3">
                                        {profile.social.linkedin && (
                                            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-background-muted hover:bg-blue-50 dark:hover:bg-blue-900/20 text-foreground-muted hover:text-blue-600 rounded-lg transition-colors border border-border">
                                                <Linkedin size={18} />
                                            </a>
                                        )}
                                        {profile.social.twitter && (
                                            <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-background-muted hover:bg-sky-50 dark:hover:bg-sky-900/20 text-foreground-muted hover:text-sky-500 rounded-lg transition-colors border border-border">
                                                <Twitter size={18} />
                                            </a>
                                        )}
                                        {profile.social.website && (
                                            <a href={profile.social.website} target="_blank" rel="noopener noreferrer" className="p-2 bg-background-muted hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground-muted hover:text-foreground rounded-lg transition-colors border border-border">
                                                <LinkIcon size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfileView;
