const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY; // Support both names
let genAI = null;
let model = null;
let provider = 'unknown';

if (apiKey) {
    if (apiKey.startsWith('sk-')) {
        provider = 'openai';
        console.log("Detected OpenAI/OpenRouter API Key.");
    } else {
        provider = 'gemini';
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Detected Google Gemini API Key.");
    }
} else {
    console.warn("No API Key found. LLM features disabled.");
}

async function callOpenAI(prompt, isJson = false) {
    const isOpenRouter = apiKey.startsWith('sk-or-');
    const url = isOpenRouter
        ? "https://openrouter.ai/api/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";

    // Fallback to standard GPT-3.5 via OpenRouter if Gemini fails
    const modelName = isOpenRouter ? "openai/gpt-3.5-turbo" : "gpt-3.5-turbo";

    const messages = [{ role: "user", content: prompt }];
    if (isJson) {
        messages.unshift({ role: "system", content: "You are a helpful assistant that outputs strictly JSON." });
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            ...(isOpenRouter && { "HTTP-Referer": "http://localhost:5000", "X-Title": "Placemate" })
        },
        body: JSON.stringify({
            model: modelName,
            messages: messages,
            response_format: isJson ? { type: "json_object" } : undefined
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI/Router API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

/**
 * Generate content using Gemini
 * @param {string} prompt 
 * @returns {Promise<string>}
 */
exports.generateContent = async (prompt) => {
    if (provider === 'openai') {
        return await callOpenAI(prompt);
    }
    if (!model) throw new Error("LLM not initialized");

    const result = await model.generateContent(prompt);
    return (await result.response).text();
};

/**
 * Generate JSON content using Gemini (forcing JSON structure)
 * @param {string} prompt 
 * @returns {Promise<Object>}
 */
exports.generateJSON = async (prompt) => {
    if (provider === 'openai') {
        const text = await callOpenAI(prompt, true);
        try {
            return JSON.parse(text);
        } catch (e) {
            // Try to extract JSON if raw text
            const match = text.match(/\{[\s\S]*\}/);
            if (match) return JSON.parse(match[0]);
            throw e;
        }
    }

    if (!model) throw new Error("LLM not initialized");

    const jsonPrompt = `${prompt}\n\nReturn the result ONLY as a valid JSON object. Do not include markdown formatting.`;
    const result = await model.generateContent(jsonPrompt);
    let text = (await result.response).text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
};
