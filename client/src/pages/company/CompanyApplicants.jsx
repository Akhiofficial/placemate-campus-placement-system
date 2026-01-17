import React from 'react';
import { Plus, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import ApplicationsStats from '../../components/company/applicants/ApplicationsStats';
import ApplicationsFilters from '../../components/company/applicants/ApplicationsFilters';
import ApplicationsTable from '../../components/company/applicants/ApplicationsTable';

const CompanyApplicants = () => {
    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Applications Management</h1>
                    <p className="text-foreground-muted mt-1">Review student applications, analyze AI scores, and shortlist candidates.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-card border border-border rounded-lg font-semibold text-foreground hover:bg-gray-50 dark:hover:bg-background-muted transition-colors shadow-sm text-sm">
                        <Download size={18} className="text-gray-500" />
                        Export CSV
                    </button>
                    <Link to="/company/jobs/create" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm transition-all text-sm">
                        <Plus size={18} />
                        Create Job Post
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <ApplicationsStats />

            {/* Filters */}
            <ApplicationsFilters />

            {/* Table */}
            <ApplicationsTable />
        </div>
    );
};

export default CompanyApplicants;
