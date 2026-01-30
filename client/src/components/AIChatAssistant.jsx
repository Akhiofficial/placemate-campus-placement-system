import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Briefcase, FileText, Lightbulb, Map, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import api from '../api/axios';

const AIChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your **PlaceMate AI Career Coach**. \n\nI can analyze your resume, suggest matching jobs, or create a personalized career roadmap for you.\n\nHow can I help you succeed today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (text = null, endpoint = '/ai/chat') => {
        const textToSend = text || input;
        if (!textToSend.trim()) return;

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
            prompt: "Please analyze my current profile/resume based on my skills and experience. What are my strengths and weaknesses?",
            endpoint: '/ai/resume-analyze'
        },
        {
            icon: Briefcase,
            label: "Find Matching Jobs",
            prompt: "Based on my skills, what kind of job roles should I be applying for?",
            endpoint: '/ai/job-match'
        },
        {
            icon: Map,
            label: "Career Roadmap",
            prompt: "Create a learning roadmap for me to get placed in a top product company.",
            endpoint: '/ai/career-roadmap'
        }
    ];

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl text-white transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center`}
            >
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
                <MessageCircle size={28} />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-6 right-6 z-50 w-[450px] max-h-[700px] h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700 overflow-hidden font-sans ring-1 ring-black/5"
                    >
                        {/* Header */}
                        <div className="p-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center shadow-md shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/20 rounded-lg">
                                    <Sparkles size={18} className="text-yellow-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">PlaceMate AI Coach</h3>
                                    <p className="text-[10px] text-blue-100 uppercase tracking-wider font-semibold">Pro Edition</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-gray-950/50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">

                            {/* Quick Actions (Always visible if fewer than 2 messages or explicitly requested?? Actually usually standard to hide after interaction but let's keep them if empty) */}
                            {messages.length === 1 && (
                                <div className="grid grid-cols-1 gap-2 mb-2">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Actions</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {suggestions.map((s, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSend(s.prompt, s.endpoint)}
                                                className={`p-3 text-left rounded-xl border border-blue-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-200 transition-all text-xs text-gray-600 dark:text-gray-300 shadow-sm flex flex-col gap-2 group ${i === 2 ? 'col-span-2' : ''}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                                        <s.icon size={16} />
                                                    </div>
                                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{s.label}</span>
                                                </div>
                                                <p className="text-[10px] text-gray-400 line-clamp-1">
                                                    {i === 0 && "Strengths, weaknesses & tips"}
                                                    {i === 1 && "Best roles for your skills"}
                                                    {i === 2 && "Month-by-month learning path"}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'assistant' ? 'bg-linear-to-br from-blue-500 to-indigo-600 text-white' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                        {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                                    </div>
                                    <div
                                        className={`max-w-[85%] p-3.5 text-sm rounded-2xl shadow-sm ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-bl-none prose prose-sm dark:prose-invert max-w-none'
                                            }`}
                                    >
                                        {msg.role === 'user' ? (
                                            <p>{msg.content}</p>
                                        ) : (
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({ node, ...props }) => <p className="text-lg font-bold mb-2" {...props} />,
                                                    h2: ({ node, ...props }) => <p className="text-base font-bold mb-1 mt-3" {...props} />,
                                                    h3: ({ node, ...props }) => <p className="text-sm font-bold mb-1 mt-2" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 my-2" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 my-2" {...props} />,
                                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                    strong: ({ node, ...props }) => <span className="font-bold text-blue-600 dark:text-blue-400" {...props} />,
                                                }}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0">
                                        <Bot size={18} />
                                    </div>
                                    <div className="px-4 py-3 bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 dark:border-gray-700">
                                        <div className="flex gap-2 items-center text-gray-500 text-xs font-medium">
                                            <Loader2 size={14} className="animate-spin text-blue-500" />
                                            Thinking...
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleFormSubmit} className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shrink-0">
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChatAssistant;
