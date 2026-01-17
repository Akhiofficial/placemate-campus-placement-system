import React from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import InterviewStats from '../../components/company/interviews/InterviewStats';
import InterviewFilters from '../../components/company/interviews/InterviewFilters';
import InterviewTable from '../../components/company/interviews/InterviewTable';

const CompanyInterviews = () => {
    const [activeTab, setActiveTab] = React.useState('Upcoming');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [roleFilter, setRoleFilter] = React.useState('All Roles');
    const [statusFilter, setStatusFilter] = React.useState('All Statuses');

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
            <InterviewStats />

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
                activeTab={activeTab}
                searchQuery={searchQuery}
                roleFilter={roleFilter}
                statusFilter={statusFilter}
            />
        </div>
    );
};

export default CompanyInterviews;
