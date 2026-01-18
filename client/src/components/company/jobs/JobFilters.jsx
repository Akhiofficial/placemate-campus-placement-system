import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Check } from 'lucide-react';

const JobFilters = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, typeFilter, setTypeFilter }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);

    const toggleDropdown = (name) => {
        if (activeDropdown === name) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(name);
        }
    };

    return (
        <div className="bg-white dark:bg-card p-4 rounded-xl border border-border shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center relative z-10">
            {/* Backdrop for closing dropdowns */}
            {activeDropdown && (
                <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
            )}

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by job title, ID, or location..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto relative z-20">
                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('status')}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${activeDropdown === 'status' ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-gray-50 dark:bg-background-muted border-border text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        Status: {statusFilter}
                        <ChevronDown size={16} className={`text-gray-500 transition-transform ${activeDropdown === 'status' ? 'rotate-180' : ''}`} />
                    </button>

                    {activeDropdown === 'status' && (
                        <div className="absolute top-full mt-2 w-48 bg-white dark:bg-card border border-border rounded-lg shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            {['All', 'Active', 'Draft', 'Closed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-background-muted flex items-center justify-between"
                                >
                                    {status}
                                    {statusFilter === status && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => toggleDropdown('type')}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-colors ${activeDropdown === 'type' ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400' : 'bg-gray-50 dark:bg-background-muted border-border text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        Type: {typeFilter}
                        <ChevronDown size={16} className={`text-gray-500 transition-transform ${activeDropdown === 'type' ? 'rotate-180' : ''}`} />
                    </button>

                    {activeDropdown === 'type' && (
                        <div className="absolute top-full mt-2 w-48 bg-white dark:bg-card border border-border rounded-lg shadow-lg py-1 animate-in fade-in zoom-in-95 duration-100">
                            {['All', 'Full-time', 'Intern'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setTypeFilter(type);
                                        setActiveDropdown(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-background-muted flex items-center justify-between"
                                >
                                    {type}
                                    {typeFilter === type && <Check size={14} className="text-blue-600 dark:text-blue-400" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Filter size={16} className="text-gray-500" />
                    More Filters
                </button>
            </div>
        </div>
    );
};

export default JobFilters;
