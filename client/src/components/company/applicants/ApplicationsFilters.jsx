import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

const ApplicationsFilters = () => {
    return (
        <div className="bg-white dark:bg-card p-4 rounded-xl border border-border shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by name, roll no, or skill..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <span className="text-xs font-bold text-foreground-muted uppercase tracking-wider mr-1 hidden md:block">Filters:</span>

                <div className="relative">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm text-foreground hover:bg-gray-50 dark:hover:bg-background-muted transition-colors shadow-sm">
                        Role: All
                        <ChevronDown size={14} className="text-gray-500" />
                    </button>
                </div>
                <div className="relative">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm text-foreground hover:bg-gray-50 dark:hover:bg-background-muted transition-colors shadow-sm">
                        CGPA: &gt; 8.0
                        <ChevronDown size={14} className="text-gray-500" />
                    </button>
                </div>
                <div className="relative">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-card border border-border rounded-md text-sm text-foreground hover:bg-gray-50 dark:hover:bg-background-muted transition-colors shadow-sm">
                        Status: Pending
                        <ChevronDown size={14} className="text-gray-500" />
                    </button>
                </div>

                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 ml-2">
                    Clear All
                </button>
            </div>
        </div>
    );
};

export default ApplicationsFilters;
