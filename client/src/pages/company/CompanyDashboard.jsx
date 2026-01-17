import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCards from '../../components/company/StatsCards';
import RecentJobPostings from '../../components/company/RecentJobPostings';

const CompanyDashboard = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Overview</h1>
                    <p className="text-foreground-muted mt-1">Welcome back, Sarah. Here is what's happening at TechCorp today.</p>
                </div>
                <Link to="/company/jobs/create" className="flex items-center justify-center gap-2 bg-card dark:bg-card border border-border hover:bg-background-muted text-foreground font-semibold py-2.5 px-5 rounded-lg shadow-sm transition-all text-sm group">
                    <Plus size={18} className="text-foreground-muted group-hover:text-foreground" />
                    Create New Job
                </Link>
            </div>

            {/* Stats Cards */}
            <StatsCards />

            {/* Recent Job Postings */}
            <RecentJobPostings />

            {/* Footer */}
            <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-foreground-muted">
                <p>&copy; 2024 PlaceMate Inc. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-foreground transition-colors">Help Center</a>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
