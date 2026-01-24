import React, { useState, useEffect } from 'react';
import {
    Search,
    Building2,
    FileText,
    Briefcase,
    TrendingUp,
    Download,
    Filter,
    MoreHorizontal,
    Eye,
    Ban,
    Loader2,
    X,
    Plus,

    CheckCircle,
    ChevronDown,
    Trash2
} from 'lucide-react';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Doughnut, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompanies, setSelectedCompanies] = useState([]);

    // Feature States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
    const [selectedStatus, setSelectedStatus] = useState('All Statuses');
    const [showFilters, setShowFilters] = useState(false);


    const [showAddModal, setShowAddModal] = useState(false);

    const handleAddCompany = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            await axios.post('/admin/companies', data);
            toast.success("Company added successfully");
            setShowAddModal(false);
            // Refresh list
            const res = await axios.get('/admin/companies');
            setCompanies(res.data);
        } catch (err) {
            console.error("Error creating company:", err);
            toast.error(err.response?.data?.msg || "Failed to create company");
        }
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get('/admin/companies');
                setCompanies(res.data);
            } catch (err) {
                console.error("Error fetching companies:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    // Filter Logic
    const filteredCompanies = companies.filter(company => {
        const matchesSearch =
            company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            company.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            company.contactEmail.toLowerCase().includes(searchQuery.toLowerCase());

        const normalizedIndustry = company.industry ? company.industry.trim().charAt(0).toUpperCase() + company.industry.trim().slice(1) : 'Unknown';
        const matchesIndustry = selectedIndustry === 'All Industries' || normalizedIndustry === selectedIndustry;
        const matchesStatus = selectedStatus === 'All Statuses' || company.status === selectedStatus;

        return matchesSearch && matchesIndustry && matchesStatus;
    });

    // Bulk Selection Logic
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = filteredCompanies.map(c => c._id || c.id);
            setSelectedCompanies(allIds);
        } else {
            setSelectedCompanies([]);
        }
    };

    const handleSelectCompany = (id) => {
        if (selectedCompanies.includes(id)) {
            setSelectedCompanies(selectedCompanies.filter(companyId => companyId !== id));
        } else {
            setSelectedCompanies([...selectedCompanies, id]);
        }
    };

    // Export Logic
    const handleExport = () => {
        const headers = ["Company Name", "Industry", "Contact Name", "Contact Email", "Job Count", "Status", "Location"];
        const csvData = filteredCompanies.map(c =>
            `"${c.name}","${c.industry}","${c.contactName}","${c.contactEmail}","${c.jobs}","${c.status}","${c.location}"`
        );

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...csvData].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "companies_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Bulk Actions
    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedCompanies.length} companies? This will also delete their posted jobs.`)) return;

        try {
            // Parallel delete requests for now (can also implement a bulk endpoint in backend later)
            await Promise.all(selectedCompanies.map(id => axios.delete(`/admin/companies/${id}`)));

            setCompanies(companies.filter(c => !selectedCompanies.includes(c._id || c.id)));
            setSelectedCompanies([]);
            toast.success("Companies deleted successfully");
        } catch (err) {
            console.error("Error deleting companies:", err);
            toast.error("Failed to delete companies");
        }
    };

    const handleBulkBlock = async () => {
        try {
            // Block all selected companies
            await Promise.all(selectedCompanies.map(id => axios.put(`/admin/companies/${id}/status`, { isBlocked: true })));

            setCompanies(companies.map(c => {
                if (selectedCompanies.includes(c._id || c.id)) {
                    return { ...c, isBlocked: true };
                }
                return c;
            }));
            setSelectedCompanies([]);
            toast.success("Companies blocked successfully");
        } catch (err) {
            console.error("Error blocking companies:", err);
            toast.error("Failed to block companies");
        }
    };

    // Single Actions
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this company?")) return;
        try {
            await axios.delete(`/admin/companies/${id}`);
            setCompanies(companies.filter(c => (c._id || c.id) !== id));
            toast.success("Company deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete company");
        }
    };

    const handleToggleStatus = async (id, isBlocked) => {
        try {
            const newStatus = !isBlocked;
            await axios.put(`/admin/companies/${id}/status`, { isBlocked: newStatus });

            setCompanies(companies.map(c => {
                if ((c._id || c.id) === id) {
                    return { ...c, isBlocked: newStatus };
                }
                return c;
            }));
            toast.success(`Company ${newStatus ? 'blocked' : 'unblocked'} successfully`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    };

    // Derived Stats
    const totalCompanies = companies.length;
    const pendingApproval = companies.filter(c => c.status === 'Pending' && !c.isBlocked).length;
    // Active Hiring: Companies with open jobs that are NOT blocked
    const activeHiring = companies.filter(c => c.jobs > 0 && !c.isBlocked).length;
    const blockedCompanies = companies.filter(c => c.isBlocked).length;

    const stats = [
        { label: 'Total Companies', value: totalCompanies, subtext: 'Registered partners', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', trendColor: 'text-green-600' },
        { label: 'Pending Approval', value: pendingApproval, subtext: 'Needs review', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', trendColor: 'text-muted-foreground' },
        { label: 'Active Hiring', value: activeHiring, subtext: 'Companies w/ open jobs', icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', trendColor: 'text-muted-foreground' },
        { label: 'Blocked/Inactive', value: blockedCompanies, subtext: 'Restricted access', icon: Ban, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', trendColor: 'text-muted-foreground' },
    ];

    // Industry Distribution Logic
    const industryCounts = companies.reduce((acc, company) => {
        let ind = company.industry ? company.industry.trim() : 'Unknown';
        // Capitalize first letter to normalize (e.g. "technology" -> "Technology")
        ind = ind.charAt(0).toUpperCase() + ind.slice(1);
        acc[ind] = (acc[ind] || 0) + 1;
        return acc;
    }, {});

    const industryLabels = Object.keys(industryCounts);
    const industryValues = Object.values(industryCounts);

    const industryData = {
        labels: industryLabels.length ? industryLabels : ['No Data'],
        datasets: [
            {
                data: industryValues.length ? industryValues : [1], // Placeholder if empty
                backgroundColor: ['#3B82F6', '#8B5CF6', '#FBBF24', '#94A3B8', '#10B981'],
                borderWidth: 0,
            },
        ],
    };

    const industryOptions = {
        cutout: '70%',
        plugins: {
            legend: { display: false },
        },
        maintainAspectRatio: false,
    };

    // Registration Growth Logic (Simple mock or derived from createdAt if available, for now just show valid placeholder or calculate from createdAt)
    // Since backend returns createdAt, we can do it.
    // For simplicity in this quick fix, let's just mock a flat line or calculate properly if time permits.
    // Let's do a simple calculation of last 6 months based on createdAt.

    const getLast6MonthsLabels = () => {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            months.push(d.toLocaleString('default', { month: 'short' }));
        }
        return months;
    };

    const getGrowthData = () => {
        const last6Months = new Array(6).fill(0);
        const today = new Date();
        companies.forEach(c => {
            if (!c.createdAt) return;
            const created = new Date(c.createdAt);
            const diffMonths = (today.getFullYear() - created.getFullYear()) * 12 + (today.getMonth() - created.getMonth());
            if (diffMonths >= 0 && diffMonths < 6) {
                last6Months[5 - diffMonths]++;
            }
        });
        return last6Months;
    };

    const growthLabels = getLast6MonthsLabels();
    const growthValues = getGrowthData();

    const growthData = {
        labels: growthLabels,
        datasets: [
            {
                label: 'New Registrations',
                data: growthValues,
                borderColor: '#10B981',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
            },
        ],
    };

    const growthOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#1e293b',
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: true, drawBorder: false, color: '#334155', tickColor: '#334155' },
                ticks: { display: false, stepSize: 1 }
            },
            x: {
                grid: { display: false },
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };



    // Helper to get color based on industry (mock logic for now as simplified)
    const getIndustryColor = (industry) => {
        switch (industry) {
            case 'Technology': return 'bg-blue-100 text-blue-950 dark:bg-blue-900/10 dark:text-blue-300';
            case 'Finance': return 'bg-green-100 text-green-950 dark:bg-green-900/10 dark:text-green-300';
            case 'Consulting': return 'bg-purple-100 text-purple-950 dark:bg-purple-900/10 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-950 dark:bg-gray-900/10 dark:text-gray-300';
        }
    };

    const getStatusColor = (status, isBlocked) => {
        if (isBlocked) return 'bg-red-100 text-red-950 dark:bg-red-900/30 dark:text-red-300';
        return status === 'Approved'
            ? 'bg-green-100 text-green-950 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-amber-100 text-amber-950 dark:bg-amber-900/30 dark:text-amber-300';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-4 text-foreground">Company Management</h1>
                    <div className="flex flex-1 md:max-w-xl gap-3 mt-4 md:mt-0">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search companies, HR contacts..."
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-card text-foreground"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Building2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Company</span>
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 border border-border bg-card text-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export Report</span>
                    </button>
                </div>
            </div>

            {/* Add Company Modal */}
            {showAddModal && (
                <div className="fixed h-full   inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card w-full max-w-lg rounded-xl shadow-lg border border-border max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h3 className="text-lg font-bold text-foreground">Add New Company</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddCompany} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Company Name</label>
                                <input
                                    name="name"
                                    required
                                    className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                                    placeholder="e.g. contact@acme.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                                    placeholder="Initial password"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Location</label>
                                <input
                                    name="location"
                                    required
                                    className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                                    placeholder="e.g. San Francisco, CA"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Website</label>
                                <input
                                    name="website"
                                    className="w-full px-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                                    placeholder="e.g. https://acme.com"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Company
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Registered Companies</h2>
                    <p className="text-muted-foreground text-sm">Manage corporate partners, view profiles, and approve registrations.</p>
                </div>

            </div>


            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-start justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                            <div className="mt-2 text-left">
                                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                                <span className={`text-xs font-semibold ${stat.trendColor}`}>
                                    {index === 0 ? <span className="text-green-600 dark:text-green-400">↑ </span> : ''}
                                    {stat.subtext}
                                </span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Industry Distribution */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Industry Distribution</h3>
                    <div className="h-48 relative flex justify-center items-center flex-1">
                        <Doughnut data={industryData} options={industryOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-foreground">{totalCompanies}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                        {industryLabels.slice(0, 4).map((label, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: industryData.datasets[0].backgroundColor[i] }}></span>
                                <span className="text-muted-foreground text-xs">{label} ({Math.round(industryValues[i] / totalCompanies * 100)}%)</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Company Registrations */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Company Registrations</h3>
                            <p className="text-sm text-muted-foreground">New partners onboarded over last 6 months</p>
                        </div>
                        <span className="bg-green-50 text-green-700 dark:bg-green-700/10 dark:text-green-400 px-2 py-1 rounded text-xs font-semibold flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +8% Growth
                        </span>
                    </div>
                    <div className="flex-1 h-64 min-h-0 w-full mt-4">
                        <Line data={growthData} options={growthOptions} />
                    </div>
                </div>
            </div>

            {/* Categories / All Companies */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground">All Companies</h3>
                    <div className="flex gap-2">
                        {selectedCompanies.length > 0 && (
                            <>
                                <button
                                    onClick={handleBulkDelete}
                                    className="p-2 border border-red-200 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 transition-colors"
                                    title="Delete Selected"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleBulkBlock}
                                    className="p-2 border border-amber-200 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 transition-colors"
                                    title="Block/Suspend Selected"
                                >
                                    <Ban className="w-4 h-4" />
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 border rounded-lg transition-colors ${showFilters ? 'bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300' : 'border-border text-muted-foreground bg-card hover:bg-accent'}`}
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>


                {/* Filter Panel */}
                {showFilters && (
                    <div className="mb-4 p-4 bg-card border border-border rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground">Industry</label>
                                <div className="relative">
                                    <select
                                        value={selectedIndustry}
                                        onChange={(e) => setSelectedIndustry(e.target.value)}
                                        className="w-full pl-3 pr-10 py-2 bg-secondary/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none text-foreground"
                                    >
                                        <option value="All Industries" className="bg-card text-foreground">All Industries</option>
                                        {industryLabels.map((ind) => (
                                            <option key={ind} value={ind} className="bg-card text-foreground">{ind}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground">Status</label>
                                <div className="relative">
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="w-full pl-3 pr-10 py-2 bg-secondary/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none  text-foreground"
                                    >
                                        <option value="All Statuses" className="bg-card text-foreground">All Statuses</option>
                                        <option value="Approved" className="bg-card text-foreground">Approved</option>
                                        <option value="Pending" className="bg-card text-foreground">Pending</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            {/* Clear Filters (Only show if filters are applied) */}
                            {(selectedIndustry !== 'All Industries' || selectedStatus !== 'All Statuses') && (
                                <div className="flex items-end">
                                    <button
                                        onClick={() => {
                                            setSelectedIndustry('All Industries');
                                            setSelectedStatus('All Statuses');
                                        }}
                                        className="mb-1px px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <th className="p-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-transparent"
                                        checked={filteredCompanies.length > 0 && selectedCompanies.length === filteredCompanies.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="p-4">Company Name</th>
                                <th className="p-4">Industry</th>
                                <th className="p-4">HR Contact</th>
                                <th className="p-4">Active Jobs</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredCompanies.map((company) => (
                                <tr key={company.id || company._id} className={`hover:bg-accent/50 transition-colors ${company.isBlocked ? 'opacity-70 bg-red-50/10' : ''} ${selectedCompanies.includes(company._id || company.id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-transparent"
                                            checked={selectedCompanies.includes(company._id || company.id)}
                                            onChange={() => handleSelectCompany(company._id || company.id)}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                {/* Simple logo placeholder based on industry */}
                                                {company.industry === 'Technology' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
                                                {company.industry === 'Consulting' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                                                {company.industry === 'Finance' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                                {company.industry === 'Energy' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{company.name}</div>
                                                <div className="text-xs text-muted-foreground">{company.location}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getIndustryColor(company.industry)}`}>
                                            {company.industry}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <div className="font-medium text-foreground text-sm">{company.contactName}</div>
                                            <div className="text-xs text-muted-foreground">{company.contactEmail}</div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm font-semibold text-foreground">{company.jobs}</span>
                                        <span className="text-xs text-muted-foreground ml-1">Roles</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(company.status, company.isBlocked)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${company.isBlocked ? 'bg-red-500' : (company.status === 'Approved' ? 'bg-green-500' : 'bg-amber-500')}`}></span>
                                            {company.isBlocked ? 'Blocked' : company.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(company._id || company.id, company.isBlocked)}
                                                className={`p-1.5 rounded-lg transition-colors ${company.isBlocked ? 'text-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-100' : 'text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                                                title={company.isBlocked ? "Unblock Company" : "Block Company"}
                                            >
                                                {company.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(company._id || company.id)}
                                                className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete Company"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-4 border-t border-border flex justify-center">
                        <button className="text-sm text-muted-foreground hover:text-foreground font-medium">View All Companies</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCompanies;
