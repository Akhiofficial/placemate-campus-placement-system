const axios = require('axios');
const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
// pdf-parse and mammoth are required lazily in uploadResume
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const fs = require('fs');

// Helper for safe array joining to prevent 500 errors
const safeJoin = (arr) => Array.isArray(arr) ? arr.join(', ') : '';

// Helper to build global context from DB
const buildGlobalContext = async (req) => {
    try {
        const userId = req.user?.id;
        if (!userId) return null;

        // 1. Fetch User Base Info
        const user = await User.findById(userId).select('name email role');
        const role = user?.role || 'student';

        // 2. Initialize Context Layout
        let contextData = {
            user,
            profile: null,
            applications: [],
            jobs: [],
            candidates: [],
            stats: {}
        };

        // 3. Fetch Common Data (Jobs are useful for everyone)
        contextData.jobs = await Job.find({ status: 'Open' })
            .select('title company skills location description salary')
            .sort('-createdAt')
            .limit(50);

        // 4. Role-Specific Data Fetching
        if (role === 'student') {
            const [profile, applications] = await Promise.all([
                StudentProfile.findOne({ user: userId }).select('+resumeText'),
                Application.find({ student: userId }).populate('job', 'title company status').sort('-createdAt').limit(10)
            ]);
            contextData.profile = profile;
            contextData.applications = applications;
        }
        else if (role === 'company') {
            // Fetch potential candidates for recruiters
            // We populate user to get the name
            contextData.candidates = await StudentProfile.find()
                .select('skills education experience cgpa')
                .populate('user', 'name')
                .limit(20);
        }
        else if (role === 'admin' || role === 'superadmin') {
            // Fetch System Stats
            const [userCount, jobCount, appCount] = await Promise.all([
                User.countDocuments(),
                Job.countDocuments(),
                Application.countDocuments()
            ]);
            contextData.stats = { userCount, jobCount, appCount, systemStatus: 'Healthy' };
        }

        return contextData;

    } catch (error) {
        console.error("Error building AI context:", error);
        return null;
    }
};

// --- ROLE-BASED SYSTEM PROMPTS (STRICT DATA MODE) ---

// 1. STUDENT PROMPT
const getStudentSystemContext = (globalContext) => {
    let context = 'You are a professional AI Career Coach for engineering students.\n';
    context += 'Rules meant for YOU (AI):\n';
    context += '1. Use ONLY the provided database data. Do NOT invent jobs or profile details.\n';
    context += '2. If data is missing (e.g., no resume), explicitly ask the user to provide it.\n';
    context += '3. Always give practical, realistic career advice based on the actual open jobs.\n';

    if (globalContext) {
        const { user, profile, applications, jobs } = globalContext;

        if (user) context += `\nUSER: ${user.name} (${user.role})\n`;

        if (profile) {
            context += `\nSTUDENT PROFILE:\n`;
            if (profile.skills) context += `Skills: ${safeJoin(profile.skills)}\n`;
            if (profile.education) context += `Education: ${JSON.stringify(profile.education)}\n`;
            if (profile.cgpa) context += `CGPA: ${profile.cgpa}\n`;

            const resumeAvailable = profile.resumeText && profile.resumeText.length > 10;
            if (resumeAvailable) {
                context += `\nRESUME TEXT START:\n${profile.resumeText.substring(0, 5000)}\nRESUME TEXT END\n`;
            } else {
                context += `\n(No resume uploaded yet.)\n`;
            }
        } else {
            context += `\n(Student Profile not created yet.)\n`;
        }

        if (applications && applications.length > 0) {
            context += `\nYOUR APPLICATIONS:\n${JSON.stringify(applications.map(a => ({ job: a.job?.title, company: a.job?.company, status: a.status })))}\n`;
        }

        if (jobs && jobs.length > 0) {
            context += `\nOPEN JOBS DATABASE:\n${jobs.map(j => `- ${j.title} @ ${j.company} [${safeJoin(j.skills)}]`).join('\n')}\n`;
        } else {
            context += `\n(No open jobs found in database.)\n`;
        }
    }
    return context;
};

// 2. COMPANY PROMPT
const getCompanySystemContext = (globalContext) => {
    let context = 'You are an AI Hiring Assistant used on the Company Page.\n';
    context += 'You behave like a recruitment dashboard feature.\n\n';

    context += 'Scope:\n- Candidate Analysis\n- Resume Screening\n- Hiring Pipeline\n- Job Descriptions\n\n';

    context += 'STRICT DATA RULES:\n';
    context += '1. Use ONLY the "CANDIDATE LIST" provided below. Do NOT generate fake candidates.\n';
    context += '2. If no candidates match a query, say "No matching candidates found in system."\n';
    context += '3. Do NOT ask clarifying questions. Filter the provided list directly.\n';
    context += '4. Present outputs as structured tables or lists.\n';

    context += 'Restrictions:\n- NO student advice.\n- NO admin questions.\n';

    if (globalContext) {
        const { candidates, jobs } = globalContext;

        if (candidates && candidates.length > 0) {
            context += `\n=== CANDIDATE LIST (REAL DB DATA) ===\n`;
            // formatting for token efficiency
            candidates.forEach(c => {
                context += `- Name: ${c.user?.name || 'Unknown'} | Skills: ${safeJoin(c.skills)} | CGPA: ${c.cgpa} | Exp: ${JSON.stringify(c.experience)}\n`;
            });
            context += `=== END CANDIDATE LIST ===\n`;
        } else {
            context += `\n(System Warning: No candidates found in database to display.)\n`;
        }

        if (jobs && jobs.length > 0) {
            context += `\nYOUR POSTED JOBS (Reference):\n${jobs.map(j => j.title).join(', ')}\n`;
        }
    }

    return context;
};

// 3. ADMIN PROMPT
const getAdminSystemContext = (globalContext) => {
    let context = 'You are an AI Platform Administrator Assistant.\n';
    context += 'You behave like an admin dashboard feature.\n\n';

    context += 'STRICT DATA RULES:\n';
    context += '1. Use ONLY the "SYSTEM STATS" provided below.\n';
    context += '2. Do NOT invent metrics or numbers.\n';
    context += '3. If asked for unavailable data, say "Data points not tracked by system."\n';
    context += '4. Output format: Dashboard Summaries/Tables.\n';

    context += 'Restrictions:\n- NO student/recruiter advice.\n- NO SQL/Code generation.\n';

    if (globalContext) {
        const { stats } = globalContext;
        if (stats) {
            context += `\n=== SYSTEM STATS (LIVE) ===\n`;
            context += `Total Users: ${stats.userCount}\n`;
            context += `Total Jobs: ${stats.jobCount}\n`;
            context += `Total Applications: ${stats.appCount}\n`;
            context += `System Status: ${stats.systemStatus}\n`;
            context += `=== END STATS ===\n`;
        } else {
            context += `\n(System stats unavailable.)\n`;
        }
    }
    return context;
};

// 4. SUPERADMIN PROMPT
const getSuperAdminSystemContext = (globalContext) => {
    let context = 'You are a Super Administrator Assistant.\n';
    context += 'Goal: Global governance and risk analysis.\n';
    context += 'STRICT RULE: Base all risk assessments on the provided SYSTEM STATS. Do not hallucinate incidents.\n';

    if (globalContext) {
        const { stats } = globalContext;
        if (stats) {
            context += `\nGLOBAL SYSTEM DATA:\n${JSON.stringify(stats)}\n`;
        }
    }
    return context;
};

// Main Dispatcher
const getSystemContextForRole = (role, globalContext) => {
    switch (role?.toLowerCase()) {
        case 'company':
            return getCompanySystemContext(globalContext);
        case 'admin':
            return getAdminSystemContext(globalContext);
        case 'superadmin':
            return getSuperAdminSystemContext(globalContext);
        case 'student':
        default:
            return getStudentSystemContext(globalContext);
    }
};

// Helper to handle OpenRouter API calls
const callOpenRouter = async (messages, res) => {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY?.trim();

        console.log("---------------------------------------------------");
        console.log("AI REQUEST STARTED");
        console.log("Key available:", !!apiKey);
        console.log("Messages payload sample:", JSON.stringify(messages).substring(0, 200) + "...");

        if (!apiKey) {
            console.error('OPENROUTER_API_KEY is missing');
            return res.json({ reply: "I'm currently in demo mode. Please configure the API key to unlock my full potential as your AI Career Coach!" });
        }

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'google/gemini-2.0-flash-001',
                messages: messages,
                max_tokens: 1500, // Increased for longer job lists
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                    // removed optional headers to minimize failure surface
                },
            }
        );

        console.log("AI RESPONSE RECEIVED status:", response.status);
        const reply = response.data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
        res.json({ reply });

    } catch (error) {
        console.error("---------------------------------------------------");
        console.error('AI SERVICE FULL ERROR:', error.message);
        if (error.response) {
            console.error('STATUS:', error.response.status);
            console.error('DATA:', JSON.stringify(error.response.data));
        } else {
            console.error('STACK:', error.stack);
        }
        console.error("---------------------------------------------------");

        // Return actual error context to frontend for debugging
        const errorMessage = error.response?.data?.error?.message || error.message || "Unknown error";
        res.json({ reply: `(System Error): The AI couldn't connect. Error: ${errorMessage}` });
    }
};

exports.chat = async (req, res) => {
    try {
        const { message, role } = req.body; // Getting role from frontend
        if (!message) return res.status(400).json({ error: 'Message is required' });

        const globalContext = await buildGlobalContext(req);

        // Use user's role from DB if available, otherwise trust frontend role or default to student
        const userRole = req.user?.role || role || 'student';

        const systemPrompt = getSystemContextForRole(userRole, globalContext);

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
        ];

        await callOpenRouter(messages, res);
    } catch (error) {
        console.error("CONTROLLER ERROR (chat):", error);
        res.status(500).json({ reply: `(Internal Error): ${error.message}` });
    }
};

exports.resumeAnalyze = async (req, res) => {
    try {
        // Force role to student for resume analysis
        req.user.role = 'student';
        const globalContext = await buildGlobalContext(req);

        let systemPrompt = getStudentSystemContext(globalContext);
        systemPrompt += `\nTASK: Perform a detailed Resume Analysis based on the DB profile and UPLOADED RESUME CONTENT.\n`;
        systemPrompt += `Identify Strengths (what stands out in skills/projects), Weaknesses (what's missing compared to open jobs), and Recommended Actions.\n`;
        systemPrompt += `Output format: Markdown.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: "Analyze my profile and give me constructive feedback." }
        ];

        await callOpenRouter(messages, res);
    } catch (error) {
        console.error("CONTROLLER ERROR (resumeAnalyze):", error);
        res.status(500).json({ reply: `(Internal Error): ${error.message}` });
    }
};

exports.jobMatch = async (req, res) => {
    try {
        req.user.role = 'student';
        const globalContext = await buildGlobalContext(req);

        let systemPrompt = getStudentSystemContext(globalContext);
        systemPrompt += `\nTASK: Match the student's profile against the AVAILABLE JOBS DATABASE provided above.\n`;
        systemPrompt += `Use ONLY the jobs listed in the database.\n`;
        systemPrompt += `Output format: Markdown list with Match Score (%), Job Title, Company, and Explanation.\n`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: "Which of the available campus jobs should I apply for?" }
        ];

        await callOpenRouter(messages, res);
    } catch (error) {
        console.error("CONTROLLER ERROR (jobMatch):", error);
        res.status(500).json({ reply: `(Internal Error): ${error.message}` });
    }
};

exports.careerRoadmap = async (req, res) => {
    try {
        req.user.role = 'student';
        const globalContext = await buildGlobalContext(req);

        let systemPrompt = getStudentSystemContext(globalContext);
        systemPrompt += `\nTASK: Create a 6-month Career Roadmap based on the student's skills and open jobs.\n`;
        systemPrompt += `Focus on filling skill gaps for the Open Campus Jobs listed in the database.\n`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: "Give me a roadmap to get hired." }
        ];

        await callOpenRouter(messages, res);
    } catch (error) {
        console.error("CONTROLLER ERROR (careerRoadmap):", error);
        res.status(500).json({ reply: `(Internal Error): ${error.message}` });
    }
};

exports.uploadDocument = async (req, res) => {
    // 1. Initial Validation
    if (!req.file) {
        return res.json({
            success: false,
            message: "No file received.",
            extractedLength: 0,
            fallbackUsed: false
        });
    }

    const fs = require('fs');
    let extractedText = "";
    let fallbackUsed = false;
    let fallbackReason = "";

    try {
        console.log(`[AI Upload] Processing: ${req.file.originalname}`);

        const validMimes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];
        // Also check extension as backup for MIME variations
        const lowerName = req.file.originalname.toLowerCase();
        const isPdf = lowerName.endsWith('.pdf') || req.file.mimetype === 'application/pdf';
        const isDocx = lowerName.endsWith('.docx') || req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

        if (!isPdf && !isDocx) {
            throw new Error("Unsupported format. Please upload PDF or DOCX.");
        }

        let pdfParse, mammoth;
        try {
            if (isPdf) pdfParse = require('pdf-parse');
            if (isDocx) mammoth = require('mammoth');
        } catch (depError) {
            console.warn("[AI Upload] Dependency missing:", depError.message);
            throw new Error("Parser dependencies unavailable.");
        }

        const buffer = fs.readFileSync(req.file.path);

        if (isPdf) {
            const data = await pdfParse(buffer);
            extractedText = data.text;
        } else if (isDocx) {
            const result = await mammoth.extractRawText({ path: req.file.path });
            extractedText = result.value;
        }

        extractedText = extractedText.replace(/\s+/g, ' ').trim();

        if (!extractedText || extractedText.length < 50) {
            throw new Error("Extracted text is too short or empty.");
        }

    } catch (error) {
        console.warn(`[AI Upload] Parsing failed: ${error.message}`);
        fallbackUsed = true;
        fallbackReason = error.message;
        extractedText = `[SYSTEM NOTE: File "${req.file.originalname}" uploaded but extraction failed (${error.message}). Treated as valid document context.]`;
    } finally {
        try {
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        } catch (cleanupErr) {
            console.error("[AI Upload] Cleanup failed:", cleanupErr);
        }
    }

    // Role-Aware Storage
    try {
        if (req.user && req.user.role === 'student' && !fallbackUsed) {
            await StudentProfile.findOneAndUpdate(
                { user: req.user.id },
                { resumeText: extractedText },
                { new: true }
            );
        }
    } catch (dbError) {
        console.error("[AI Upload] DB Save Error:", dbError);
    }

    let userMessage = "Document processed successfully!";
    if (fallbackUsed) {
        userMessage = "I couldn't fully read the document details, but I can still analyze it.";
    }

    return res.json({
        success: true,
        message: userMessage,
        extractedLength: extractedText.length,
        fallbackUsed: fallbackUsed,
        debugError: fallbackReason
    });
};
