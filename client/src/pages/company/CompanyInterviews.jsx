import React, { useState, useEffect } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import InterviewStats from '../../components/company/interviews/InterviewStats';
import InterviewFilters from '../../components/company/interviews/InterviewFilters';
import InterviewTable from '../../components/company/interviews/InterviewTable';
import { getInterviewStats, getCompanyInterviews } from '../../api/companyApi';

const CompanyInterviews = () => {
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [statusFilter, setStatusFilter] = useState('All Statuses');

    const [stats, setStats] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Debounce search
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const filters = {};

            if (activeTab === 'Upcoming') filters.type = 'Upcoming';
            else if (activeTab === 'Past Interviews') filters.type = 'Past';
            if (debouncedSearch) filters.search = debouncedSearch;
            if (roleFilter !== 'All Roles') filters.role = roleFilter;
            if (statusFilter !== 'All Statuses') filters.status = statusFilter;

            const [statsData, interviewsData] = await Promise.all([
                getInterviewStats(),
                getCompanyInterviews(filters)
            ]);

            setStats(statsData);

            // Map backend data to UI format
            const formattedInterviews = (interviewsData.interviews || []).map(inv => ({
                id: inv._id,
                name: inv.candidate.name,
                email: inv.candidate.email,
                image: inv.candidate.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(inv.candidate.name)}&background=random`,
                role: inv.role,
                dept: inv.department || 'Engineering', // Fallback or add to map
                date: new Date(inv.date).toLocaleDateString(),
                time: inv.time,
                platform: inv.platform,
                meetingLink: inv.meetingLink,
                status: inv.status
            }));

            setInterviews(formattedInterviews);

        } catch (error) {
            console.error("Error fetching interviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [debouncedSearch, activeTab, roleFilter, statusFilter]);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Breadcrumb & Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-foreground-muted mb-2">
                    <span>Dashboard</span>
                    <ChevronRight size={14} />
                    <span className="text-foreground font-medium">Interview Schedule</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Interview Schedule</h1>
                        <p className="text-foreground-muted mt-1">Manage, track, and conduct interviews with shortlisted candidates.</p>
                    </div>

                    <Link to="/company/interviews/schedule" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm transition-all text-sm">
                        <Plus size={18} />
                        Schedule New Interview
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <InterviewStats stats={stats} />

            {/* Filters & Tabs */}
            <InterviewFilters
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            {/* Table */}
            <InterviewTable
                interviews={interviews}
                loading={loading}
                onRefresh={fetchData}
            />
        </div>
    );
};

export default CompanyInterviews;
