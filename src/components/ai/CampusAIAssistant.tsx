import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, User, CornerDownLeft, RefreshCcw, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { askCampusAI } from '../../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  source?: string;
  timestamp: string;
}

export const CampusAIAssistant: React.FC = () => {
  const { isAIAssistantOpen, setIsAIAssistantOpen, user, timetable, buses, assignments, campusStatus } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: `Hello ${user?.name.split(' ')[0] || 'Student'}! I'm **CampusOne AI**, your unified assistant. I'm connected to your live schedule, bus telemetry, attendance status, and campus facilities. How can I assist you today?`,
      source: 'campus-engine',
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'When is my next class?',
    'When is the next bus?',
    'What is my attendance?',
    'What assignments are due?',
    'Help me create a study plan.',
    'Where is CSE Block?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const context = {
        studentName: user?.name,
        department: user?.department,
        attendance: `${user?.attendance}%`,
        nextClass: `${timetable[0]?.subjectName} at ${timetable[0]?.startTime} in ${timetable[0]?.room}`,
        nextBus: `${buses[0]?.number} arriving in ${buses[0]?.etaMinutes} mins`,
        assignments: `${assignments.filter((a) => a.status === 'Pending').length} pending`,
        campusStatus
      };

      const res = await askCampusAI(textToSend, context);

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: res.reply,
        source: res.source,
        timestamp: 'Just now'
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'ai',
          text: "I'm having trouble connecting to the network right now. You can check your next class in the Study tab or live bus locations in Move.",
          source: 'offline-fallback',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAIAssistantOpen) {
    return (
      /* Floating AI Bubble in bottom corner */
      <button
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-2xl shadow-purple-600/40 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group ring-2 ring-purple-400/40"
        title="Open CampusOne AI Assistant"
      >
        <Bot size={22} className="group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline font-bold text-xs pr-1">CampusOne AI</span>
        <Sparkles size={14} className="text-cyan-300 animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-end sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0b1329] border border-slate-700/80 rounded-t-3xl sm:rounded-3xl w-full max-w-lg h-[85vh] sm:h-[640px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-purple-950/60 via-slate-900 to-[#0b1329] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 ring-1 ring-purple-400/30">
              <Bot size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">CampusOne AI</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Contextual university copilot</p>
            </div>
          </div>

          <button
            onClick={() => setIsAIAssistantOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot size={15} />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md shadow-cyan-600/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-line prose-sm">{msg.text}</div>
                {msg.source && (
                  <div className="mt-1.5 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Source: {msg.source}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-slate-400 text-xs py-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center animate-pulse">
                <Bot size={15} />
              </div>
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Consulting campus graph & Gemini...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pill Carousel */}
        <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 scrollbar-none">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 whitespace-nowrap transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Query Input Box */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about timetable, bus, attendance, campus..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white disabled:opacity-40 transition shadow-md shadow-cyan-500/20"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
