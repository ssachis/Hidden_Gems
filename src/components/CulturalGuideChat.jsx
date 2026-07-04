import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';
import { chatWithGuide } from '../services/geminiService';

export default function CulturalGuideChat({ destination, apiKey }) {
  const guide = destination.guideProfile;
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Initialize guide greeting
  useEffect(() => {
    setMessages([
      {
        id: 'greet',
        sender: 'guide',
        text: guide.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [destination.id]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const activeHistory = [...messages, userMsg].slice(-8); // Keep last 8 messages for context
      const replyText = await chatWithGuide(destination.id, activeHistory, apiKey);
      
      setMessages(prev => [...prev, {
        id: `guide-${Date.now()}`,
        sender: 'guide',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const SUGGESTED_PROMPTS = [
    "Tell me about local customs & etiquette",
    "What are some essential local phrases?",
    "Where do locals eat away from crowds?",
  ];

  return (
    <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 h-[500px] animate-fade-in">
      
      {/* Guide Profile Left Panel */}
      <div className="md:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-col items-center text-center justify-center space-y-3 h-full shadow-sm">
        <span className="text-5xl select-none filter drop-shadow-md animate-bounce" style={{ animationDuration: '4s' }}>
          {guide.avatar}
        </span>
        
        <div className="space-y-0.5">
          <h3 className="font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight leading-tight">
            {guide.name}
          </h3>
          <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
            {guide.title}
          </p>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans font-light">
          Ask me about local etiquette, customs, dialects, or historic stories of {destination.name}.
        </p>
      </div>

      {/* Chat Thread Panel */}
      <div className="md:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-between h-full shadow-sm overflow-hidden">
        
        {/* Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar Icon */}
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${
                msg.sender === 'user' 
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200' 
                  : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30'
              }`}>
                {msg.sender === 'user' ? '👤' : guide.avatar}
              </div>

              <div className="space-y-1">
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none border border-zinc-200/20'
                }`}>
                  {msg.text}
                </div>
                <p className={`text-[9px] text-zinc-400 font-mono ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5 max-w-[80%] mr-auto items-center">
              <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950 flex-shrink-0 flex items-center justify-center text-sm border border-emerald-100 dark:border-emerald-900/30">
                {guide.avatar}
              </div>
              <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips and Form Input */}
        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 space-y-3">
          
          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.map((promptText, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(promptText)}
                className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center gap-1 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {promptText}
              </button>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask ${guide.name} a question...`}
              className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-zinc-950 dark:text-zinc-100 transition-all placeholder:text-zinc-400"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 text-white p-2 rounded-xl transition-all shadow-sm flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
