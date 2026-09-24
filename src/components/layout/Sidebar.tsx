import React from 'react';
import {
  Compass,
  Bus,
  ShieldAlert,
  BookOpen,
  Bell,
  Search,
  Calendar,
  Bot,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { user, activeTab, setActiveTab, logout, notifications, setIsAIAssistantOpen, setIsAboutModalOpen } = useApp();

  const unreadNoticesCount = notifications.filter((n) => !n.isRead && (n.category === 'Notices' || n.category === 'Transport')).length;

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass, badge: null },
    { id: 'move', label: 'Move (Buses)', icon: Bus, badge: '4m ETA', badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'safety', label: 'Safety (SOS)', icon: ShieldAlert, badge: 'Active', badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
    { id: 'study', label: 'Study & Timetable', icon: BookOpen, badge: 'Next 10:30', badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    { id: 'notices', label: 'Campus Notices', icon: Bell, badge: unreadNoticesCount > 0 ? `${unreadNoticesCount} new` : null, badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { id: 'lost-found', label: 'Lost & Found', icon: Search, badge: 'Match', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { id: 'events', label: 'Campus Events', icon: Calendar, badge: null },
    { id: 'profile', label: 'My Profile', icon: User, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-[#0b1329]/95 backdrop-blur-xl border-r border-slate-800/80 p-5 select-none h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
            <span className="text-xl font-black text-white tracking-tighter">C1</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white">CAMPUSONE</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[150px]">Smart Super Application</p>
          </div>
        </div>

        <button
          onClick={() => setIsAboutModalOpen(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition"
          title="Symposium Guide & Architecture"
        >
          <HelpCircle size={18} />
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto py-5 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Core Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={19}
                  className={`transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* AI Campus Assistant Launcher */}
        <div className="pt-3">
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 hover:border-cyan-300 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] active:scale-95 transition-all duration-150 cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition-transform">
                <Bot size={18} />
              </div>
              <span className="font-semibold text-white">CampusOne AI</span>
            </div>
            <Sparkles size={15} className="text-cyan-400 animate-pulse" />
          </button>
        </div>

        {/* Admin Portal Gateway */}
        <div className="pt-4 px-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Operations & Control
          </div>
          <button
            onClick={() => setActiveTab('admin')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 border active:scale-95 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-cyan-500/25 text-white border-cyan-400 font-bold shadow-[0_0_20px_rgba(6,182,212,0.45)]'
                : 'text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border-cyan-500/40 hover:border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck size={19} className="text-cyan-400" />
              <span>Admin Portal</span>
            </div>
            {user?.role === 'admin' ? (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/30 text-cyan-300 uppercase border border-cyan-400/40">
                Active
              </span>
            ) : (
              <span className="text-[10px] text-cyan-400/80 font-mono">Console</span>
            )}
          </button>
        </div>
      </div>

      {/* User Session Footer */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user?.name || 'Student'}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-cyan-500/40"
            />
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Student'}</p>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.role === 'admin' ? 'Admin / Dean' : user?.student_id || 'CS-2023-884'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
