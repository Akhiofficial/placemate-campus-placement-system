import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatsCards from '../../components/company/StatsCards';
import RecentJobPostings from '../../components/company/RecentJobPostings';
import { getCompanyDashboardStats, getRecentJobPostings } from '../../api/companyApi';

const CompanyDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [statsData, jobsData] = await Promise.all([
                    getCompanyDashboardStats(),
                    getRecentJobPostings()
                ]);
                setStats(statsData);
                setRecentJobs(jobsData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching company dashboard data:", err);
                setError("Failed to load dashboard data");
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-10">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Overview</h1>
                    <p className="text-foreground-muted mt-1">Welcome back. Here is what's happening today.</p>
                </div>
                <Link to="/company/jobs/create" className="flex items-center justify-center gap-2 bg-card dark:bg-card border border-border hover:bg-background-muted text-foreground font-semibold py-2.5 px-5 rounded-lg shadow-sm transition-all text-sm group">
                    <Plus size={18} className="text-foreground-muted group-hover:text-foreground" />
                    Create New Job
                </Link>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Recent Job Postings */}
            <RecentJobPostings jobs={recentJobs} />

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
