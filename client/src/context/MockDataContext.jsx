import React, { createContext, useContext, useState, useEffect } from 'react';

const MockDataContext = createContext();

export const useMockData = () => {
    return useContext(MockDataContext);
};

export const MockDataProvider = ({ children }) => {
    // --- Mock Data Initialization ---

    // 1. User Profile
    const [user, setUser] = useState({
        name: 'Alex Johnson',
        role: 'Student',
        avatar: 'A',
        major: 'Computer Science & Engineering',
        year: '2024',
        cgpa: '3.8',
        email: 'alex.j@university.edu',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        universityRollNo: 'CSE-2024-001',
        currentSemester: 'Semester 6',
        resume: 'Alex_Resume_v4.pdf'
    });

    // 2. Settings - Persist to localStorage
    const [themeMode, setThemeMode] = useState(() => {
        // priority: localStorage > system preference > default 'light'
        const savedTheme = localStorage.getItem('themeMode');
        if (savedTheme) {
            return savedTheme;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    // Update global document class for Tailwind Dark Mode
    useEffect(() => {
        const root = window.document.documentElement;
        if (themeMode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('themeMode', themeMode);
    }, [themeMode]);

    // 3. Jobs (Static Mock Data)
    const [jobs, setJobs] = useState([
        { id: 1, company: 'Uber', role: 'UX Designer', location: 'San Francisco', type: 'Full-time', salary: '12 - 15 LPA', posted: '2 Days Left', initial: 'U', logoBg: 'bg-black', tags: ['Full-time', 'On-site', 'New'] },
        { id: 2, company: 'Google', role: 'Backend Engineer', location: 'Remote', type: 'Full-time', salary: '18 - 25 LPA', posted: '5 Days Left', initial: 'G', logoBg: 'bg-blue-600', tags: ['Remote', 'Design'] },
        { id: 3, company: 'Instagram', role: 'iOS Developer', location: 'New York', type: 'Internship', salary: '25k / mo', posted: '10 Days Left', initial: 'I', logoBg: 'bg-pink-600', tags: ['Internship', 'On-site'] },
        { id: 4, company: 'Amazon', role: 'Cloud Architect', location: 'Seattle', type: 'Full-time', salary: '20 - 28 LPA', posted: '1 Week Left', initial: 'A', logoBg: 'bg-orange-500', tags: ['Full-time', 'Hybrid'] },
        { id: 5, company: 'Netflix', role: 'Frontend Engineer', location: 'Los Gatos', type: 'Full-time', salary: '22 - 30 LPA', posted: '3 Days Left', initial: 'N', logoBg: 'bg-red-600', tags: ['Full-time', 'Remote'] },
        { id: 6, company: 'Microsoft', role: 'Product Manager', location: 'Redmond', type: 'Full-time', salary: '15 - 20 LPA', posted: 'Just Now', initial: 'M', logoBg: 'bg-blue-500', tags: ['Full-time', 'On-site', 'New'] },
    ]);

    // 4. Applications (Simulated Backend State)
    const [applications, setApplications] = useState([
        { id: 101, jobId: 99, company: 'TechCorp Inc.', role: 'Frontend Developer', date: 'Oct 24, 2023', status: 'In Review', initial: 'TC', color: 'yellow' },
        { id: 102, jobId: 98, company: 'Innovate Sol.', role: 'Product Intern', date: 'Oct 22, 2023', status: 'Interview', initial: 'IS', color: 'blue' },
        { id: 103, jobId: 97, company: 'DataSystems', role: 'Data Analyst', date: 'Oct 15, 2023', status: 'Rejected', initial: 'DS', color: 'red' },
        { id: 104, jobId: 96, company: 'AmazeTech', role: 'SDE 1', date: 'Oct 10, 2023', status: 'Offer', initial: 'AZ', color: 'green' },
    ]);

    // 5. Interviews (Simulated)
    const [interviews, setInterviews] = useState([
        { id: 1, company: 'Tech Corp Inc.', role: 'Junior Developer', date: 'Oct 24', time: '10:00 AM', type: 'Virtual Meeting (Zoom)', duration: '45 mins', status: 'Upcoming', logoBg: 'bg-slate-800' },
        { id: 2, company: 'Creative Studio', role: 'UX Designer', date: 'Oct 26', time: '02:30 PM', type: 'Building A, Room 404', duration: '60 mins', status: 'Upcoming', logoBg: 'bg-purple-600' },
        { id: 3, company: 'DataFlow Analytics', role: 'Data Scientist', date: 'Oct 28', time: '11:15 AM', type: 'Google Meet', duration: '30 mins', status: 'Upcoming', logoBg: 'bg-orange-500' },
    ]);

    // --- Actions ---

    const toggleTheme = () => {
        setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
    };

    const updateProfile = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    const applyForJob = (job) => {
        // Prevent duplicate applications
        if (applications.some(app => app.jobId === job.id)) return;

        const newApplication = {
            id: Date.now(),
            jobId: job.id,
            company: job.company,
            role: job.role,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Applied',
            initial: job.initial,
            color: 'blue' // Default color for 'Applied'
        };
        setApplications(prev => [newApplication, ...prev]);
    };

    const value = {
        user,
        jobs,
        applications,
        interviews,
        themeMode,
        toggleTheme,
        updateProfile,
        applyForJob
    };

    return (
        <MockDataContext.Provider value={value}>
            {children}
        </MockDataContext.Provider>
    );
};
