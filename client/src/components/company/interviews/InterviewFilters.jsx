import React, { useState } from 'react';
import { Search, ChevronDown, Filter } from 'lucide-react';

const InterviewFilters = ({
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter
}) => {
    // State to track which dropdown is open: 'role', 'status', or null
    const [openDropdown, setOpenDropdown] = useState(null);

    const tabs = ['Upcoming', 'Past Interviews', 'All Scheduled'];
    const roles = ['All Roles', 'Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer', 'DevOps Engineer'];
    const statuses = ['All Statuses', 'Confirmed', 'Pending', 'Rescheduled', 'Completed', 'Cancelled', 'Rejected'];

    const toggleDropdown = (name) => {
        if (openDropdown === name) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(name);
        }
    };

    // Close dropdown when clicking outside (simple backdrop approach)
    const CloseBackdrop = () => (
        <div
            className="fixed inset-0 z-10 bg-transparent"
            onClick={() => setOpenDropdown(null)}
        />
    );

    return (
        <div className="bg-white dark:bg-card border border-border rounded-xl shadow-sm mb-6 relative">
            {openDropdown && <CloseBackdrop />}

            {/* Tabs */}
            <div className="flex border-b border-border px-6 pt-4 gap-6">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === tab
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-foreground-muted hover:text-foreground'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50 dark:bg-card relative z-20">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    {/* Role Dropdown */}
                    <div className="relative flex-1 md:flex-none">
                        <button
                            onClick={() => toggleDropdown('role')}
                            className={`flex items-center justify-between w-full md:w-48 px-3 py-2 bg-white dark:bg-background-muted border ${openDropdown === 'role' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-200 dark:border-border'} rounded-lg text-sm font-medium text-foreground hover:bg-gray-50 dark:hover:bg-card transition-all cursor-pointer shadow-sm`}
                        >
                            <span className="truncate mr-2">{roleFilter}</span>
                            <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${openDropdown === 'role' ? 'rotate-180' : ''}`} />
                        </button>

                        {openDropdown === 'role' && (
                            <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-card border border-border rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-none py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                                {roles.map(role => (
                                    <button
                                        key={role}
                                        onClick={() => {
                                            setRoleFilter(role);
                                            setOpenDropdown(null);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${roleFilter === role
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium'
                                            : 'text-foreground hover:bg-gray-50 dark:hover:bg-background-muted'
                                            }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Status Dropdown */}
                    <div className="relative flex-1 md:flex-none">
                        <button
                            onClick={() => toggleDropdown('status')}
                            className={`flex items-center justify-between w-full md:w-48 px-3 py-2 bg-white dark:bg-background-muted border ${openDropdown === 'status' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-200 dark:border-border'} rounded-lg text-sm font-medium text-foreground hover:bg-gray-50 dark:hover:bg-card transition-all cursor-pointer shadow-sm`}
                        >
                            <span className="truncate mr-2">{statusFilter}</span>
                            <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${openDropdown === 'status' ? 'rotate-180' : ''}`} />
                        </button>

                        {openDropdown === 'status' && (
                            <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-card border border-border rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-none py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                                {statuses.map(status => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setStatusFilter(status);
                                            setOpenDropdown(null);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === status
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium'
                                            : 'text-foreground hover:bg-gray-50 dark:hover:bg-background-muted'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="p-2 bg-white dark:bg-background-muted border border-border rounded-lg text-foreground-muted hover:text-foreground hover:bg-gray-50 dark:hover:bg-card transition-colors shadow-sm">
                        <Filter size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewFilters;
