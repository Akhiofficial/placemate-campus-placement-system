import React, { useState } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

const ApplicationsFilters = ({
    searchQuery, setSearchQuery,
    roleFilter, setRoleFilter,
    cgpaFilter, setCgpaFilter,
    statusFilter, setStatusFilter
}) => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (name) => {
        if (activeDropdown === name) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(name);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setRoleFilter('All');
        setCgpaFilter('All');
        setStatusFilter('All');
        setActiveDropdown(null);
    };

    return (
        <div className="bg-white dark:bg-card p-4 rounded-xl border border-border shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center relative z-20">
            {/* Backdrop */}
            {activeDropdown && (
                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
            )}

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by name, roll no, or skill..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto relative z-20">
                <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider mr-1 hidden md:block">Filters:</span>

                {/* Role Filter */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('role')}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm transition-colors shadow-sm ${activeDropdown === 'role' ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-white dark:bg-card border-border text-foreground hover:bg-gray-50 dark:hover:bg-background-muted'}`}
                    >
                        Role: {roleFilter}
                        <ChevronDown size={14} className={`text-gray-500 transition-transform ${activeDropdown === 'role' ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === 'role' && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-card border border-border rounded-lg shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            {['All', 'SDE', 'Product', 'Design'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => { setRoleFilter(option); setActiveDropdown(null); }}
                                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-background-muted flex items-center justify-between"
                                >
                                    {option}
                                    {roleFilter === option && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* CGPA Filter */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('cgpa')}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm transition-colors shadow-sm ${activeDropdown === 'cgpa' ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-white dark:bg-card border-border text-foreground hover:bg-gray-50 dark:hover:bg-background-muted'}`}
                    >
                        CGPA: {cgpaFilter}
                        <ChevronDown size={14} className={`text-gray-500 transition-transform ${activeDropdown === 'cgpa' ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === 'cgpa' && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-card border border-border rounded-lg shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            {['All', '> 7.0', '> 8.0', '> 9.0'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => { setCgpaFilter(option); setActiveDropdown(null); }}
                                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-background-muted flex items-center justify-between"
                                >
                                    {option}
                                    {cgpaFilter === option && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('status')}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-sm transition-colors shadow-sm ${activeDropdown === 'status' ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-white dark:bg-card border-border text-foreground hover:bg-gray-50 dark:hover:bg-background-muted'}`}
                    >
                        Status: {statusFilter}
                        <ChevronDown size={14} className={`text-gray-500 transition-transform ${activeDropdown === 'status' ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === 'status' && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-card border border-border rounded-lg shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            {['All', 'Shortlisted', 'Pending', 'Rejected'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => { setStatusFilter(option); setActiveDropdown(null); }}
                                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-background-muted flex items-center justify-between"
                                >
                                    {option}
                                    {statusFilter === option && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={clearFilters}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 ml-2"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};

export default ApplicationsFilters;
