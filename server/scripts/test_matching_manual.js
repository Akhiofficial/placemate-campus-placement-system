const { matchJobToCandidates, matchStudentToJobs } = require('../utils/atsMatcher');

// MOCK DATA

// 1. JOB TO STUDENTS SCENARIO
const mockJob = {
    job_id: "J101",
    role: "Frontend Developer",
    description: "Looking for a React developer with strong UI skills. B.Tech Computer Science preferred.",
    job_skills: ["React", "JavaScript", "CSS", "Redux"]
};

const mockCandidates = [
    {
        candidate_id: "S001",
        skills: ["React", "JavaScript", "CSS", "Node.js"], // High match
        degree: "B.Tech Computer Science",
        cgpa: "9.0",
        resume_summary: "Full stack developer"
    },
    {
        candidate_id: "S002",
        skills: ["Java", "Spring", "SQL"], // Low match
        degree: "B.Tech Mechanical",
        cgpa: "7.5",
        resume_summary: "Backend enthusiast"
    },
    {
        candidate_id: "S003",
        skills: ["React", "CSS"], // Partial match
        degree: "B.Sc CS",
        cgpa: "8.0",
        resume_summary: "Frontend beginner"
    }
];

// 2. STUDENT TO JOBS SCENARIO
const mockStudent = {
    student_id: "S001",
    skills: ["Python", "Django", "Machine Learning", "SQL"],
    degree: "M.Tech Data Science",
    cgpa: "8.5",
    resume_text: "Data Scientist with ML exp"
};

const mockJobs = [
    {
        job_id: "J201",
        job_title: "Data Scientist",
        job_description: "Build ML models.",
        required_skills: ["Python", "Machine Learning", "TensorFlow"]
    },
    {
        job_id: "J202",
        job_title: "Web Developer",
        job_description: "Build websites using PHP.",
        required_skills: ["PHP", "HTML", "CSS"]
    }
];

console.log("--------------------------------------------------");
console.log("TEST 1: JOB_TO_STUDENTS (Company View)");
console.log("--------------------------------------------------");
const rankings = matchJobToCandidates(mockJob, mockCandidates);
console.log(JSON.stringify(rankings, null, 2));

console.log("\n--------------------------------------------------");
console.log("TEST 2: STUDENT_TO_JOBS (Student View)");
console.log("--------------------------------------------------");
const recommendations = matchStudentToJobs(mockStudent, mockJobs);
console.log(JSON.stringify(recommendations, null, 2));
