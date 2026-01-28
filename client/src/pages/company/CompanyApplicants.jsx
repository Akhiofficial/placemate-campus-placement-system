import React, { useState, useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import ApplicationsStats from '../../components/company/applicants/ApplicationsStats';
import ApplicationsFilters from '../../components/company/applicants/ApplicationsFilters';
import ApplicationsTable from '../../components/company/applicants/ApplicationsTable';
import { getCompanyApplications, getApplicationsStats, updateApplicationStatus } from '../../api/companyApi';

const CompanyApplicants = () => {
    const [candidates, setCandidates] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Filters & Pagination State
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [cgpaFilter, setCgpaFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    // Debounce search query
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Build Filters Object
                const filters = {};
                if (debouncedSearch) filters.search = debouncedSearch;
                if (roleFilter !== 'All') filters.role = roleFilter;
                if (cgpaFilter !== 'All') filters.cgpa = cgpaFilter;
                if (statusFilter !== 'All') filters.status = statusFilter;
                filters.page = currentPage;
                filters.limit = itemsPerPage;

                const [statsData, appsData] = await Promise.all([
                    getApplicationsStats(),
                    getCompanyApplications(filters)
                ]);

                setStats(statsData);

                // Map Backend Data to UI Structure (Response: { applications: [], total: ... })
                const formattedCandidates = appsData.applications.map(app => ({
                    id: app._id,
                    name: app.student.name,
                    email: app.student.email,
                    image: app.student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.student.name)}&background=random`,
                    degree: `${app.degree || 'N/A'} (${app.branch || 'N/A'})`,
                    cgpa: `${app.cgpa || 'N/A'} CGPA`,
                    cgpaValue: app.cgpa || 0,
                    skills: app.skills || [],
                    aiMatch: app.aiScore || 0,
                    matchReason: app.matchReason,
                    missingSkills: app.missingSkills || [],
                    status: app.status
                }));

                setCandidates(formattedCandidates);
                setTotalPages(appsData.pages || 1);
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [debouncedSearch, roleFilter, cgpaFilter, statusFilter, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateApplicationStatus(id, newStatus);
            // Optimistic update
            setCandidates(prev => prev.map(c =>
                c.id === id ? { ...c, status: newStatus } : c
            ));
            alert(`Status updated to ${newStatus}`);
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status");
        }
    };

    const handleExportCSV = () => {
        if (!candidates.length) return alert("No data to export");

        const headers = ["Name", "Email", "Degree", "CGPA", "Skills", "AI Match", "Status"];
        const csvContent = [
            headers.join(","),
            ...candidates.map(c => [
                `"${c.name}"`,
                `"${c.email}"`,
                `"${c.degree}"`,
                `"${c.cgpa}"`,
                `"${c.skills.join(", ")}"`,
                `"${c.aiMatch}/100"`,
                `"${c.status}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "applicants_data.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Applications Management</h1>
                    <p className="text-foreground-muted mt-1">Review student applications, analyze AI scores, and shortlist candidates.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-card border border-border rounded-lg font-semibold text-foreground hover:bg-gray-50 dark:hover:bg-background-muted transition-colors shadow-sm text-sm"
                    >
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
            <ApplicationsStats stats={stats} />

            {/* Filters */}
            <ApplicationsFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                cgpaFilter={cgpaFilter}
                setCgpaFilter={setCgpaFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            {/* Table */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <ApplicationsTable
                    candidates={candidates}
                    onStatusUpdate={handleStatusUpdate}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={candidates.length} // Note: This should ideally be total items from backend, but `candidates` is just current page
                />
            )}
        </div>
    );
};

export default CompanyApplicants;
