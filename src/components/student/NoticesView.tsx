import React, { useState } from 'react';
import {
  Bell,
  Search,
  Filter,
  CheckCircle,
  Pin,
  Clock,
  User,
  Share2,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CampusAlert } from '../../types';

export const NoticesView: React.FC = () => {
  const { notices, publishNotice, user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [readNoticeIds, setReadNoticeIds] = useState<Set<string>>(new Set(['not-1']));
  const [activeNoticeModal, setActiveNoticeModal] = useState<CampusAlert | null>(null);

  const categories = ['All', 'Academic', 'Transport', 'Emergency', 'Event', 'Placement'];

  const toggleReadStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReadNoticeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredNotices = notices.filter((n) => {
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const unreadCount = notices.filter((n) => !readNoticeIds.has(n.id)).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#0b1329] p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">📢 Official Campus Circulars</span>
            {unreadCount > 0 && (
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {unreadCount} UNREAD
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Verified official releases from the Office of the Registrar, Dean of Academic Affairs, and Transit Authority.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search circulars, subjects, keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedCategory === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-3.5">
        {filteredNotices.map((notice) => {
          const isRead = readNoticeIds.has(notice.id);
          return (
            <div
              key={notice.id}
              onClick={() => {
                setReadNoticeIds((prev) => new Set([...prev, notice.id]));
                setActiveNoticeModal(notice);
              }}
              className={`p-5 rounded-3xl border transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl ${
                !isRead
                  ? 'bg-gradient-to-r from-cyan-950/20 via-[#0b1329] to-[#0b1329] border-cyan-500/40 hover:border-cyan-400'
                  : 'bg-[#0b1329] border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 shrink-0 text-cyan-400 mt-0.5">
                  <Bell size={18} />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.isPinned && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        <Pin size={10} />
                        <span>PINNED</span>
                      </span>
                    )}
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {notice.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{notice.timestamp}</span>
                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>

                  <h3 className={`text-base font-bold truncate ${!isRead ? 'text-white' : 'text-slate-300'}`}>
                    {notice.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {notice.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/60">
                <span className="text-[11px] text-slate-400">{notice.author}</span>
                <button
                  onClick={(e) => toggleReadStatus(notice.id, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title={isRead ? 'Mark as Unread' : 'Mark as Read'}
                >
                  {isRead ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <ChevronRight size={18} className="text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Notice Detail Modal */}
      {activeNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {activeNoticeModal.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-2 leading-snug">
                  {activeNoticeModal.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Issued by: <strong className="text-slate-300">{activeNoticeModal.author}</strong> • {activeNoticeModal.timestamp}
                </p>
              </div>
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2 whitespace-pre-line">
              {activeNoticeModal.message}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-400">Official Campus Verified Document</span>
              <button
                onClick={() => setActiveNoticeModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
