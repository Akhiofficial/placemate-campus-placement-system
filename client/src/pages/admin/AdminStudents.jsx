import React, { useEffect, useState, useRef } from 'react';
import {
    Search,
    UserPlus,
    FileUp,
    Users,
    CheckCircle,
    Search as SearchIcon,
    GraduationCap,
    Filter,
    Download,
    Eye,
    Pencil,
    MoreVertical,
    Trash2,
    Ban,
    CheckCircle2,
    X,
    Save,
    Loader2,
    ChevronDown
} from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../../api/axios';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend);

// Edit Student Modal Component
const EditStudentModal = ({ student, isOpen, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        cgpa: '',
        skills: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name || '',
                email: student.email || '',
                department: student.department || '',
                cgpa: student.cgpa || '',
                skills: Array.isArray(student.skills) ? student.skills.join(', ') : ''
            });
        }
    }, [student]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
            const payload = { ...formData, skills: skillsArray };

            await api.put(`/admin/students/${student._id}`, payload);
            toast.success("Student updated successfully");
            onUpdate();
            onClose();
        } catch (err) {
            console.error("Error updating student:", err);
            toast.error("Failed to update student");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Edit Student</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">CGPA</label>
                            <input
                                type="number"
                                step="0.01"
                                max="10"
                                value={formData.cgpa}
                                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Skills (comma separated)</label>
                        <textarea
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                            placeholder="Java, Python, React..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminStudents = () => {
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        totalStudents: 0,
        placedStudents: 0,
        seekingStudents: 0,
        averageCGPA: 0
    });
    const [demographics, setDemographics] = useState([]);
    const [topSkills, setTopSkills] = useState([]);
    const [placementStats, setPlacementStats] = useState({ placed: 0, seeking: 0 });


    // Actions State
    const [editingStudent, setEditingStudent] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [actionMenuOpen, setActionMenuOpen] = useState(null); // ID of student whose menu is open
    const [selectedStudents, setSelectedStudents] = useState(new Set());
    const [blockingId, setBlockingId] = useState(null);

    const fetchData = async () => {
        try {
            const res = await api.get('/admin/students-with-stats');
            const { studentData, dashboardStats, demographics, topSkills, placementStats } = res.data;
            setStudentData(studentData || []);
            setDashboardStats(dashboardStats || {
                totalStudents: 0,
                placedStudents: 0,
                seekingStudents: 0,
                averageCGPA: 0
            });
            setDemographics((demographics || []).filter(d => d.label !== 'Unspecified'));
            setTopSkills(topSkills || []);
            setPlacementStats(placementStats || { placed: 0, seeking: 0 });
            setSelectedStudents(new Set());
        } catch (err) {
            console.error("Error fetching student data:", err);
            toast.error("Failed to load student data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Bulk selection handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            // Select all currently visible (filtered) students
            const allIds = new Set(filteredStudents.map(s => s._id));
            setSelectedStudents(allIds);
        } else {
            setSelectedStudents(new Set());
        }
    };

    const handleSelectStudent = (id) => {
        const newSelected = new Set(selectedStudents);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedStudents(newSelected);
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedStudents.size} students?`)) return;
        try {
            const updates = Array.from(selectedStudents).map(id => api.delete(`/admin/students/${id}`));
            await Promise.all(updates);
            toast.success("Students deleted successfully");
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete some students");
        }
    };

    const handleBulkBlock = async (action) => {
        const isBlocked = action === 'block';
        try {
            const updates = Array.from(selectedStudents).map(id => api.put(`/admin/students/${id}/status`, { isBlocked }));
            await Promise.all(updates);
            toast.success(`Students ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    };

    // Export Logic
    const handleExport = () => {
        const headers = ["Name", "Email", "Department", "CGPA", "Skills", "Status", "Joined At"];
        const csvData = filteredStudents.map(student =>
            `"${student.name}","${student.email}","${student.department || ''}","${student.cgpa || ''}","${(student.skills || []).join('; ')}","${student.status}","${new Date(student.joinedAt).toLocaleDateString()}"`
        );

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...csvData].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "students_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // CSV Import Logic
    const fileInputRef = useRef(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;
            const rows = text.split('\n');
            const students = [];

            // Assume Header: name,email,password,department,universityRollNo
            // Skip header if present (heuristic: check for 'email' string)
            let startIndex = 0;
            if (rows[0].toLowerCase().includes('email')) startIndex = 1;

            for (let i = startIndex; i < rows.length; i++) {
                const row = rows[i].trim();
                if (!row) continue;

                // Simple CSV split (doesn't handle commas in quotes)
                const cols = row.split(',').map(c => c.trim());
                if (cols.length < 3) continue; // Skip invalid rows

                const [name, email, password, department, universityRollNo] = cols;
                students.push({ name, email, password, department, universityRollNo });
            }

            if (students.length === 0) {
                toast.error("No valid student data found in CSV");
                return;
            }

            const toastId = toast.loading("Importing students...");
            try {
                const res = await api.post('/admin/students/import', { students });
                const { success, failed, errors } = res.data.results;

                toast.success(`Imported: ${success}, Failed: ${failed}`, { id: toastId });
                if (failed > 0) {
                    console.error("Import errors:", errors);
                    toast.error(`Check console for ${failed} errors`, { duration: 5000 });
                }
                fetchData();
            } catch (err) {
                console.error("Import error:", err);
                toast.error("Failed to import students", { id: toastId });
            } finally {
                e.target.value = ''; // Reset file input
            }
        };
        reader.readAsText(file);
    };

    // Action Handlers
    const handleDelete = async (studentId) => {
        if (!window.confirm("Are you sure you want to permanently delete this student?")) return;

        try {
            await api.delete(`/admin/students/${studentId}`);
            toast.success("Student deleted successfully");
            fetchData(); // Refresh data
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete student");
        }
    };

    const handleToggleBlock = async (studentId, currentStatus) => {
        console.log(`Toggling block for ${studentId}, current: ${currentStatus}, new: ${!currentStatus}`);
        setBlockingId(studentId);
        try {
            const newStatus = !currentStatus;
            await api.put(`/admin/students/${studentId}/status`, { isBlocked: newStatus });
            toast.success(`Student ${newStatus ? 'blocked' : 'unblocked'} successfully`);
            await fetchData();
            if (actionMenuOpen === studentId) setActionMenuOpen(null);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update student status");
        } finally {
            setBlockingId(null);
        }
    };

    // Derived Stats for UI
    const stats = [
        {
            label: 'Total Registered',
            value: dashboardStats.totalStudents,
            subtext: '100%',
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            label: 'Placed Students',
            value: dashboardStats.placedStudents,
            subtext: dashboardStats.totalStudents ? `${((dashboardStats.placedStudents / dashboardStats.totalStudents) * 100).toFixed(1)}%` : '0%',
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            label: 'Looking for Job',
            value: dashboardStats.seekingStudents,
            subtext: dashboardStats.totalStudents ? `${((dashboardStats.seekingStudents / dashboardStats.totalStudents) * 100).toFixed(1)}%` : '0%',
            icon: SearchIcon,
            color: 'text-amber-600',
            bg: 'bg-amber-50 dark:bg-amber-900/20'
        },
        {
            label: 'Avg CGPA',
            value: dashboardStats.averageCGPA,
            subtext: '/ 10.0',
            icon: GraduationCap,
            color: 'text-purple-600',
            bg: 'bg-purple-50 dark:bg-purple-900/20'
        },
    ];

    const placementChartData = {
        labels: ['Placed', 'Seeking'],
        datasets: [
            {
                data: [placementStats.placed, placementStats.seeking],
                backgroundColor: ['#3B82F6', '#FBBF24'],
                borderWidth: 0,
            },
        ],
    };

    const placementOptions = {
        cutout: '75%',
        plugins: {
            legend: { display: false },
        },
        maintainAspectRatio: false,
    };

    // Helper for random colors if not enough predefined
    const skillColors = [
        'bg-blue-100 text-blue-700 dark:bg-blue-700/15 dark:text-blue-500',
        'bg-green-100 text-green-700 dark:bg-green-700/15 dark:text-green-500',
        'bg-indigo-100 text-indigo-700 dark:bg-indigo-700/15 dark:text-indigo-500',
        'bg-orange-100 text-orange-700 dark:bg-orange-700/15 dark:text-orange-500',
        'bg-slate-100 text-slate-700 dark:bg-slate-700/15 dark:text-slate-500',
        'bg-teal-100 text-teal-700 dark:bg-teal-700/15 dark:text-teal-500',
        'bg-pink-100 text-pink-700 dark:bg-pink-700/15 dark:text-pink-500',
        'bg-purple-100 text-purple-700 dark:bg-purple-700/15 dark:text-purple-500',
    ];

    // Search and Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [selectedDept, setSelectedDept] = useState('All Depts');
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [showDeptFilter, setShowDeptFilter] = useState(false);

    // Get unique departments from data
    const departments = ['All Depts', ...new Set(studentData.map(s => s.department).filter(Boolean))];

    const filteredStudents = studentData.filter(student => {
        const query = searchQuery.toLowerCase();

        // Search Filter
        const matchesSearch = (
            student.name?.toLowerCase().includes(query) ||
            student.email?.toLowerCase().includes(query) ||
            student.department?.toLowerCase().includes(query) ||
            student.skills?.some(skill => skill.toLowerCase().includes(query))
        );

        // Status Filter
        const matchesStatus = selectedStatus === 'All Status' ||
            (selectedStatus === 'Placed' && student.status === 'Placed') ||
            (selectedStatus === 'Seeking' && student.status !== 'Placed');

        // Department Filter
        const matchesDept = selectedDept === 'All Depts' || student.department === selectedDept;

        return matchesSearch && matchesStatus && matchesDept;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6" onClick={() => setActionMenuOpen(null)}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Students</h1>
                    <p className="text-muted-foreground text-sm">Manage student profiles and placements</p>
                </div>

                <div className="flex flex-1 md:max-w-xl gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Quick search student name, ID..."
                            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-card text-foreground"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Student</span>
                    </button>
                    <button
                        onClick={handleImportClick}
                        className="flex items-center gap-2 border border-border bg-card text-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                    >
                        <FileUp className="w-4 h-4" />
                        <span className="hidden sm:inline">Import CSV</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".csv"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-card p-5 rounded-xl border border-border shadow-sm flex items-start justify-between">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                            <div className="mt-2 flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                                <span className={`text-xs font-semibold ${stat.color.replace('text-', 'text-opacity-80 ')}`}>{stat.subtext}</span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Placement Status */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Placement Status</h3>
                    <div className="h-48 relative flex justify-center">
                        <Doughnut data={placementChartData} options={placementOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-foreground">
                                {dashboardStats.totalStudents ? Math.round((dashboardStats.placedStudents / dashboardStats.totalStudents) * 100) : 0}%
                            </span>
                            <span className="text-sm text-muted-foreground">Placed</span>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span className="text-muted-foreground">Placed ({placementStats.placed})</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                            <span className="text-muted-foreground">Seeking ({placementStats.seeking})</span>
                        </div>
                    </div>
                </div>

                {/* Demographics */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-foreground">Demographics</h3>
                        <button className="text-xs text-muted-foreground border border-border px-2 py-1 rounded hover:bg-accent">Department v</button>
                    </div>
                    <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 no-scrollbar">
                        {demographics.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-foreground">{item.label}</span>
                                    <span className="text-muted-foreground">{item.value}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${(item.value / dashboardStats.totalStudents) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {demographics.length === 0 && <p className="text-sm text-muted-foreground text-center">No student data available</p>}
                    </div>
                </div>

                {/* Top Skills */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Top Skills Verified</h3>
                    <div className="flex flex-wrap gap-2">
                        {topSkills.map((skill, index) => (
                            <span
                                key={index}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium ${skillColors[index % skillColors.length]}`}
                            >
                                {skill.label} <span className="opacity-70 ml-1">{skill.value}</span>
                            </span>
                        ))}
                        {topSkills.length === 0 && <p className="text-sm text-muted-foreground">No skills data available</p>}
                    </div>
                </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedStudents.size > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                            {selectedStudents.size}
                        </span>
                        <span className="text-blue-700 dark:text-blue-400 font-medium text-sm">Students Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleBulkBlock('block')}
                            className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors"
                        >
                            <Ban className="w-4 h-4 text-red-500" />
                            <span>Block Selected</span>
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Selected</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Student Directory */}
            <div className="bg-card rounded-xl border border-border shadow-sm">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-foreground">Student Directory</h3>
                    <div className="flex gap-2">
                        {/* Status Filter */}
                        <div className="relative">
                            <button
                                onClick={() => setShowStatusFilter(!showStatusFilter)}
                                className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${selectedStatus !== 'All Status'
                                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                                    : 'border-border text-foreground hover:bg-accent'
                                    }`}
                            >
                                <Filter className="w-4 h-4" />
                                {selectedStatus}
                                <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                            </button>

                            {showStatusFilter && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowStatusFilter(false)}></div>
                                    <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-20 py-1">
                                        {['All Status', 'Placed', 'Seeking'].map((status) => (
                                            <button
                                                key={status}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-accent ${selectedStatus === status ? 'bg-accent font-medium' : ''}`}
                                                onClick={() => {
                                                    setSelectedStatus(status);
                                                    setShowStatusFilter(false);
                                                }}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Department Filter */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDeptFilter(!showDeptFilter)}
                                className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${selectedDept !== 'All Depts'
                                    ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                                    : 'border-border text-foreground hover:bg-accent'
                                    }`}
                            >
                                {selectedDept}
                                <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                            </button>

                            {showDeptFilter && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowDeptFilter(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-20 py-1 max-h-60 overflow-y-auto">
                                        {departments.map((dept) => (
                                            <button
                                                key={dept}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-accent ${selectedDept === dept ? 'bg-accent font-medium' : ''}`}
                                                onClick={() => {
                                                    setSelectedDept(dept);
                                                    setShowDeptFilter(false);
                                                }}
                                            >
                                                {dept}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <button
                            onClick={handleExport}
                            className="p-2 border border-border rounded-lg text-foreground hover:bg-accent"
                            title="Export to CSV"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <th className="p-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-transparent"
                                        checked={studentData.length > 0 && selectedStudents.size === studentData.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="p-4">Student Name</th>
                                <th className="p-4">Dept / Joined</th>
                                <th className="p-4">CGPA</th>
                                <th className="p-4">Skills</th>
                                <th className="p-4">Placement Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student._id} className={`hover:bg-accent/50 transition-colors ${student.isBlocked ? 'opacity-60 bg-red-50/10' : ''} ${selectedStudents.has(student._id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-transparent"
                                                checked={selectedStudents.has(student._id)}
                                                onChange={() => handleSelectStudent(student._id)}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt={student.name} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-medium text-foreground">{student.name}</div>
                                                        {student.isBlocked && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 rounded font-bold">BLOCKED</span>}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-sm font-medium text-foreground">{student.department}</div>
                                            <div className="text-xs text-muted-foreground">{new Date(student.joinedAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-block px-2 py-1 bg-green-50 text-green-700 dark:bg-green-700/15 dark:text-green-500 text-xs font-bold rounded">
                                                {student.cgpa || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-1 flex-wrap">
                                                {student.skills.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="px-2 py-0.5 border border-border rounded text-xs text-muted-foreground">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {student.skills.length > 3 && (
                                                    <span className="px-2 py-0.5 border border-border rounded text-xs text-muted-foreground">+{student.skills.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'Placed'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-700/15 dark:text-green-500'
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-700/15 dark:text-amber-500'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${student.status === 'Placed' ? 'bg-green-500' : 'bg-amber-500'
                                                    }`}></span>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right relative">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    className="p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    onClick={() => setEditingStudent(student)}
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>

                                                <div className="relative">
                                                    <button
                                                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActionMenuOpen(actionMenuOpen === student._id ? null : student._id);
                                                        }}
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>

                                                    {actionMenuOpen === student._id && (
                                                        <div className="absolute right-0 mt-1 w-36 bg-card border border-border rounded-lg shadow-lg z-10 py-1 origin-top-right">
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm hover:bg-accent flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                disabled={blockingId === student._id}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleToggleBlock(student._id, student.isBlocked);
                                                                    // Don't close immediately to show state change if desired, but UX suggests closing or updating. 
                                                                    // We close in finally block via logic in handler or here. 
                                                                    // Let's keep menu open during load or close it? 
                                                                    // Usually keeping it open to show spinner is better.
                                                                }}
                                                            >
                                                                {blockingId === student._id ? (
                                                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                                                                ) : student.isBlocked ? (
                                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                                ) : (
                                                                    <Ban className="w-3.5 h-3.5 text-red-500" />
                                                                )}
                                                                <span>
                                                                    {blockingId === student._id ? 'Updating...' : (student.isBlocked ? 'Unblock' : 'Block')}
                                                                </span>
                                                            </button>
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(student._id);
                                                                    setActionMenuOpen(null);
                                                                }}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                <span>Delete</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-muted-foreground">
                                        No students found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination placeholder */}
                <div className="p-4 border-t border-border flex justify-center">
                    <button className="text-sm text-muted-foreground hover:text-foreground font-medium">View All Students</button>
                </div>
            </div>

            <EditStudentModal
                student={editingStudent}
                isOpen={!!editingStudent}
                onClose={() => setEditingStudent(null)}
                onUpdate={fetchData}
            />

            <AddStudentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={fetchData}
            />
        </div>
    );
};

const AddStudentModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        universityRollNo: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/admin/students', formData);
            toast.success("Student added successfully");
            onAdd();
            onClose();
            setFormData({ name: '', email: '', password: '', department: '', universityRollNo: '' });
        } catch (err) {
            console.error("Error adding student:", err);
            toast.error(err.response?.data?.msg || "Failed to add student");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Add New Student</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Department</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                placeholder="e.g. CSE"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Roll No</label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.universityRollNo}
                                onChange={(e) => setFormData({ ...formData, universityRollNo: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-accent"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminStudents;
