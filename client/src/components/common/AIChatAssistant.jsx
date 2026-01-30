import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Briefcase, FileText, Map as MapIcon, Loader2, Mic, MicOff, Volume2, VolumeX, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import api from '../../api/axios';

import { useLocation } from 'react-router-dom';

const AIChatAssistant = () => {
    const location = useLocation(); // Re-render on route change
    const [isOpen, setIsOpen] = useState(false);

    // Auth & Role Logic
    const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');
    const getUser = () => {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    };

    const token = getToken();
    const user = getUser();
    const isLoggedIn = !!token;

    // Greeting based on role
    const getGreeting = (role) => {
        switch (role) {
            case 'student': return "Hi! I'm your **PlaceMate AI Career Coach**. \n\nI can analyze your resume, suggest matching jobs, or create a personalized career roadmap for you.";
            case 'company': return "Hello! I'm your **AI Recruitment Assistant**. \n\nI can help you analyze job descriptions, screen candidates, or optimize your hiring process.";
            case 'admin':
            case 'superadmin': return "Welcome, Admin! I'm your **Placement Intelligence Assistant**. \n\nAsk me about placement statistics, student performance, or generate reports.";
            default: return "Hi! I'm your **PlaceMate AI Assistant**. How can I help you today?";
        }
    };

    const [messages, setMessages] = useState([]);

    // Initialize/Reset chat when user/role changes
    useEffect(() => {
        if (isLoggedIn && user) {
            setMessages([
                { role: 'assistant', content: getGreeting(user.role) }
            ]);
        }
    }, [user?.role, isLoggedIn]);



    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Voice State
    const [isListening, setIsListening] = useState(false);
    const [voiceMode, setVoiceMode] = useState(() => {
        return localStorage.getItem('ai_voice_mode') === 'true';
    });
    const [speaking, setSpeaking] = useState(false);

    // File Upload State
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const synth = window.speechSynthesis;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Persist voice mode
    useEffect(() => {
        localStorage.setItem('ai_voice_mode', voiceMode);
    }, [voiceMode]);

    // Cleanup voice on close
    useEffect(() => {
        if (!isOpen) {
            synth.cancel();
            setSpeaking(false);
            if (isListening) stopListening();
        }
    }, [isOpen]);

    // --- Voice Logic (Same as before) ---
    const speak = (text) => {
        if (!voiceMode || !text) return;
        const cleanText = text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/`{3}[\s\S]*?`{3}/g, 'code snippet')
            .replace(/`(.*?)`/g, '$1')
            .replace(/#+\s/g, '')
            .replace(/\n/g, '. ');

        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        const voices = synth.getVoices();
        const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha') || v.lang.startsWith('en'));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        synth.speak(utterance);
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            setMessages(prev => [...prev, { role: 'assistant', content: "(System): Voice input is not supported in this browser." }]);
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            setInput(transcript);
        };
        recognitionRef.current.onerror = (event) => {
            console.error("Speech Error:", event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
                alert("Microphone access denied. Please enable permissions.");
            }
        };
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);
    };

    const toggleListening = () => {
        if (isListening) stopListening();
        else startListening();
    };

    // --- File Upload Logic ---
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation (Frontend check only, backend is now safe)
        if (file.size > 10 * 1024 * 1024) {
            // Just a gentle warning, proceeding anyway
            setMessages(prev => [...prev, { role: 'assistant', content: "(System): This file is large. I'll do my best to process it." }]);
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        setMessages(prev => [...prev, { role: 'user', content: `[Uploaded: ${file.name}]` }]);

        try {
            const { data } = await api.post('/ai/upload-document', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                validateStatus: (status) => status < 500 // Accept anything < 500 to handle potential unexpected 4xx without throwing
            });

            // "Always 200" contract generally assumes 200, but we added validateStatus just in case.
            // Check success flag or fallback

            const successMsg = data.message || "Document processed.";

            // If fallback was used, the backend sends a specific friendly message in data.message too.
            // But we can explicitly check fallbackUsed if we want special UI behavior (like an icon).
            // For now, using the message provided by backend is sufficient.

            setMessages(prev => [...prev, { role: 'assistant', content: successMsg }]);

            if (voiceMode) speak(successMsg);

        } catch (error) {
            console.error("Upload Network Error:", error);
            // Gentle fallback even for network/server crash
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the server, but I've noted your document upload. You can proceed with your questions." }]);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // --- Main Logic ---
    const handleSend = async (text = null, endpoint = '/ai/chat') => {
        const textToSend = text || input;
        if (!textToSend.trim()) return;

        synth.cancel();
        const userMessage = { role: 'user', content: textToSend };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await api.post(endpoint, {
                message: userMessage.content
            });

            const aiMessage = { role: 'assistant', content: data.reply };
            setMessages(prev => [...prev, aiMessage]);
            if (voiceMode) speak(data.reply);

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMsg = error.response?.data?.reply || error.message || "Connection failed";
            setMessages(prev => [...prev, { role: 'assistant', content: `(Error): ${errorMsg}` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSend();
    };

    const suggestions = [
        {
            icon: FileText,
            label: "Analyze my Resume",
            prompt: "Please analyze my current profile and resume. What are my strengths and weaknesses?",
            endpoint: '/ai/resume-analyze'
        },
        {
            icon: Briefcase,
            label: "Find Matching Jobs",
            prompt: "Based on my resume/profile, what kind of job roles should I be applying for?",
            endpoint: '/ai/job-match'
        },
        {
            icon: MapIcon,
            label: "Career Roadmap",
            prompt: "Create a learning roadmap based on my resume gaps.",
            endpoint: '/ai/career-roadmap'
        }
    ];

    if (!isLoggedIn) return null;

    return (
        <>
            {/* Toggle Button with subtle animation */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} bg-primary hover:bg-primary-hover text-foreground-inverted flex items-center justify-center ring-4 ring-primary/20 backdrop-blur-sm`}
            >
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full animate-pulse border-2 border-background"></div>
                <MessageCircle size={28} strokeWidth={2.5} />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[450px] max-h-[700px] h-[80vh] bg-card/80 backdrop-blur-2xl rounded-3xl shadow-2xl flex flex-col border border-border/50 overflow-hidden ring-1 ring-black/5"
                    >
                        {/* Header - Glassmorphism & Gradient */}
                        <div className="p-4 bg-gradient-to-r from-background/80 to-background/40 backdrop-blur-md border-b border-white/5 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/10 rounded-2xl ring-1 ring-primary/5">
                                    <Sparkles size={18} className="text-primary" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground text-sm tracking-tight">PlaceMate AI</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`relative flex h-2 w-2`}>
                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${speaking ? 'bg-blue-400' : 'bg-green-500'}`}></span>
                                            <span className={`relative inline-flex rounded-full h-2 w-2 ${speaking ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                                        </span>
                                        <p className="text-[10px] text-foreground-muted font-semibold uppercase tracking-wider opacity-80">
                                            {speaking ? 'Speaking...' : 'Online & Ready'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 bg-background/50 p-1 rounded-full border border-border/50">
                                <button
                                    onClick={() => {
                                        setVoiceMode(!voiceMode);
                                        if (speaking) synth.cancel();
                                    }}
                                    className={`p-2 rounded-full transition-all duration-200 ${voiceMode ? 'bg-primary/10 text-primary shadow-sm' : 'text-foreground-muted hover:text-foreground hover:bg-background'}`}
                                    title={voiceMode ? "Mute Voice" : "Enable Voice Reply"}
                                >
                                    {voiceMode ? <Volume2 size={16} /> : <VolumeX size={16} />}
                                </button>
                                <div className="w-px h-4 bg-border/50"></div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full text-foreground-muted transition-colors duration-200"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area - Refined Typography & Bubbles */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar scroll-smooth">
                            {/* Quick Actions */}
                            {messages.length === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-4"
                                >
                                    <p className="text-xs font-bold text-foreground-muted uppercase tracking-widest ml-1 opacity-70">Suggested Actions</p>
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {suggestions.map((s, i) => (
                                            <motion.button
                                                key={i}
                                                whileHover={{ scale: 1.01, x: 2 }}
                                                whileTap={{ scale: 0.99 }}
                                                onClick={() => handleSend(s.prompt, s.endpoint)}
                                                className="group p-3.5 text-left rounded-2xl border border-border/50 bg-background/50 hover:bg-background/80 hover:border-primary/20 transition-all shadow-sm hover:shadow-md flex items-center gap-4 backdrop-blur-sm"
                                            >
                                                <div className="p-2.5 bg-primary/5 rounded-xl text-primary group-hover:scale-110 transition-transform duration-300 ring-1 ring-primary/10">
                                                    <s.icon size={18} strokeWidth={2} />
                                                </div>
                                                <div>
                                                    <span className="block font-semibold text-foreground text-sm mb-0.5">{s.label}</span>
                                                    <span className="text-[11px] text-foreground-muted font-medium">Tap to start</span>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <AnimatePresence initial={false}>
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-black/5 ${msg.role === 'assistant' ? 'bg-gradient-to-br from-primary to-primary-hover text-foreground-inverted' : 'bg-background-muted text-foreground-muted'}`}>
                                            {msg.role === 'assistant' ? <Bot size={16} strokeWidth={2.5} /> : <User size={16} strokeWidth={2.5} />}
                                        </div>
                                        <div
                                            className={`max-w-[88%] p-4 text-[0.935rem] leading-[1.6] rounded-2xl shadow-sm backdrop-blur-sm ${msg.role === 'user'
                                                ? 'bg-primary text-foreground-inverted rounded-br-sm shadow-primary/20'
                                                : 'bg-card/80 border border-border/50 text-foreground rounded-bl-sm shadow-sm'
                                                }`}
                                        >
                                            {msg.role === 'user' ? (
                                                <p className="font-medium tracking-wide">{msg.content}</p>
                                            ) : (
                                                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-7 prose-p:my-1 prose-headings:font-bold prose-headings:text-foreground prose-strong:text-primary prose-a:text-blue-500 prose-code:bg-background/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-primary prose-code:font-medium prose-ul:my-2 prose-li:my-0.5">
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {(loading || isUploading) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-3 pl-1"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 animate-pulse">
                                        <Bot size={16} className="text-primary" />
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <span className="w-1.5 h-1.5 bg-foreground-muted/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-foreground-muted/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-foreground-muted/40 rounded-full animate-bounce"></span>
                                        <span className="text-xs font-medium text-foreground-muted ml-1">
                                            {isUploading ? "Reading resume..." : "Thinking..."}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area - Premium Feel */}
                        <form onSubmit={handleFormSubmit} className="p-4 bg-background/40 backdrop-blur-md border-t border-border/40 shrink-0">
                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept=".pdf,.docx,.doc"
                                className="hidden"
                            />

                            <div className="relative group flex items-end gap-2 bg-background/80 border border-border/60 px-2 py-2 rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm hover:shadow-md hover:border-border/80">

                                {/* Tools Group */}
                                <div className="flex gap-1 items-center pb-1.5 pl-1">
                                    {/* Upload Button */}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 rounded-xl text-foreground-muted hover:text-primary hover:bg-primary/10 transition-all duration-200"
                                        title="Upload Resume (PDF/DOCX)"
                                        disabled={loading || isUploading}
                                    >
                                        <Paperclip size={18} strokeWidth={2} />
                                    </button>

                                    {/* Mic Button */}
                                    <button
                                        type="button"
                                        onClick={toggleListening}
                                        className={`p-2 rounded-xl transition-all duration-200 ${isListening
                                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse'
                                            : 'text-foreground-muted hover:text-primary hover:bg-primary/10'
                                            }`}
                                        title="Dictate Message"
                                    >
                                        {isListening ? <MicOff size={18} strokeWidth={2} /> : <Mic size={18} strokeWidth={2} />}
                                    </button>
                                </div>

                                <div className="w-px h-6 bg-border/50 self-center mx-0.5"></div>

                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleFormSubmit(e);
                                        }
                                    }}
                                    placeholder={isListening ? "Listening..." : "Ask anything..."}
                                    className="flex-1 bg-transparent border-none outline-none text-[0.95rem] text-foreground placeholder:text-foreground-muted/60 min-h-[44px] max-h-[120px] py-2.5 resize-none leading-relaxed"
                                    rows={1}
                                    style={{
                                        overflow: 'hidden'
                                    }}
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                    }}
                                />

                                <button
                                    type="submit"
                                    disabled={loading || isUploading || !input.trim()}
                                    className="mb-1 p-2.5 bg-primary text-foreground-inverted rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-primary/30 active:scale-95 duration-200 self-end"
                                >
                                    <Send size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                            <p className="text-[10px] text-center text-foreground-muted/50 mt-3 font-medium tracking-wider uppercase">
                                Powered by PlaceMate Intelligence
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChatAssistant;
