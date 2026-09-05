
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Linkedin, Link as LinkIcon, Download, Calendar, Building, CheckCircle, XCircle, Clock, Briefcase } from 'lucide-react';
import { getApplicantDetails, updateApplicationStatus, scheduleInterview } from '../../api/companyApi';


import { getFileUrl } from '../../utils/fileHelper';

const ApplicantProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const res = await getApplicantDetails(id);
            setData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
        try {
            setUpdating(true);
            await updateApplicationStatus(id, newStatus);
            setData(prev => ({ ...prev, application: { ...prev.application, status: newStatus } }));
        } catch (error) {
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;
    if (!data) return <div className="text-center mt-20">Applicant not found</div>;

    const { application, profile, aiAnalysis } = data;
    const { student, job } = application;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header / Nav */}
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={20} /> Back to Applications
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleStatusUpdate('Rejected')}
                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium flex items-center gap-2 transition-colors"
                    >
                        <XCircle size={18} /> Reject
                    </button>
                    {/* Only show specific buttons based on current status could be better, but listing common actions for now */}
                    <button
                        onClick={() => navigate('/company/interviews/schedule')} // Ideally pre-fill modal
                        className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center gap-2 transition-colors"
                    >
                        <Calendar size={18} /> Schedule Interview
                    </button>
                    <button
                        onClick={() => handleStatusUpdate('Shortlisted')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <CheckCircle size={18} /> Shortlist
                    </button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-8">
                <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
                    <img
                        src={profile.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`}
                        alt={student.name}
                        className="w-32 h-32 rounded-2xl object-cover shadow-sm border border-gray-100"
                    />
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{student.name}</h1>
                                <p className="text-lg text-gray-600 dark:text-gray-300">{profile.degree || 'Student'} in {profile.department || 'N/A'}</p>
                            </div>
                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold border border-green-100">
                                Top Talent
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6 text-gray-500 dark:text-gray-400">
                            <a href={`mailto:${student.email}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                <Mail size={18} /> {student.email}
                            </a>
                            {profile.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={18} /> {profile.phone}
                                </div>
                            )}
                            {profile.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin size={18} /> {profile.location}
                                </div>
                            )}
                            {profile.portfolioUrl && (
                                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                                    <LinkIcon size={18} /> Portfolio
                                </a>
                            )}
                            {profile.linkedinUrl && (
                                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
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
                    {/* Academic Summary */}
                    <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-border p-6">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Building size={20} className="text-blue-600" /> Academic Summary
                        </h3>
                        <div className="grid grid-cols-2 gap-y-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">CGPA</p>
                                <p className="text-2xl font-bold text-blue-600">{profile.cgpa || 'N/A'} <span className="text-sm text-gray-400 font-normal">/ 10</span></p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Graduation Year</p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white">{profile.graduationYear || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Branch</p>
                                <p className="font-medium text-gray-900 dark:text-white">{profile.department || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Backlogs</p>
                                <p className={`font-medium ${profile.backlogs > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                    {profile.backlogs > 0 ? profile.backlogs : 'NONE'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-border p-6">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <CheckCircle size={20} className="text-purple-600" /> Skills Analysis
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {profile.skills && profile.skills.map((skill, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Experience, Projects, Resume */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Experience & Projects */}
                    <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-border p-6">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Briefcase size={20} className="text-orange-600" /> Experience & Projects
                        </h3>

                        <div className="space-y-8">
                            {/* Experience Section */}
                            {profile.experience && profile.experience.length > 0 ? (
                                <div className="space-y-6">
                                    {profile.experience.map((exp, i) => (
                                        <div key={i} className="relative pl-6 border-l-2 border-gray-100">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-600"></div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white">{exp.title}</h4>
                                                <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600">
                                                    {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })} -
                                                    {exp.current ? ' Present' : new Date(exp.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-blue-600 mb-2">{exp.company}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No experience added yet.</p>
                            )}

                            <hr className="border-gray-100" />

                            {/* Projects Section */}
                            {profile.projects && profile.projects.length > 0 ? (
                                <div className="space-y-6">
                                    {profile.projects.map((proj, i) => (
                                        <div key={i} className="relative pl-6 border-l-2 border-gray-100">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-100 border-2 border-purple-600"></div>
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-900 dark:text-white">{proj.title}</h4>
                                                <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600">
                                                    {proj.startDate && new Date(proj.startDate).getFullYear()}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-purple-600 mb-2">Academic Project</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{proj.description}</p>
                                            {proj.link && (
                                                <a href={proj.link} target="_blank" rel="noopener" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                                    <LinkIcon size={12} /> View Project
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No projects added yet.</p>
                            )}

                        </div>
                    </div>

                    {/* Resume Preview */}
                    <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-border p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Clock size={20} className="text-gray-600" /> Resume Preview
                            </h3>
                            {profile.resumeUrl && (
                                <a href={getFileUrl(profile.resumeUrl)} target="_blank" rel="noopener noreferrer" download className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                                    <Download size={16} /> Download PDF
                                </a>
                            )}
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl min-h-[500px] flex items-center justify-center border border-dashed border-gray-200 overflow-hidden">
                            {profile.resumeUrl ? (
                                <iframe
                                    src={getFileUrl(profile.resumeUrl)}
                                    className="w-full h-[500px]"
                                    title="Resume Preview"
                                >
                                </iframe>
                            ) : (
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-white rounded-xl shadow-sm mx-auto mb-4 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 mb-1">No Resume Uploaded</h4>
                                    <p className="text-sm text-gray-500 max-w-xs mx-auto mb-4">
                                        The candidate has not uploaded a resume yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ApplicantProfile;
