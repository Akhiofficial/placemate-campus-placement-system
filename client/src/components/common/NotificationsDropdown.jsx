import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

const NotificationsDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await api.get('/notifications');
            // Backend returns { notifications: [], unreadCount: number }
            if (res.data && Array.isArray(res.data.notifications)) {
                setNotifications(res.data.notifications);
                setUnreadCount(res.data.unreadCount || 0);
            } else if (Array.isArray(res.data)) {
                // Fallback if backend changes
                setNotifications(res.data);
                setUnreadCount(res.data.filter(n => !n.read).length);
            } else {
                setNotifications([]);
                setUnreadCount(0);
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch on mount and when opening
    useEffect(() => {
        fetchNotifications();
        // Optional: Poll every 30s
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIconColor = (type) => {
        switch (type) {
            case 'success': return 'text-green-500 bg-green-50 dark:bg-green-900/10';
            case 'warning': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/10';
            case 'error': return 'text-red-500 bg-red-50 dark:bg-red-900/10';
            default: return 'text-blue-500 bg-blue-50 dark:bg-blue-900/10';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-full bg-card border border-border text-foreground-muted hover:bg-background-muted transition cursor-pointer"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-card"></span>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 md:w-96 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-border flex justify-between items-center">
                            <h3 className="font-semibold text-foreground">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-foreground-muted text-sm">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-foreground-muted text-sm">
                                    <Bell size={24} className="mx-auto mb-2 opacity-50" />
                                    No notifications yet
                                </div>
                            ) : (
                                <div className="divide-y divide-border/50">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification._id}
                                            className={`p-4 hover:bg-background-muted/50 transition-colors flex gap-3 ${!notification.read ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''}`}
                                        >
                                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getIconColor(notification.type)}`}>
                                                <Bell size={14} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-foreground leading-snug mb-1">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-foreground-muted">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="shrink-0 text-blue-600 hover:bg-blue-50 p-1 rounded-full h-fit"
                                                    title="Mark as read"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationsDropdown;
