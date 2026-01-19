import React from 'react';
import {
    Search,
    UserPlus,
    FileUp,
    Bell,
    Users,
    CheckCircle,
    Search as SearchIcon,
    GraduationCap,
    Filter,
    Download,
    Eye,
    Pencil,
    MoreHorizontal
} from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminStudents = () => {
    // Dummy Data for Stats
    const stats = [
        { label: 'Total Registered', value: '1,240', subtext: '100%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Placed Students', value: '850', subtext: '68.5%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
        { label: 'Looking for Job', value: '350', subtext: '28.2%', icon: SearchIcon, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        { label: 'Avg CGPA', value: '8.2', subtext: '/ 10.0', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    ];

    // Dummy Data for Charts
    const placementData = {
        labels: ['Placed', 'Seeking', 'Not Eligible'],
        datasets: [
            {
                data: [850, 350, 40],
                backgroundColor: ['#3B82F6', '#FBBF24', '#EF4444'],
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

    const demographics = [
        { label: 'Computer Science', value: 45 },
        { label: 'Information Tech', value: 25 },
        { label: 'Electronics (ECE)', value: 20 },
        { label: 'Mechanical', value: 10 },
    ];

    const topSkills = [
        { name: 'Python', percent: 85, color: 'bg-blue-100 text-blue-700 dark:bg-blue-700/15 dark:text-blue-500' },
        { name: 'Java', percent: 72, color: 'bg-green-100 text-green-700 dark:bg-green-700/15 dark:text-green-500' },
        { name: 'ReactJS', percent: 65, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700/15 dark:text-indigo-500' },
        { name: 'SQL', percent: 60, color: 'bg-orange-100 text-orange-700 dark:bg-orange-700/15 dark:text-orange-500' },
        { name: 'AWS', percent: 45, color: 'bg-slate-100 text-slate-700 dark:bg-slate-700/15 dark:text-slate-500' },
        { name: 'Node.js', percent: 40, color: 'bg-teal-100 text-teal-700 dark:bg-teal-700/15 dark:text-teal-500' },
        { name: 'C++', percent: 38, color: 'bg-pink-100 text-pink-700 dark:bg-pink-700/15 dark:text-pink-500' },
        { name: 'Figma', percent: 25, color: 'bg-purple-100 text-purple-700 dark:bg-purple-700/15 dark:text-purple-500' },
    ];

    // Dummy Data for Student List
    const students = [
        { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@campus.edu', roll: 'CS-2024-042', dept: 'Computer Science', cgpa: 9.2, skills: ['Python', 'React'], status: 'Placed', statusColor: 'bg-green-100 text-green-700 dark:bg-green-700/15 dark:text-green-500' },
        { id: 2, name: 'Michael Chen', email: 'm.chen@campus.edu', roll: 'IT-2024-108', dept: 'Info Tech', cgpa: 8.5, skills: ['Java', 'AWS'], status: 'Seeking', statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-700/15 dark:text-amber-500' },
        { id: 3, name: 'Jessica Wong', email: 'jess.w@campus.edu', roll: 'ECE-2024-015', dept: 'Electronics', cgpa: 7.8, skills: ['IoT', 'C++'], status: 'Interning', statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-700/15 dark:text-blue-500' },
        { id: 4, name: 'David Ross', email: 'd.ross@campus.edu', roll: 'ME-2024-089', dept: 'Mechanical', cgpa: 9.5, skills: ['AutoCAD'], status: 'Placed', statusColor: 'bg-green-100 text-green-700 dark:bg-green-700/15 dark:text-green-500' },
    ];

    return (
        <div className="space-y-6">
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
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add Student</span>
                    </button>
                    <button className="flex items-center gap-2 border border-border bg-card text-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors">
                        <FileUp className="w-4 h-4" />
                        <span className="hidden sm:inline">Import CSV</span>
                    </button>
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
                        <Doughnut data={placementData} options={placementOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-foreground">68%</span>
                            <span className="text-sm text-muted-foreground">Placed</span>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span className="text-muted-foreground">Placed (850)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                            <span className="text-muted-foreground">Seeking (350)</span>
                        </div>
                    </div>
                </div>

                {/* Demographics */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-foreground">Demographics</h3>
                        <button className="text-xs text-muted-foreground border border-border px-2 py-1 rounded hover:bg-accent">Department v</button>
                    </div>
                    <div className="space-y-4">
                        {demographics.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-foreground">{item.label}</span>
                                    <span className="text-muted-foreground">{item.value}%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${item.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Skills */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Top Skills Verified</h3>
                    <div className="flex flex-wrap gap-2">
                        {topSkills.map((skill, index) => (
                            <span
                                key={index}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium ${skill.color}`}
                            >
                                {skill.name} <span className="opacity-70 ml-1">{skill.percent}%</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Student Directory */}
            <div className="bg-card rounded-xl border border-border shadow-sm">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-foreground">Student Directory</h3>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent">
                            <Filter className="w-4 h-4" />
                            All Status
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm text-foreground hover:bg-accent">
                            All Depts
                        </button>
                        <button className="p-2 border border-border rounded-lg text-foreground hover:bg-accent">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <th className="p-4 w-10">
                                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-transparent" />
                                </th>
                                <th className="p-4">Student Name</th>
                                <th className="p-4">Roll No / Dept</th>
                                <th className="p-4">CGPA</th>
                                <th className="p-4">Skills</th>
                                <th className="p-4">Placement Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-accent/50 transition-colors">
                                    <td className="p-4">
                                        <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-transparent" />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt={student.name} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{student.name}</div>
                                                <div className="text-xs text-muted-foreground">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-foreground">{student.roll}</div>
                                        <div className="text-xs text-muted-foreground">{student.dept}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-block px-2 py-1 bg-green-50 text-green-700 dark:bg-green-700/15 dark:text-green-500 text-xs font-bold rounded">
                                            {student.cgpa}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-1 flex-wrap">
                                            {student.skills.map(skill => (
                                                <span key={skill} className="px-2 py-0.5 border border-border rounded text-xs text-muted-foreground">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.statusColor}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${student.statusColor.replace('bg-', 'bg-opac+ity-100 bg-').split(' ')[0].replace('100', '500')}`}></span>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination placeholder */}
                <div className="p-4 border-t border-border flex justify-center">
                    <button className="text-sm text-muted-foreground hover:text-foreground font-medium">View All Students</button>
                </div>
            </div>
        </div>
    );
};

export default AdminStudents;
