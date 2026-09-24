import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  CalendarPlus,
  Share2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { downloadEventIcs } from '../../utils/calendar';
import { CampusEvent, EventCategory } from '../../types';

export const EventsView: React.FC = () => {
  const { events, registerForEvent } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeEventDetail, setActiveEventDetail] = useState<CampusEvent | null>(null);
  const [registrationFeedback, setRegistrationFeedback] = useState<string | null>(null);

  const categories = ['All', 'Technical', 'Symposium', 'Hackathon', 'Workshop', 'Sports', 'Cultural', 'Placement'];

  const filteredEvents = events.filter((ev) => {
    if (selectedCategory === 'All') return true;
    return ev.category === selectedCategory;
  });

  const handleRegister = (eventId: string, title: string) => {
    registerForEvent(eventId);
    setRegistrationFeedback(`Registration updated for: ${title}`);
    setTimeout(() => setRegistrationFeedback(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-[#0b1329] p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">🎉 Campus Events & Hackathons</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              FALL 2026
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Register for technical symposia, flagship hackathons, guest lectures, cultural fests, and campus placement drives.
          </p>
        </div>

        {/* Calendar sync quick info */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <CalendarPlus size={16} className="text-cyan-400" />
          <span>One-tap .ics Calendar Sync</span>
        </div>
      </div>

      {/* Registration Toast Feedback */}
      {registrationFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{registrationFeedback}</span>
          </div>
          <button onClick={() => setRegistrationFeedback(null)} className="text-emerald-400 text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => {
          const seatsLeft = Math.max(0, event.totalSeats - event.registeredCount);
          return (
            <div
              key={event.id}
              className="bg-[#0b1329] border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between transition group"
            >
              {/* Event Image Banner with Overlay */}
              <div className="relative h-52 w-full bg-slate-950 overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover filter brightness-[0.75] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329] via-transparent to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-blue-600 text-white shadow-lg">
                    {event.category}
                  </span>
                  {event.isRegistered && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-lg">
                      <CheckCircle2 size={12} />
                      <span>REGISTERED</span>
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700/80">
                    <Calendar size={13} className="text-cyan-400" />
                    <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700/80 font-mono text-[11px]">
                    <Clock size={12} className="text-cyan-400" />
                    <span>{event.startTime} – {event.endTime}</span>
                  </div>
                </div>
              </div>

              {/* Event Body */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight mb-2">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin size={14} className="text-cyan-400 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{event.organizer}</span>
                  </div>

                  {/* Seat Availability Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Seats Reserved:</span>
                      <span className="font-mono font-bold text-white">
                        {event.registeredCount} / {event.totalSeats} ({seatsLeft} remaining)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (event.registeredCount / event.totalSeats) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => downloadEventIcs(event)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Export .ics file to Apple/Google Calendar"
                >
                  <CalendarPlus size={14} className="text-cyan-400" />
                  <span className="hidden sm:inline">Add to Calendar</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveEventDetail(event)}
                    className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => handleRegister(event.id, event.title)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-md ${
                      event.isRegistered
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white shadow-cyan-500/20'
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    <span>{event.isRegistered ? 'Cancel Registration' : 'Register Now'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Details Modal */}
      {activeEventDetail && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-cyan-400">{activeEventDetail.category}</span>
                <h3 className="text-lg font-bold text-white mt-1 leading-snug">{activeEventDetail.title}</h3>
              </div>
              <button
                onClick={() => setActiveEventDetail(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden h-40 w-full bg-slate-900">
              <img
                src={activeEventDetail.imageUrl}
                alt={activeEventDetail.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="leading-relaxed">{activeEventDetail.description}</p>
              <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-slate-400">
                <div><strong>Location:</strong> {activeEventDetail.location}</div>
                <div><strong>Organizer:</strong> {activeEventDetail.organizer}</div>
                <div><strong>Date:</strong> {activeEventDetail.date}</div>
                <div><strong>Time:</strong> {activeEventDetail.startTime} – {activeEventDetail.endTime}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleRegister(activeEventDetail.id, activeEventDetail.title);
                  setActiveEventDetail(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                {activeEventDetail.isRegistered ? 'Cancel Registration' : 'Confirm Registration'}
              </button>
              <button
                onClick={() => downloadEventIcs(activeEventDetail)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                Calendar (.ics)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
