import React from 'react';
import { Plus, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import ApplicationsStats from '../../components/company/applicants/ApplicationsStats';
import ApplicationsFilters from '../../components/company/applicants/ApplicationsFilters';
import ApplicationsTable from '../../components/company/applicants/ApplicationsTable';

// Dummy Data moved from Table
const candidatesData = [
    {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.j@uni.edu',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        degree: 'B.Tech (CS)',
        cgpa: '9.4 CGPA',
        cgpaValue: 9.4,
        skills: ['React', 'Node.js', '+2'],
        aiMatch: 96,
        status: 'Shortlisted'
    },
    {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.c@uni.edu',
        image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        degree: 'B.Tech (IT)',
        cgpa: '8.8 CGPA',
        cgpaValue: 8.8,
        skills: ['Python', 'Django'],
        aiMatch: 85,
        status: 'Pending'
    },
    {
        id: 3,
        name: 'Aisha Rao',
        email: 'aisha.r@uni.edu',
        image: 'https://ui-avatars.com/api/?name=Aisha+Rao&background=EBF4FF&color=7F9CF5',
        degree: 'B.Tech (ECE)',
        cgpa: '7.9 CGPA',
        cgpaValue: 7.9,
        skills: ['C++', 'Embedded'],
        aiMatch: 62,
        status: 'Rejected'
    },
    {
        id: 4,
        name: 'David Kim',
        email: 'david.k@uni.edu',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        degree: 'B.Tech (CS)',
        cgpa: '8.9 CGPA',
        cgpaValue: 8.9,
        skills: ['Java', 'Spring'],
        aiMatch: 82,
        status: 'Pending'
    },
];

const CompanyApplicants = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [roleFilter, setRoleFilter] = React.useState('All');
    const [cgpaFilter, setCgpaFilter] = React.useState('All');
    const [statusFilter, setStatusFilter] = React.useState('All');

    // Filtering Logic
    const filteredCandidates = candidatesData.filter(candidate => {
        // Search
        const searchLower = searchQuery.toLowerCase();
        const searchMatch =
            candidate.name.toLowerCase().includes(searchLower) ||
            candidate.email.toLowerCase().includes(searchLower) ||
            candidate.skills.some(skill => skill.toLowerCase().includes(searchLower));

        // Role (Mock logic as role isn't in data, assuming All for now or matching degree)
        const roleMatch = roleFilter === 'All' || candidate.degree.includes(roleFilter);

        // CGPA
        let cgpaMatch = true;
        if (cgpaFilter === '> 9.0') cgpaMatch = candidate.cgpaValue >= 9.0;
        else if (cgpaFilter === '> 8.0') cgpaMatch = candidate.cgpaValue >= 8.0;
        else if (cgpaFilter === '> 7.0') cgpaMatch = candidate.cgpaValue >= 7.0;

        // Status
        const statusMatch = statusFilter === 'All' || candidate.status === statusFilter;

        return searchMatch && roleMatch && cgpaMatch && statusMatch;
    });

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
            <ApplicationsTable candidates={filteredCandidates} />
        </div>
    );
};

export default CompanyApplicants;
