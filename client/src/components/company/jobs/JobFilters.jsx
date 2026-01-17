import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

const JobFilters = () => {
    return (
        <div className="bg-white dark:bg-card p-4 rounded-xl border border-border shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by job title, ID, or location..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <div className="relative">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        Status: All
                        <ChevronDown size={16} className="text-gray-500" />
                    </button>
                </div>
                <div className="relative">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-background-muted border border-border rounded-lg text-sm font-medium text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        Type: Full-time
                        <ChevronDown size={16} className="text-gray-500" />
                    </button>
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
