import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, X, Bus, ShieldAlert, BookOpen, Calendar, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDropdown: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsRead, setActiveTab } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Transport':
        return <Bus size={15} className="text-cyan-400" />;
      case 'Emergency':
        return <ShieldAlert size={15} className="text-rose-400" />;
      case 'Academic':
        return <BookOpen size={15} className="text-blue-400" />;
      case 'Events':
        return <Calendar size={15} className="text-emerald-400" />;
      default:
        return <Info size={15} className="text-amber-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition"
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-cyan-500 text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center ring-2 ring-[#070c18] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0b1329] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Campus Alerts & Updates</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold border border-cyan-500/30">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                >
                  <CheckCheck size={13} />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (notif.linkTab) {
                      setActiveTab(notif.linkTab);
                      setIsOpen(false);
                    }
                  }}
                  className={`p-3.5 hover:bg-slate-800/50 cursor-pointer transition flex items-start gap-3 ${
                    !notif.isRead ? 'bg-cyan-950/20' : ''
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/60 shrink-0 mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs ${!notif.isRead ? 'font-bold text-cyan-200' : 'font-medium text-slate-200'}`}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-900/40 border-t border-slate-800 text-center">
            <button
              onClick={() => {
                setActiveTab('notices');
                setIsOpen(false);
              }}
              className="text-xs text-slate-400 hover:text-cyan-400 font-medium transition"
            >
              View all campus official notices →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
