import React, { useState, useEffect } from 'react';
import {
    Check,
    X,
    Clock,
    UserCheck,
    Building2,
    Search,
    Filter,
    Download
} from 'lucide-react';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';

const SuperAdminRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all

    const [stats, setStats] = useState({
        totalAdmins: 0,
        pendingRequests: 0,
        activeInstitutions: 0
    });

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            // Fetch requests based on filter or fetching all and filtering frontend
            // Using the endpoints available:
            // GET /api/admin/admin-requests (Pending)
            // GET /api/admin/admin-requests/all (All)

            const endpoint = filter === 'pending'
                ? '/admin/admin-requests'
                : '/admin/admin-requests/all';

            // Parallel fetch for data and stats
            const [dataRes, statsRes] = await Promise.all([
                axios.get(endpoint),
                axios.get('/admin/super-admin-stats')
            ]);

            setRequests(dataRes.data);

            // Update stats from backend
            setStats({
                totalAdmins: statsRes.data.totalAdmins,
                pendingRequests: statsRes.data.pendingRequests,
                activeInstitutions: statsRes.data.activeInstitutions
            });

            setLoading(false);
        } catch (err) {
            console.error("Error fetching requests:", err);
            toast.error("Failed to load requests");
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`/admin/admin-requests/${id}/approve`);
            toast.success("Request approved successfully");
            fetchRequests();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || "Failed to approve request");
        }
    };

    const handleReject = async (id) => {
        // Simple reject for now, could add modal for reason
        if (!window.confirm("Are you sure you want to reject this request?")) return;

        try {
            await axios.put(`/admin/admin-requests/${id}/reject`, { reason: 'Admin Rejected' });
            toast.success("Request rejected");
            fetchRequests();
        } catch (err) {
            console.error(err);
            toast.error("Failed to reject request");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Access Requests</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Verify and manage registration requests from Training & Placement Officers.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-card px-3 py-2 rounded-lg border border-border">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-sm font-medium">Super Admin</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 p-0.5">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=SuperAdmin" alt="Super Admin" className="rounded-full bg-white dark:bg-card" />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Admins</p>
                        <h3 className="text-2xl font-bold text-foreground">{stats.totalAdmins}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-card p-6 rounded-xl border-l-4 border-l-yellow-400 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Pending Requests</p>
                        <h3 className="text-2xl font-bold text-foreground">{stats.pendingRequests}</h3>
                    </div>
                </div>
                <div className="bg-white dark:bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Active Institutions</p>
                        <h3 className="text-2xl font-bold text-foreground">{stats.activeInstitutions}</h3>
                    </div>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search requests, institutions..."
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-card border border-border rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex bg-white dark:bg-card rounded-lg border border-border p-1">
                        {['pending', 'all'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${filter === f ? 'bg-gray-100 dark:bg-gray-800 text-foreground' : 'text-gray-500 hover:text-foreground'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card border border-border rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-600">
                        <Filter size={16} />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card border border-border rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-600">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white dark:bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-border text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                <th className="px-6 py-4">TPO Name</th>
                                <th className="px-6 py-4">Institution</th>
                                <th className="px-6 py-4">Contact Email</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading requests...</td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No requests found.</td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                    {req.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-foreground">{req.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {/* Assuming institution field exists or using dummy */}
                                            {req.institution || "St. Mary's Institute"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{req.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(req.status)} uppercase`}>
                                                {req.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></span>}
                                                {req.status === 'approved' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>}
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {req.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(req._id)}
                                                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req._id)}
                                                        className="px-4 py-1.5 bg-white dark:bg-card border border-border hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-foreground text-sm font-medium rounded-lg transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            {req.status !== 'pending' && (
                                                <span className="text-sm text-gray-400 italic">Action taken</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Pagination (Visual only for now) */}
            <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Showing {requests.length} of {requests.length} requests</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                    <button className="px-3 py-1 border border-border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminRequests;
