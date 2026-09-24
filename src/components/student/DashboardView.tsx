import React from 'react';
import {
  Bus,
  ShieldAlert,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Bell,
  Search,
  Bot,
  ExternalLink,
  ChevronRight,
  Radio,
  MapPin,
  TrendingUp,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    user,
    setActiveTab,
    buses,
    timetable,
    assignments,
    notices,
    events,
    proximityAlertActive,
    busDistanceToPreferredStop,
    preferredStop,
    campusStatus,
    setIsAIAssistantOpen
  } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const nextBus = buses[0]; // Bus 03
  const nextClass = timetable[0]; // Machine Learning
  const pendingAssignments = assignments.filter((a) => a.status === 'Pending' || a.status === 'In progress');
  const latestNotice = notices[0];
  const upcomingEvent = events[0];

  const quickButtons = [
    { id: 'move', label: 'Track Bus', icon: Bus, desc: `${nextBus?.number || 'Bus 03'} in ${nextBus?.etaMinutes || 4}m`, color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300' },
    { id: 'safety', label: 'Emergency SOS', icon: ShieldAlert, desc: 'Instant Dispatch', color: 'from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-300' },
    { id: 'study', label: 'View Timetable', icon: Clock, desc: `${nextClass?.subjectCode} @ ${nextClass?.startTime}`, color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300' },
    { id: 'study', label: 'Study Plan', icon: BookOpen, desc: 'AI Exam Roadmaps', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300' },
    { id: 'notices', label: 'Notices', icon: Bell, desc: `${notices.length} Active Circulars`, color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300' },
    { id: 'lost-found', label: 'Lost & Found', icon: Search, desc: 'AI Match Engine', color: 'from-purple-500/20 to-violet-500/20 border-purple-500/40 text-purple-300' },
    { id: 'events', label: 'Events', icon: Calendar, desc: 'Hackathons & Fests', color: 'from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/40 text-fuchsia-300' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hero Welcome Banner with realistic campus imagery */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-[#0b1329]">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center filter brightness-[0.38]"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80")'
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#070c18] via-[#070c18]/80 to-transparent" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Smart Campus Super Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {getGreeting()}, {user?.name.split(' ')[0] || 'Sameerur'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Welcome to CampusOne. Your next lecture is in <span className="text-cyan-400 font-semibold">{nextClass?.room}</span> and <span className="text-cyan-400 font-semibold">{nextBus?.number}</span> is arriving at your preferred stop soon.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('move')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition"
            >
              <Bus size={16} />
              <span>Track Live Bus</span>
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center gap-2 transition"
            >
              <ShieldAlert size={16} />
              <span>SOS Emergency</span>
            </button>
          </div>
        </div>
      </div>

      {/* Proximity Alert Warning Banner (If within 500m of preferred stop) */}
      {proximityAlertActive && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/50 border border-emerald-500/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 animate-pulse">
              <Bus size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                  BUS APPROACHING
                </span>
                <span className="text-xs font-mono text-emerald-400">~{busDistanceToPreferredStop}m away</span>
              </div>
              <p className="text-sm font-bold text-white mt-1">
                {nextBus?.number} is approaching your stop: <span className="text-emerald-300">{preferredStop}</span>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('move')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 transition"
          >
            Open Live Telemetry Map
          </button>
        </div>
      )}

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Attendance */}
        <div
          onClick={() => setActiveTab('study')}
          className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Attendance</span>
            <TrendingUp size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{user?.attendance || 82}%</span>
            <span className="text-[10px] font-bold text-emerald-400">Above 75%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">Status: 🟢 Safe threshold</p>
        </div>

        {/* Next Class */}
        <div
          onClick={() => setActiveTab('study')}
          className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Next Class</span>
            <Clock size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="truncate">
            <span className="text-sm font-bold text-white block truncate">{nextClass?.subjectName}</span>
            <span className="text-xs font-mono text-cyan-400">{nextClass?.startTime} • {nextClass?.room}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">{nextClass?.instructor}</p>
        </div>

        {/* Next Bus ETA */}
        <div
          onClick={() => setActiveTab('move')}
          className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Next Bus</span>
            <Bus size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-white">{nextBus?.number}</span>
            <span className="text-xs font-bold text-cyan-300">{nextBus?.etaMinutes} mins</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">Status: 🟢 {nextBus?.status}</p>
        </div>

        {/* Assignments */}
        <div
          onClick={() => setActiveTab('study')}
          className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Assignments</span>
            <CheckCircle2 size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{pendingAssignments.length}</span>
            <span className="text-[10px] font-bold text-amber-400">Pending</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">Next due tomorrow</p>
        </div>

        {/* Campus Status */}
        <div
          onClick={() => setActiveTab('safety')}
          className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Campus</span>
            <Radio size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-base font-bold text-white">{campusStatus}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">All gates & routes clear</p>
        </div>

        {/* Upcoming Event */}
        <div
          onClick={() => setActiveTab('events')}
          className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Events</span>
            <Calendar size={16} className="text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="truncate">
            <span className="text-xs font-bold text-white block truncate">{upcomingEvent?.title}</span>
            <span className="text-[10px] font-semibold text-purple-400">{upcomingEvent?.category}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">Seats booking open</p>
        </div>
      </div>

      {/* Quick Interactive Actions Grid (Every button works!) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Quick Application Navigation
          </h2>
          <span className="text-xs text-slate-400">All modules synchronized</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {quickButtons.map((btn, idx) => {
            const Icon = btn.icon;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(btn.id)}
                className={`p-3.5 rounded-2xl bg-gradient-to-br ${btn.color} border hover:scale-[1.02] active:scale-[0.98] transition-all text-left flex flex-col justify-between shadow-md`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon size={20} />
                  <ChevronRight size={14} className="opacity-60" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{btn.label}</p>
                  <p className="text-[10px] opacity-80 truncate mt-0.5">{btn.desc}</p>
                </div>
              </button>
            );
          })}

          {/* AI Assistant Quick Launcher */}
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border border-purple-500/40 text-purple-200 hover:scale-[1.02] transition-all text-left flex flex-col justify-between shadow-md group"
          >
            <div className="flex items-center justify-between mb-2">
              <Bot size={20} className="text-purple-300" />
              <Sparkles size={14} className="text-purple-400 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">AI Assistant</p>
              <p className="text-[10px] text-purple-300 truncate mt-0.5">Gemini 3.8 Flash</p>
            </div>
          </button>
        </div>
      </div>

      {/* Dual Highlights: Live Transit Card & Academic Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Transit Telemetry Snapshot */}
        <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Bus size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Live Transit Status</h3>
                <p className="text-xs text-slate-400">{nextBus?.routeName}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {nextBus?.status}
            </span>
          </div>

          <div className="py-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Selected Preferred Stop:</span>
              <span className="font-bold text-white">{preferredStop}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Calculated Distance:</span>
              <span className="font-mono font-bold text-cyan-400">{busDistanceToPreferredStop} meters</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Telemetry Speed:</span>
              <span className="font-mono text-slate-200">{nextBus?.speedKmh} km/h</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Seat Capacity:</span>
              <span className="font-mono text-slate-200">{nextBus?.occupancy} / {nextBus?.capacity} passengers</span>
            </div>

            {/* Progress line */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(15, 100 - (nextBus?.etaMinutes || 4) * 8)}%` }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Driver: {nextBus?.driverName} ({nextBus?.driverPhone})</span>
            <button
              onClick={() => setActiveTab('move')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
            >
              <span>Full Route & Map</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Latest Notice Snapshot */}
        <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Campus Circular</h3>
                <p className="text-xs text-slate-400">Official Notice Board</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {latestNotice?.priority.toUpperCase()}
            </span>
          </div>

          <div className="py-4 space-y-2">
            <h4 className="text-sm font-bold text-slate-100">{latestNotice?.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
              {latestNotice?.message}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
              <span>Author: {latestNotice?.author}</span>
              <span>•</span>
              <span>{latestNotice?.timestamp}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">{notices.length} total circulars</span>
            <button
              onClick={() => setActiveTab('notices')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
            >
              <span>View All Notices</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
