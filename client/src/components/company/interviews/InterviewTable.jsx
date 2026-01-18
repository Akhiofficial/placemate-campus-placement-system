import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, MoreVertical, Calendar, Edit, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';

const interviews = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        role: 'Software Engineer',
        dept: 'Engineering Dept',
        date: 'Oct 24, 2023',
        time: '10:00 AM - 11:00 AM',
        platform: 'Google Meet',
        status: 'Confirmed'
    },
    {
        id: 2,
        name: 'Sarah Smith',
        email: 'sarah.s@example.com',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        role: 'Data Analyst',
        dept: 'Product Team',
        date: 'Oct 24, 2023',
        time: '11:30 AM - 12:15 PM',
        platform: 'Zoom',
        status: 'Pending'
    },
    {
        id: 3,
        name: 'Michael Chen',
        email: 'm.chen@example.com',
        image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        role: 'UX Designer',
        dept: 'Design Team',
        date: 'Oct 25, 2023',
        time: '09:00 AM - 10:00 AM',
        platform: 'Teams',
        status: 'Confirmed'
    },
    {
        id: 4,
        name: 'Emily Davis',
        email: 'emily.d@example.com',
        image: 'https://ui-avatars.com/api/?name=Emily+Davis&background=EBF4FF&color=7F9CF5',
        role: 'Product Manager',
        dept: 'Product Team',
        date: 'Oct 25, 2023',
        time: '02:00 PM - 03:00 PM',
        platform: 'Google Meet',
        status: 'Rescheduled'
    },
    {
        id: 5,
        name: 'Robert Wilson',
        email: 'robert.w@example.com',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        role: 'DevOps Engineer',
        dept: 'Infrastructure',
        date: 'Oct 20, 2023',
        time: '10:00 AM - 11:00 AM',
        platform: 'Teams',
        status: 'Completed'
    }
];



// ... (existing imports and candidates array)

const InterviewTable = ({ activeTab, searchQuery, roleFilter, statusFilter }) => {
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

    const handleDelete = (id) => {
        console.log("Delete interview", id);
        setOpenMenuId(null);
    };

    const handleStatusUpdate = (id, newStatus) => {
        console.log(`Update interview ${id} status to ${newStatus}`);
        // In a real app, you would update the state or call an API here
        setOpenMenuId(null);
        setMenuView('main');
    };

    const filteredInterviews = interviews.filter(interview => {
        // Tab Filtering
        let tabMatch = true;
        if (activeTab === 'Upcoming') {
            tabMatch = ['Confirmed', 'Pending', 'Rescheduled'].includes(interview.status);
        } else if (activeTab === 'Past Interviews') {
            tabMatch = ['Completed', 'Cancelled', 'Rejected'].includes(interview.status);
        }

        // Search Filtering
        const searchLower = searchQuery.toLowerCase();
        const searchMatch =
            interview.name.toLowerCase().includes(searchLower) ||
            interview.role.toLowerCase().includes(searchLower);

        // Role Filtering
        const roleMatch = roleFilter === 'All Roles' || interview.role === roleFilter;

        // Status Filtering
        const statusMatch = statusFilter === 'All Statuses' || interview.status === statusFilter;

        return tabMatch && searchMatch && roleMatch && statusMatch;
    });

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
        // Determine icon color/style based on platform name if needed, generic video for now
        return <Video size={16} className="text-blue-500" />;
    }

    return (
        <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="overflow-x-auto">
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
                        {filteredInterviews.map((interview) => (
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination (Simple for now) */}
            <div className="p-4 border-t border-border flex flex-col md:flex-row gap-4 justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="text-center md:text-left">Showing {filteredInterviews.length} results</span>
                <div className="flex gap-2 w-full md:w-auto justify-center md:justify-end">
                    <button className="px-3 py-1 border border-border rounded hover:bg-gray-50 dark:hover:bg-background-muted transition-colors disabled:opacity-50">Previous</button>
                    <button className="px-3 py-1 border border-border rounded hover:bg-gray-50 dark:hover:bg-background-muted transition-colors">Next</button>
                </div>
            </div>
        </div>
    );
};

export default InterviewTable;
