const { analyzeProfile } = require('../utils/atsMatcher');

// MOCK DATA
const mockJob = {
    title: "MERN Stack Developer",
    description: "We need a full stack developer with experience in React, Node, and MongoDB. Must have done at least 2 projects.",
    required_skills: "react, node, mongodb, express, javascript"
};

const mockCandidate = {
    skills: ["react", "javascript", "css", "html"],
    degree: "B.Tech (CSE)",
    cgpa: 8.5
};

const mockProfile = {
    projects: [
        {
            title: "E-Commerce App",
            description: "Built a shopping cart using React and Redux." // Relevant (React matches)
        },
        {
            title: "Portfolio Website",
            description: "Personal site using HTML and CSS." // Not relevant to Node/Mongo
        },
        {
            title: "Task Manager",
            description: "MERN stack app with drag and drop." // Highly relevant (MERN, React, Node implcit)
        }
    ]
};

console.log("Running AI Analysis Test...\n");

const result = analyzeProfile(mockJob, mockCandidate, mockProfile);

console.log(JSON.stringify(result, null, 2));

if (result.match_score > 0 && result.relevant_projects.length > 0) {
    console.log("\nTEST PASSED: Analysis generated successfully.");
} else {
    console.log("\nTEST FAILED: Unexpected result.");
}
