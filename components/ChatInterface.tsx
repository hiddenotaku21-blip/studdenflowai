import React, { useState, useRef, useEffect } from 'react';
import { chatWithSensei } from '../services/geminiService';
import { Send, Zap, Brain, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: "Hey! StudenFlow-chan here! Need help with a quick algo or a deep theory? Choose your mode below! ✨" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [useLite, setUseLite] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // Transform internal history to Gemini format
            const history = messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            const result = await chatWithSensei(input, history, useLite);
            const modelMsg: ChatMessage = { role: 'model', text: result.response.text() };
            
            setMessages(prev => [...prev, modelMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Sensei tripped over a cable! Try again! 😵‍💫" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto h-[70vh] flex flex-col bg-anime-card/80 backdrop-blur rounded-2xl border border-anime-purple/30 shadow-2xl overflow-hidden mt-6 animate-fade-in-up">
            
            {/* Header / Controls */}
            <div className="bg-anime-dark p-4 flex justify-between items-center border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <span className="text-white font-anime text-lg">Chat with Sensei</span>
                </div>
                
                <div className="flex bg-gray-900 rounded-full p-1 border border-gray-700">
                    <button 
                        onClick={() => setUseLite(false)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${!useLite ? 'bg-anime-pink text-white shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Brain size={14} /> Pro (Smart)
                    </button>
                    <button 
                        onClick={() => setUseLite(true)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${useLite ? 'bg-anime-cyan text-anime-dark shadow' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Zap size={14} /> Lite (Fast)
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${
                            msg.role === 'user' 
                            ? 'bg-anime-purple text-anime-dark rounded-tr-none' 
                            : 'bg-gray-700 text-gray-100 rounded-tl-none border border-gray-600'
                        }`}>
                            <div className="flex items-center gap-2 mb-1 opacity-70 text-xs font-bold uppercase">
                                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                {msg.role === 'user' ? 'You' : 'Sensei'}
                            </div>
                            <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-700 text-gray-300 rounded-2xl rounded-tl-none p-4 flex gap-2 items-center">
                            <div className="w-2 h-2 bg-anime-cyan rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-anime-pink rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-anime-purple rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 bg-anime-dark border-t border-gray-700">
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={useLite ? "Ask a quick question..." : "Ask complex theory..."}
                        className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-600 focus:border-anime-cyan focus:outline-none transition-colors"
                        disabled={loading}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="bg-anime-cyan hover:bg-anime-cyan/80 text-anime-dark rounded-xl px-4 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;