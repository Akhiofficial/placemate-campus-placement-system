import React from 'react';

const CompanyDashboard = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md border-l-4 border-purple-600">
                <h1 className="text-3xl font-bold text-purple-700 mb-4">Company Dashboard</h1>
                <p className="text-gray-600">Welcome, Recruiter! Manage your job postings here.</p>
            </div>
        </div>
    );
};

export default CompanyDashboard;
