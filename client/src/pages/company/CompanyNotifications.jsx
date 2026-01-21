
import React, { useState, useEffect } from 'react';
import {
    Bell,
    Check,
    CheckCheck,
    Info,
    AlertTriangle,
    XCircle,
    User,
    Calendar,
    Briefcase
} from 'lucide-react';
import api from '../../api/axios';

// Since we haven't created a specific API file for notifications yet,
// we'll implement the calls locally or creating a new api file would be cleaner.
// For now, let's assume we can use the axios instance from authApi if exported, or just raw axios with token.

const CompanyNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await api.get('/notifications');
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            // Update local state
            setNotifications(prev => prev.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put(`/notifications/read-all`);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const getIcon = (type, onModel) => {
        if (onModel === 'Application') return <User size={20} className="text-blue-600" />;
        if (onModel === 'Interview') return <Calendar size={20} className="text-purple-600" />;
        if (onModel === 'Job') return <Briefcase size={20} className="text-green-600" />;

        // Fallback based on type
        switch (type) {
            case 'success': return <Check size={20} className="text-green-600" />;
            case 'warning': return <AlertTriangle size={20} className="text-yellow-600" />;
            case 'error': return <XCircle size={20} className="text-red-600" />;
            default: return <Info size={20} className="text-blue-600" />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric', // Fixed: 'minute' instead of 'min'
            hour12: true
        }).format(date);
    };

    return (
        <div className="max-w-4xl mx-auto pb-12 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                        Notifications
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {unreadCount} new
                            </span>
                        )}
                    </h1>
                    <p className="text-foreground-muted mt-1">Stay updated with your latest activities.</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                        <CheckCheck size={16} />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-foreground-muted">
                        Loading notifications...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-foreground-muted">
                        <Bell size={48} className="mb-4 opacity-20" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-5 flex gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-background-muted/50 ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                            >
                                <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-border 
                                    ${!notification.read ? 'bg-white dark:bg-card shadow-sm' : 'bg-gray-100 dark:bg-background-muted'}`}>
                                    {getIcon(notification.type, notification.onModel)}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className={`text-sm ${!notification.read ? 'font-semibold text-foreground' : 'text-foreground'}`}>
                                            {notification.message}
                                        </p>
                                        <span className="text-xs text-foreground-muted whitespace-nowrap">
                                            {formatDate(notification.createdAt)}
                                        </span>
                                    </div>
                                    {!notification.read && (
                                        <button
                                            onClick={() => markAsRead(notification._id)}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            Mark as read
                                        </button>
                                    )}
                                </div>

                                {!notification.read && (
                                    <div className="mt-2 text-blue-500">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyNotifications;
