const { generateJSON } = require('../services/llmService');

/**
 * ATS Matching Engine
 * 
 * Uses LLM (Gemini) for intelligent matching, with heuristic fallback.
 */

// Helper to normalize strings
const normalize = (str) => (str ? str.toString().toLowerCase().trim() : "");

// Cleaner for matching (React.js -> react, Node.js -> node)
const cleanSkill = (str) => {
    let s = normalize(str);
    s = s.replace(/[^a-z0-9]/g, ''); // distinct special chars
    s = s.replace(/js$/, ''); // remove js suffix if present (reactjs -> react)
    return s;
};

const parseSkills = (skillsInput) => {
    if (!skillsInput) return [];
    if (Array.isArray(skillsInput)) return skillsInput.map(normalize);
    return skillsInput.split(',').map(normalize);
};

const calculateHeuristicScore = (job, candidate) => {
    const jobSkills = parseSkills(job.required_skills || job.skills);
    const candidateSkills = parseSkills(candidate.skills);

    // Create clean versions for comparison
    const cleanReq = jobSkills.map(s => ({ original: s, clean: cleanSkill(s) }));
    const cleanCand = candidateSkills.map(s => cleanSkill(s));

    const matched = [];
    const missing = [];

    cleanReq.forEach(req => {
        // specific check: exact match of cleaned strings
        if (cleanCand.includes(req.clean)) {
            matched.push(req.original);
        } else {
            missing.push(req.original);
        }
    });

    console.log(`[Heuristic] Job Clean: ${cleanReq.map(x => x.clean).join(',')}`);
    console.log(`[Heuristic] Cand Clean: ${cleanCand.join(',')}`);
    console.log(`[Heuristic] Matches: ${matched.length}`);

    const params = {
        score: Math.min(100, Math.round((matched.length / Math.max(jobSkills.length, 1)) * 100)),
        matched,
        missing
    };
    return params;
};


/**
 * MODE 1: JOB_TO_STUDENTS (Batch)
 * Note: Running LLM for batch candidates might be slow/expensive. 
 * For MVP, we iterate. For Prod, we'd batch prompts or vector search.
 */
const matchJobToCandidates = async (job, candidates) => {
    const results = [];

    for (const candidate of candidates) {
        try {
            // Construct Prompt
            const prompt = `
            You are an expert AI Recruiter and ATS system. Evaluate the compatibility of a candidate for a job.
            
            JOB DETAILS:
            Title: ${job.title}
            Description: ${job.description}
            Required Skills: ${job.required_skills}

            CANDIDATE PROFILE:
            Degree: ${candidate.degree}
            CGPA: ${candidate.cgpa}
            Skills: ${candidate.skills}
            
            Task:
            1. Analyze the semantic match between candidate skills/experience and job requirements (e.g., "React" matches "Frontend").
            2. Assign a match_score (0-100).
            3. Identify matched_skills and missing_skills.
            4. Provide a SHORT, professional reason (1 sentence).

            Output JSON format:
            {
                "match_score": number,
                "matched_skills": ["skill1", "skill2"],
                "missing_skills": ["skill3", "skill4"],
                "reason": "string"
            }
            `;

            const aiResult = await generateJSON(prompt);
            results.push({
                candidate_id: candidate.candidate_id || candidate.id || candidate._id,
                match_score: aiResult.match_score,
                matched_skills: aiResult.matched_skills,
                missing_skills: aiResult.missing_skills,
                reason: aiResult.reason
            });

        } catch (err) {
            console.error(`AI Match Failed for candidate ${candidate.id || 'unknown'}:`, err.message);
            // Fallback
            const heuristic = calculateHeuristicScore(job, candidate);
            results.push({
                candidate_id: candidate.id || candidate._id,
                match_score: heuristic.score,
                matched_skills: heuristic.matched,
                missing_skills: heuristic.missing,
                reason: "Heuristic match (AI unavailable)"
            });
        }
    }

    return results.sort((a, b) => b.match_score - a.match_score);
};

// Mode 2: Student to Jobs (Skipping detailed implementation for brevity, logic similar)
const matchStudentToJobs = async (student, jobs) => {
    // Re-use matchJobToCandidates logic inverted or iterate jobs
    // For now, returning empty or basic fallback
    return jobs.map(j => ({ job_id: j._id, match_score: 0, reason: "Not implemented yet" }));
};


/**
 * Detailed Profile Analysis (Single Candidate)
 */
const analyzeProfile = async (job, candidate, profile) => {
    try {
        const prompt = `
        Perform a detailed ATS analysis for the following candidate against the job description.

        JOB:
        Title: ${job.title}
        Requirements: ${job.requirements}
        Description: ${job.description}

        CANDIDATE:
        Degree: ${profile.major || profile.degree}
        CGPA: ${profile.cgpa}
        Skills: ${profile.skills.join(', ')}
        Projects: ${JSON.stringify(profile.projects?.map(p => p.title + ": " + p.description) || [])}
        Experience: ${JSON.stringify(profile.experience?.map(e => e.title + " at " + e.company) || [])}

        Return strictly JSON:
        {
            "match_score": number,
            "breakdown": { "skills": number, "cgpa": number, "degree": number },
            "strengths": ["string"],
            "weaknesses": ["string"],
            "relevant_projects": [{"title": "string", "relevance": number}],
            "matched_skills": ["string"],
            "missing_skills": ["string"],
            "summary": "string"
        }
        `;

        return await generateJSON(prompt);

    } catch (err) {
        console.error("AI Analysis Failed:", err);
        return {
            match_score: 0,
            breakdown: {},
            strengths: ["AI Analysis Failed"],
            weaknesses: ["Please try again later"],
            relevant_projects: [],
            matched_skills: [],
            missing_skills: []
        };
    }
};

module.exports = {
    matchJobToCandidates,
    matchStudentToJobs,
    analyzeProfile
};
