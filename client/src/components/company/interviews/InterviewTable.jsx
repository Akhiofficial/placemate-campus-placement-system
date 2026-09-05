import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MoreVertical, Calendar, Edit, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';
import { updateInterviewStatus, deleteInterview } from '../../../api/companyApi';

// ... (imports)

const InterviewTable = ({ interviews = [], loading, onRefresh }) => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [menuView, setMenuView] = useState('main'); // 'main' or 'status'
    const menuRef = useRef(null);

    const navigate = useNavigate();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
                setMenuView('main');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = (id) => {
        if (openMenuId === id) {
            setOpenMenuId(null);
        } else {
            setOpenMenuId(id);
            setMenuView('main');
        }
    };

    const handleEdit = (id) => {
        navigate(`/company/interviews/edit/${id}`);
        setOpenMenuId(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this interview?")) return;

        try {
            await deleteInterview(id);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Failed to delete interview:", error);
            alert("Failed to delete interview");
        }
        setOpenMenuId(null);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateInterviewStatus(id, newStatus);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status");
        }
        setOpenMenuId(null);
        setMenuView('main');
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400';
            case 'Pending': return 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400';
            case 'Rescheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
            case 'Completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPlatformIcon = (platform) => {
        return <Video size={16} className="text-blue-500" />;
    }

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading interviews...</div>;
    }

    return (
        <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm mb-6">
            <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white dark:bg-card border-b border-border text-xs uppercase text-gray-400 dark:text-gray-500 font-bold tracking-wider">
                            <th className="p-4 pl-6">Candidate</th>
                            <th className="p-4">Role Applied</th>
                            <th className="p-4">Date & Time</th>
                            <th className="p-4">Platform</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-border">
                        {interviews.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                    No interviews found.
                                </td>
                            </tr>
                        ) : (
                            interviews.map((interview) => (
                                <tr key={interview.id} className="hover:bg-gray-50/80 dark:hover:bg-background-muted transition-colors group bg-white dark:bg-card">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <img src={interview.image} alt={interview.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-border shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-foreground text-sm">{interview.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-foreground-muted">{interview.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-foreground text-sm">{interview.role}</h4>
                                            <p className="text-xs text-gray-500 dark:text-foreground-muted">{interview.dept}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-foreground text-sm">{interview.date}</h4>
                                            <p className="text-xs text-gray-500 dark:text-foreground-muted">{interview.time}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                                                {getPlatformIcon(interview.platform)}
                                            </div>
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{interview.platform}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(interview.status)}`}>
                                            {interview.status}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2 relative">
                                            {interview.meetingLink && ['Scheduled', 'Confirmed', 'Rescheduled'].includes(interview.status) && (
                                                <a
                                                    href={interview.meetingLink.startsWith('http') || interview.meetingLink.startsWith('/') ? interview.meetingLink : `/interview/${interview.meetingLink}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                                                    title="Join Interview"
                                                >
                                                    <Video size={14} />
                                                    Join
                                                </a>
                                            )}
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleMenu(interview.id);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-background-muted"
                                                >
                                                    <MoreVertical size={20} />
                                                </button>

                                                {openMenuId === interview.id && (
                                                    <div
                                                        ref={menuRef}
                                                        className="absolute right-0 mt-1 w-48 bg-white dark:bg-card border border-border rounded-lg shadow-lg z-20 py-1 animate-in fade-in zoom-in-95 duration-100"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {menuView === 'main' ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleEdit(interview.id)}
                                                                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-background-muted flex items-center gap-2 transition-colors"
                                                                >
                                                                    <Edit size={14} />
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => setMenuView('status')}
                                                                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-background-muted flex items-center gap-2 transition-colors"
                                                                >
                                                                    <RefreshCw size={14} />
                                                                    Change Status
                                                                </button>
                                                                <div className="h-px bg-border my-1"></div>
                                                                <button
                                                                    onClick={() => handleDelete(interview.id)}
                                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors"
                                                                >
                                                                    <Trash2 size={14} />
                                                                    Delete
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="px-4 py-2 text-xs font-semibold text-foreground-muted uppercase tracking-wider border-b border-border mb-1">
                                                                    Select Status
                                                                </div>
                                                                {['Confirmed', 'Pending', 'Rescheduled', 'Completed', 'Cancelled'].map((status) => (
                                                                    <button
                                                                        key={status}
                                                                        onClick={() => handleStatusUpdate(interview.id, status)}
                                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-background-muted flex items-center justify-between transition-colors ${interview.status === status ? 'text-blue-600 font-medium' : 'text-foreground'}`}
                                                                    >
                                                                        {status}
                                                                        {interview.status === status && <CheckCircle2 size={14} />}
                                                                    </button>
                                                                ))}
                                                                <div className="h-px bg-border my-1"></div>
                                                                <button
                                                                    onClick={() => setMenuView('main')}
                                                                    className="w-full text-left px-4 py-2 text-xs text-foreground-muted hover:text-foreground hover:bg-gray-50 dark:hover:bg-background-muted transition-colors"
                                                                >
                                                                    &larr; Back
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )))}
                    </tbody>
                </table>
            </div>

            {/* Pagination (Simple for now) */}
            <div className="p-4 border-t border-border flex flex-col md:flex-row gap-4 justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="text-center md:text-left">Showing {interviews.length} results</span>
                <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end">
                    <button className="px-3 py-1 border border-border rounded hover:bg-gray-50 dark:hover:bg-background-muted transition-colors disabled:opacity-50">Previous</button>
                    <button className="px-3 py-1 border border-border rounded hover:bg-gray-50 dark:hover:bg-background-muted transition-colors">Next</button>
                </div>
            </div>
        </div>
    );
};

export default InterviewTable;
