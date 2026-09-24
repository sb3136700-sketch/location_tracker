import React, { useState } from 'react';
import {
  Compass,
  Bus,
  ShieldAlert,
  BookOpen,
  Menu,
  X,
  Bell,
  Search,
  Calendar,
  Bot,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, user, logout, notifications, setIsAIAssistantOpen, setIsAboutModalOpen } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const mainTabs = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'move', label: 'Move', icon: Bus },
    { id: 'safety', label: 'Safety', icon: ShieldAlert },
    { id: 'study', label: 'Study', icon: BookOpen },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070c18]/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2">
        <div className="flex items-center justify-around">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && !isMoreOpen;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                  isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon size={20} className={isActive ? 'text-cyan-400' : 'text-slate-400'} />
                  {tab.id === 'safety' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                  {tab.id === 'move' && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                )}
              </button>
            );
          })}

          {/* More trigger */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              isMoreOpen || !['home', 'move', 'safety', 'study'].includes(activeTab)
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Menu size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-cyan-500 text-[9px] font-bold text-slate-900 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* More Drawer Modal for Mobile */}
      {isMoreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-[#0b1329] border-t border-slate-700/80 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white">CampusOne Modules</span>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 py-4">
              <button
                onClick={() => handleTabClick('notices')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-850/80 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition"
              >
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Bell size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Notices</p>
                  <p className="text-[10px] text-slate-400">Campus circulars</p>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('lost-found')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition"
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <Search size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Lost & Found</p>
                  <p className="text-[10px] text-slate-400">AI Matcher</p>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('events')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition"
              >
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Events</p>
                  <p className="text-[10px] text-slate-400">Workshops & Fests</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  setIsAIAssistantOpen(true);
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-purple-950/60 to-indigo-950/40 border border-purple-500/40 text-left transition"
              >
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                  <Bot size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-purple-200">Campus AI</p>
                  <p className="text-[10px] text-purple-400">Smart Assistant</p>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('profile')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition"
              >
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Profile</p>
                  <p className="text-[10px] text-slate-400">ID & Records</p>
                </div>
              </button>

              <button
                onClick={() => handleTabClick('settings')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left transition"
              >
                <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                  <Settings size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Settings</p>
                  <p className="text-[10px] text-slate-400">Preferences</p>
                </div>
              </button>
            </div>

            {/* Admin Switcher & Help */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => handleTabClick('admin')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-amber-400" />
                  <span className="text-xs font-bold">Admin Management Console</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded font-mono">
                  {user?.role === 'admin' ? 'ADMIN' : 'OPEN'}
                </span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    setIsAboutModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-850 bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
                >
                  <HelpCircle size={15} />
                  <span>Symposium Demo Guide</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs flex items-center gap-1.5"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
