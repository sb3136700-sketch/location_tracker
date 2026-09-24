import React from 'react';
import {
  HelpCircle,
  X,
  CheckCircle2,
  Bus,
  ShieldAlert,
  BookOpen,
  Bot,
  Database,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HelpAboutModal: React.FC = () => {
  const { isAboutModalOpen, setIsAboutModalOpen, setActiveTab, login } = useApp();

  if (!isAboutModalOpen) return null;

  const demoSteps = [
    { num: '01', title: 'Student Authentication', desc: 'Login as Student (student@campusone.demo / student123) or Admin.' },
    { num: '02', title: 'Live Dashboard', desc: 'Inspect attendance (82%), next class timer, and live Bus 03 ETA.' },
    { num: '03', title: 'Move: Live Bus Telemetry', desc: 'Interactive Leaflet map, simulated GPS telemetry, and Haversine stop proximity (≤500m).' },
    { num: '04', title: 'Safety: Emergency SOS Hub', desc: '1-tap emergency beacon with GPS coordinates, hotline directory, and reference ID.' },
    { num: '05', title: 'Study: AI Study Planner', desc: 'Smart timetable and Gemini AI study plan generation for midterm exams.' },
    { num: '06', title: 'Campus Life: Lost & Found', desc: 'Intelligent AI text & location similarity matcher with percentage score.' },
    { num: '07', title: 'Campus Events & Calendar', desc: 'Register for hackathons & download standard .ics calendar appointments.' },
    { num: '08', title: 'CampusOne AI Assistant', desc: 'Context-aware Gemini university chatbot answering schedule and campus questions.' },
    { num: '09', title: 'Admin Operations Console', desc: 'Fleet control, attendance risk list, broadcast circular publisher, and incident logs.' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1329] border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950/60 via-slate-900 to-[#0b1329] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-cyan-500/20">
              C1
            </div>
            <div>
              <h3 className="text-base font-bold text-white">CampusOne Presentation Guide</h3>
              <p className="text-xs text-slate-400">5-Minute Symposium Walkthrough & Technical Architecture</p>
            </div>
          </div>
          <button
            onClick={() => setIsAboutModalOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800 text-xs">
          {/* Quick Demo Credentials */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="font-bold text-slate-200 block text-xs uppercase tracking-wider">
              1-Click Verification Credentials:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/30">
                <span className="text-cyan-400 font-bold block">Student Portal:</span>
                <span className="text-slate-300 font-mono">student@campusone.demo</span><br />
                <span className="text-slate-400 font-mono">student123</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30">
                <span className="text-amber-400 font-bold block">Admin Operations Console:</span>
                <span className="text-slate-300 font-mono">admin@campusone.demo</span><br />
                <span className="text-slate-400 font-mono">admin123</span>
              </div>
            </div>
          </div>

          {/* 5-Minute Symposium Script */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              5-Minute Demo Walkthrough Script
            </h4>
            <div className="space-y-2">
              {demoSteps.map((step) => (
                <div key={step.num} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                  <span className="font-mono font-black text-cyan-400 text-xs mt-0.5">{step.num}</span>
                  <div>
                    <h5 className="font-bold text-white">{step.title}</h5>
                    <p className="text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Highlights */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <Database size={15} className="text-cyan-400" />
              <span>Database & Security Specification</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Equipped with a production-ready Supabase PostgreSQL schema (<code className="text-cyan-300">supabase/schema.sql</code>) complete with Row-Level Security (RLS) policies ensuring students can only access their own attendance, grades, and private emergency data.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsAboutModalOpen(false)}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20"
          >
            Got it, Let's Explore
          </button>
        </div>
      </div>
    </div>
  );
};
