import React from 'react';
import { ShieldAlert, Bot, Sparkles, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationDropdown } from '../common/NotificationDropdown';

export const TopHeader: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    campusStatus,
    setCampusStatus,
    setIsAIAssistantOpen,
    setIsAboutModalOpen,
    proximityAlertActive,
    busDistanceToPreferredStop,
    preferredStop
  } = useApp();

  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'home':
        return 'Student Dashboard';
      case 'move':
        return 'Move • Live Bus Telemetry & Routes';
      case 'safety':
        return 'Safety • Emergency SOS Hub';
      case 'study':
        return 'Study • Smart Timetable & Planner';
      case 'notices':
        return 'Campus Life • Official Notices';
      case 'lost-found':
        return 'Campus Life • Lost & Found AI Matcher';
      case 'events':
        return 'Campus Life • Events & Registrations';
      case 'profile':
        return 'Student Profile & Academic Records';
      case 'settings':
        return 'App Settings & Notifications';
      case 'admin':
        return 'Campus Administration Operations Console';
      default:
        return 'CampusOne';
    }
  };

  const getStatusColor = () => {
    switch (campusStatus) {
      case 'Normal':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Advisory':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Drill':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Weather Alert':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-[#070c18]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 select-none">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand (mobile) / Breadcrumb (desktop) */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-cyan-500/20">
              C1
            </div>
            <span className="font-bold text-white tracking-tight text-sm">CAMPUSONE</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-sm">
            <span className="text-slate-400">CampusOne</span>
            <span className="text-slate-400">/</span>
            <span className="font-semibold text-white tracking-tight">{getBreadcrumb()}</span>
          </div>
        </div>

        {/* Center / Right: Indicators & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Proximity Alert Quick Tag (if bus approaching) */}
          {proximityAlertActive && (
            <button
              onClick={() => setActiveTab('move')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-pulse hover:bg-emerald-500/25 transition"
            >
              <span>🚌 Bus near {preferredStop} ({busDistanceToPreferredStop}m)</span>
            </button>
          )}

          {/* Campus Status Pill */}
          <div
            onClick={() => {
              if (user?.role === 'admin') {
                const statuses: ('Normal' | 'Advisory' | 'Drill' | 'Weather Alert')[] = ['Normal', 'Advisory', 'Drill', 'Weather Alert'];
                const next = statuses[(statuses.indexOf(campusStatus) + 1) % statuses.length];
                setCampusStatus(next);
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor()} ${
              user?.role === 'admin' ? 'cursor-pointer hover:opacity-80' : ''
            }`}
            title={user?.role === 'admin' ? 'Click to toggle status' : 'Campus Status'}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
            <span className="hidden sm:inline">Campus:</span>
            <span>{campusStatus}</span>
          </div>

          {/* DEMO MODE Pill */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-medium"
            title="Demonstration system with simulated bus GPS telemetry & AI fallbacks"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="font-semibold tracking-wide">DEMO MODE</span>
          </div>

          {/* Quick SOS Trigger in Header */}
          <button
            onClick={() => setActiveTab('safety')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900/80 border border-rose-500/70 text-rose-200 font-bold text-xs shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:shadow-[0_0_22px_rgba(244,63,94,0.7)] active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <ShieldAlert size={14} className="text-rose-400" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          {/* AI Campus Assistant Header Trigger */}
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-400/60 text-cyan-300 font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:shadow-[0_0_22px_rgba(6,182,212,0.65)] hover:text-white active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <Bot size={14} className="text-cyan-400" />
            <span className="hidden md:inline">Campus AI</span>
          </button>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* Symposium Guide trigger */}
          <button
            onClick={() => setIsAboutModalOpen(true)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)] active:scale-95 transition-all duration-150 cursor-pointer"
            title="Symposium Demo Guide & Architecture"
          >
            <HelpCircle size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};
