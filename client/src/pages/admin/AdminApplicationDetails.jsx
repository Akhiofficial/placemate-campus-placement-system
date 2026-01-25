import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Linkedin, Link as LinkIcon, Download, Calendar, Building, CheckCircle, XCircle, Clock, Briefcase, User, GraduationCap } from 'lucide-react';
import { getApplicationDetails, updateApplicationStatus } from '../../api/adminApi';

const AdminApplicationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Status Update Modal State
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [interviewDate, setInterviewDate] = useState('');

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const res = await getApplicationDetails(id);
            setData(res);
            if (res?.application) {
                setNewStatus(res.application.status);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateClick = () => {
        setIsStatusModalOpen(true);
    };

    const handleConfirmUpdate = async () => {
        try {
            setUpdating(true);
            await updateApplicationStatus(id, newStatus, interviewDate);
            setData(prev => ({
                ...prev,
                application: {
                    ...prev.application,
                    status: newStatus,
                    interviewDate: newStatus === 'Interview' ? interviewDate : prev.application.interviewDate
                }
            }));
            setIsStatusModalOpen(false);
        } catch (error) {
            alert('Failed to update status');
            console.error(error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!data) return <div className="text-center mt-20 text-muted-foreground">Application details not found</div>;

    const { application, profile } = data;
    const { student, job } = application;

    // Helper to get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Applied': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Shortlisted': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Interview': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Offer': return 'bg-green-100 text-green-700 border-green-200';
            case 'Hired': return 'bg-green-100 text-green-700 border-green-200'; // Make Hired distinct?
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header / Nav */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft size={20} /> Back to Applications
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={handleUpdateClick}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <CheckCircle size={18} /> Update Status
                    </button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-8">
                <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-32 h-32 rounded-2xl bg-accent overflow-hidden border-2 border-border shrink-0">
                        <img
                            src={profile?.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'Student')}&background=random`}
                            alt={student?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground mb-2">{student?.name}</h1>
                                <p className="text-lg text-muted-foreground">{profile?.degree || 'Student'} in {profile?.department || 'N/A'}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(application.status)}`}>
                                {application.status}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6 text-muted-foreground">
                            {student?.email && (
                                <a href={`mailto:${student.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <Mail size={18} /> {student.email}
                                </a>
                            )}
                            {profile?.universityRollNo && (
                                <div className="flex items-center gap-2">
                                    <User size={18} /> {profile.universityRollNo}
                                </div>
                            )}
                            {profile?.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={18} /> {profile.phone}
                                </div>
                            )}
                            {profile?.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} /> {profile.location}
                                </div>
                            )}
                            {profile?.portfolioUrl && (
                                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <LinkIcon size={18} /> Portfolio
                                </a>
                            )}
                            {profile?.linkedinUrl && (
                                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <Linkedin size={18} /> LinkedIn
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Academic & Skills */}
                <div className="space-y-8">
                    {/* Job Applied For */}
                    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-foreground">
                            <Briefcase size={20} className="text-primary" /> Application for
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Company</p>
                                <p className="font-semibold text-foreground">{job?.company || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Role</p>
                                <p className="font-semibold text-foreground">{job?.title || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Location</p>
                                <p className="font-medium text-foreground">{job?.location || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Applied Date</p>
                                <p className="font-medium text-foreground">{new Date(application.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Academic Summary */}
                    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-foreground">
                            <GraduationCap size={20} className="text-blue-500" /> Academic Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-y-6">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">CGPA</p>
                                <p className="text-2xl font-bold text-blue-600">{profile?.cgpa || 'N/A'} <span className="text-sm text-muted-foreground font-normal">/ 10</span></p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Graduation Year</p>
                                <p className="text-xl font-semibold text-foreground">{profile?.graduationYear || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Branch</p>
                                <p className="font-medium text-foreground">{profile?.department || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Backlogs</p>
                                <p className={`font-medium ${profile?.backlogs > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                    {profile?.backlogs > 0 ? profile.backlogs : 'NONE'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-foreground">
                            <CheckCircle size={20} className="text-purple-500" /> Skills Analysis
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {profile?.skills && profile.skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-accent text-accent-foreground rounded-lg text-sm font-medium border border-border">
                                    {skill}
                                </span>
                            ))}
                            {(!profile?.skills || profile.skills.length === 0) && <span className="text-muted-foreground italic">No skills listed</span>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Experience, Projects, Resume */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Experience & Projects */}
                    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-foreground">
                            <Building size={20} className="text-orange-500" /> Experience & Projects
                        </h3>

                        <div className="space-y-8">
                            {/* Experience Section */}
                            {profile?.experience && profile.experience.length > 0 ? (
                                <div className="space-y-6">
                                    {profile.experience.map((exp, i) => (
                                        <div key={i} className="relative pl-6 border-l-2 border-border">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-foreground">{exp.title}</h4>
                                                <span className="text-xs font-semibold bg-accent px-2 py-1 rounded text-muted-foreground">
                                                    {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} -
                                                    {exp.current ? ' Present' : new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-blue-600 mb-2">{exp.company}</p>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">No experience added yet.</p>
                            )}

                            <hr className="border-border" />

                            {/* Projects Section */}
                            {profile?.projects && profile.projects.length > 0 ? (
                                <div className="space-y-6">
                                    {profile.projects.map((proj, i) => (
                                        <div key={i} className="relative pl-6 border-l-2 border-border">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-100 border-2 border-purple-500"></div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-foreground">{proj.title}</h4>
                                                <span className="text-xs font-semibold bg-accent px-2 py-1 rounded text-muted-foreground">
                                                    {proj.startDate && new Date(proj.startDate).getFullYear()}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-purple-600 mb-2">Academic Project</p>
                                            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{proj.description}</p>
                                            {proj.link && (
                                                <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                    <LinkIcon size={12} /> View Project
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">No projects added yet.</p>
                            )}

                        </div>
                    </div>

                    {/* Resume Preview */}
                    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                                <Clock size={20} className="text-gray-500" /> Resume Preview
                            </h3>
                            {profile?.resumeUrl && (
                                <a href={profile.resumeUrl} download className="flex items-center gap-2 px-3 py-1.5 bg-accent text-foreground rounded-lg text-sm font-medium hover:bg-accent/80 transition-colors">
                                    <Download size={16} /> Download PDF
                                </a>
                            )}
                        </div>

                        <div className="bg-muted/30 rounded-xl min-h-[500px] flex items-center justify-center border border-dashed border-border overflow-hidden">
                            {profile?.resumeUrl ? (
                                <iframe
                                    src={profile.resumeUrl.startsWith('http') ? profile.resumeUrl : `http://localhost:5000${profile.resumeUrl}`}
                                    className="w-full h-[500px]"
                                    title="Resume Preview"
                                >
                                </iframe>
                            ) : (
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-card rounded-xl shadow-sm mx-auto mb-4 flex items-center justify-center border border-border">
                                        <XCircle className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h4 className="font-semibold text-foreground mb-1">No Resume Uploaded</h4>
                                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-4">
                                        The candidate has not uploaded a resume yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Status Update Modal */}
            {isStatusModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border">
                        <div className="p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground">Update Application Status</h2>
                            <p className="text-sm text-muted-foreground mt-1">Change status for {student?.name}</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">New Status</label>
                                <select
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="Shortlisted">Shortlisted</option>
                                    <option value="Interview">Interview</option>
                                    <option value="Offer">Placed (Offer)</option>
                                    <option value="Hired">Hired</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>

                            {newStatus === 'Interview' && (
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Interview Date</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={interviewDate}
                                        onChange={(e) => setInterviewDate(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Optional: Schedule interview now</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/20 rounded-b-xl">
                            <button
                                onClick={() => setIsStatusModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmUpdate}
                                disabled={updating}
                                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {updating ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminApplicationDetails;
