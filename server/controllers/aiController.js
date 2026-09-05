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

        const [user, profile, applications, jobs] = await Promise.all([
            User.findById(userId).select('name email role'),
            StudentProfile.findOne({ user: userId }).select('+resumeText'), // Explicitly select resumeText
            Application.find({ student: userId }).populate('job', 'title company status').sort('-createdAt').limit(5),
            // FETCH ALL RELEVANT JOBS (Limit increased to 50 for better matching)
            Job.find({ status: 'Open' }).select('title company skills location description salary').sort('-createdAt').limit(50)
        ]);

        return {
            user,
            profile,
            applications,
            jobs
        };
    } catch (error) {
        console.error("Error building AI context:", error);
        return null;
    }
};

// Construct common system context
const getSystemContext = (globalContext) => {
    let context = 'You are a professional AI Career Coach for engineering students.\n';
    context += 'Use the student\'s real-time profile data from the database.\n';
    context += 'Always give practical, realistic career advice.\n';
    context += 'Your goal is to help the student get placed.\n';
    context += 'Respond like a real placement consultant.\n';

    if (globalContext) {
        const { user, profile, applications, jobs } = globalContext;

        if (user) {
            context += `\nUSER DETAILS:\nName: ${user.name}\nRole: ${user.role}\n`;
        }

        if (profile) {
            context += `\nSTUDENT PROFILE:\n`;
            if (profile.skills) context += `Skills: ${safeJoin(profile.skills)}\n`;
            if (profile.education) context += `Education: ${JSON.stringify(profile.education)}\n`;
            if (profile.cgpa) context += `CGPA: ${profile.cgpa}\n`;

            // Resume Context & Flag
            // Check if ANY content exists (even fallback text)
            const resumeAvailable = profile.resumeText && profile.resumeText.length > 10;

            if (resumeAvailable) {
                context += `\n=== RESUME STATUS: UPLOADED AND AVAILABLE ===\n`;
                context += `(The student has uploaded their resume. DO NOT ASK THEM TO UPLOAD IT AGAIN.)\n`;
                context += `RESUME CONTENT:\n${profile.resumeText.substring(0, 8000)}\n=== END RESUME CONTENT ===\n`;
            } else {
                context += `\n(No resume uploaded yet. You may ask the student to upload their resume for better analysis.)\n`;
            }

            if (profile.experience && Array.isArray(profile.experience)) context += `Experience: ${JSON.stringify(profile.experience)}\n`;
            if (profile.projects && Array.isArray(profile.projects)) context += `Projects: ${JSON.stringify(profile.projects)}\n`;
        } else {
            context += `\nPROFILE STATUS: Incomplete. Ask the student to complete their profile for better advice.\n`;
        }

        if (Array.isArray(applications) && applications.length > 0) {
            context += `\nRECENT APPLICATIONS:\n`;
            applications.forEach(app => {
                if (app.job) {
                    context += `- ${app.job.title} at ${app.job.company} (${app.status})\n`;
                }
            });
        }

        if (Array.isArray(jobs) && jobs.length > 0) {
            context += `\nAVAILABLE JOBS DATABASE (${jobs.length} jobs loaded):\n`;
            // Pass minimal details to save tokens but allow matching
            jobs.forEach(job => {
                context += `- ID: ${job._id} | Role: ${job.title} | Co: ${job.company} | Loc: ${job.location} | Skills: ${safeJoin(job.skills)}\n`;
            });
        }
    }

    return context;
};

// Helper to handle OpenRouter API calls with automatic multi-model failover
const callOpenRouter = async (messages, res) => {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();

    console.log("---------------------------------------------------");
    console.log("AI REQUEST STARTED");
    console.log("Key available:", !!apiKey);

    if (!apiKey) {
        console.error('OPENROUTER_API_KEY is missing');
        return res.json({ reply: "(System Error): Please configure a valid API key in server/.env." });
    }

    const CANDIDATE_MODELS = [
        'google/gemma-4-31b-it:free',
        'minimax/minimax-m3:free',
        'cohere/north-mini-code:free',
        'inclusionai/ling-3.0-flash-sante:free',
        'dots-studio/dots-3-note-preview:free'
    ];

    let lastError = null;

    for (const model of CANDIDATE_MODELS) {
        try {
            console.log(`Attempting OpenRouter request with model: ${model}`);
            const response = await axios.post(
                'https://openrouter.ai/api/v1/chat/completions',
                {
                    model: model,
                    messages: messages,
                    max_tokens: 1500,
                    temperature: 0.7,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );

            console.log(`AI RESPONSE RECEIVED (${model}) status:`, response.status);
            const reply = response.data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
            return res.json({ reply });

        } catch (error) {
            lastError = error;
            const status = error.response?.status;
            const msg = error.response?.data?.error?.message || error.message;
            console.warn(`[AI Failover] Model ${model} failed (${status}): ${msg}. Trying next model...`);
        }
    }

    console.error("---------------------------------------------------");
    console.error('ALL AI MODELS EXHAUSTED OR FAILED:', lastError?.message);
    if (lastError?.response) {
        console.error('STATUS:', lastError.response.status);
        console.error('DATA:', JSON.stringify(lastError.response.data));
    }
    console.error("---------------------------------------------------");

    const errorMessage = lastError?.response?.data?.error?.message || lastError?.message || "Rate limited or service unavailable";
    res.json({ reply: `(AI Rate Limit / Offline): Unable to reach LLM providers upstream (${errorMessage}). Please try again in a few moments!` });
};

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        const globalContext = await buildGlobalContext(req);
        const systemPrompt = getSystemContext(globalContext);

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
        const globalContext = await buildGlobalContext(req);

        let systemPrompt = getSystemContext(globalContext);
        systemPrompt += `\nTASK: Perform a detailed Resume Analysis based on the DB profile and UPLOADED RESUME CONTENT.\n`;
        systemPrompt += `If the resume content is partial or a system note, assume the user has valid capabilities and infer from their profile skills/projects.\n`;
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
        const globalContext = await buildGlobalContext(req);

        let systemPrompt = getSystemContext(globalContext);
        systemPrompt += `\nTASK: Match the student's profile (including RESUME CONTENT) against the AVAILABLE JOBS DATABASE provided above.\n`;
        systemPrompt += `CRITICAL INSTRUCTION: You MUST suggest at least 5-10 suitable jobs from the database list.\n`;
        systemPrompt += `If exact matches are low, suggest related roles or jobs that are a slightly stretch but relevant.\n`;
        systemPrompt += `Do NOT restrict your answer to only 2-3 jobs. Use the full list provided.\n`;
        systemPrompt += `Output format: Markdown list with Match Score (%), Job Title, Company, and a short 1-sentence explanation of why it fits.\n`;
        systemPrompt += `Also suggest 1-2 upskilling recommendations if they help qualify for better roles.`;

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
        const globalContext = await buildGlobalContext(req);

        let systemPrompt = getSystemContext(globalContext);
        systemPrompt += `\nTASK: Create a 6-month Career Roadmap based on the student's current year, skills, and RESUME CONTENT.\n`;
        systemPrompt += `Focus on filling skill gaps for the Open Campus Jobs listed in the database.\n`;
        systemPrompt += `Output format: Markdown timeline.`;

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
    // 1. Initial Validation (Always 200)
    if (!req.file) {
        return res.json({
            success: false,
            message: "No file received. Please select a document to upload.",
            extractedLength: 0,
            fallbackUsed: false
        });
    }

    const fs = require('fs');
    let extractedText = "";
    let fallbackUsed = false;
    let fallbackReason = "";

    try {
        console.log(`[AI Upload] Processing: ${req.file.originalname} (${req.file.mimetype}) | Size: ${req.file.size} bytes`);

        // 2. Validate File Type (Manually to strictly control response)
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

        // 3. Lazy Load Parsers
        let pdfParse, mammoth;
        try {
            if (isPdf) pdfParse = require('pdf-parse');
            if (isDocx) mammoth = require('mammoth');
        } catch (depError) {
            console.warn("[AI Upload] Dependency missing:", depError.message);
            // Don't crash, just trigger fallback
            throw new Error("Parser dependencies unavailable.");
        }

        // 4. Safe Parsing
        const buffer = fs.readFileSync(req.file.path);

        if (isPdf) {
            const data = await pdfParse(buffer);
            extractedText = data.text;
        } else if (isDocx) {
            const result = await mammoth.extractRawText({ path: req.file.path });
            extractedText = result.value;
        }

        // Clean text
        extractedText = extractedText.replace(/\s+/g, ' ').trim();

        // 5. Validation of Extracted Content
        if (!extractedText || extractedText.length < 50) {
            throw new Error("Extracted text is too short or empty.");
        }

        console.log(`[AI Upload] Success. Extracted ${extractedText.length} chars.`);

    } catch (error) {
        console.warn(`[AI Upload] Parsing failed/incomplete: ${error.message}. Switching to FALLBACK mode.`);
        console.error("[AI Upload] FULL ERROR STACK:", error.stack); // Added for debugging
        fallbackUsed = true;
        fallbackReason = error.message;

        // 6. Generate Contextual Fallback
        // mimic a summary so AI knows a file exists
        extractedText = `[SYSTEM NOTE: The user uploaded a file named "${req.file.originalname}". The system could not fully extract text from it (Reason: ${error.message}). However, treat this as valid context that the user HAS provided a document. If asked, tell the user you are aware of the file "${req.file.originalname}" but might need them to copy-paste key details if specific questions come up.]`;
    } finally {
        // 7. Cleanup (Crucial)
        try {
            if (req.file && req.file.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        } catch (cleanupErr) {
            console.error("[AI Upload] Cleanup failed:", cleanupErr);
        }
    }

    // 8. Role-Aware Storage
    // Only store for students as per requirements
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
        // Do not fail the request if DB save fails, just note it
    }

    // 9. Final Response (ALWAYS 200, JSON)
    let userMessage = "Document processed successfully! I've analyzed it.";
    if (fallbackUsed) {
        userMessage = "I couldn't fully read the document details, but I can still analyze it based on what I see.";
    }

    return res.json({
        success: true, // Always true unless big system failure, but here we handled errors
        message: userMessage,
        extractedLength: extractedText.length,
        fallbackUsed: fallbackUsed,
        debugError: fallbackReason // For dev visibility if needed
    });
};
