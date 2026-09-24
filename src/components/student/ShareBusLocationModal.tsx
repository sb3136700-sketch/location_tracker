import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Smartphone,
  Navigation,
  Send,
  ExternalLink,
  X,
  Phone,
  Radio,
  MapPin,
  Clock
} from 'lucide-react';
import { BusItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface ShareBusLocationModalProps {
  bus: BusItem;
  onClose: () => void;
}

export const ShareBusLocationModal: React.FC<ShareBusLocationModalProps> = ({ bus, onClose }) => {
  const { user, triggerSmsAlert } = useApp();
  const [copied, setCopied] = useState(false);
  const [smsSending, setSmsSending] = useState(false);
  const [customPhone, setCustomPhone] = useState(user?.phone || '+1 (555) 392-1084');
  const [smsSentNotice, setSmsSentNotice] = useState(false);

  // Generate deep tracking share link
  const origin = window.location.origin;
  const shareUrl = `${origin}/?bus=${encodeURIComponent(bus.id)}&lat=${bus.currentLat.toFixed(4)}&lng=${bus.currentLng.toFixed(4)}&route=${encodeURIComponent(bus.routeName)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendSmsToPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhone.trim()) return;

    setSmsSending(true);
    const message = `CampusOne Live Bus Alert: ${bus.number} (${bus.routeName}) is at ${bus.currentLat.toFixed(4)}, ${bus.currentLng.toFixed(4)}. ETA: ${bus.etaMinutes} mins. Driver: ${bus.driverName} (${bus.driverPhone}). Track: ${shareUrl}`;

    try {
      await triggerSmsAlert(customPhone.trim(), message);
      setSmsSentNotice(true);
      setTimeout(() => setSmsSentNotice(false), 4000);
    } finally {
      setSmsSending(false);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🚍 CampusOne Live Bus Tracking: ${bus.number} (${bus.routeName}) is currently en route. Speed: ${bus.speedKmh} km/h, ETA: ${bus.etaMinutes} mins. Live Telemetry: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CampusOne Live Transit: ${bus.number}`,
          text: `Track live position of ${bus.number} (${bus.routeName}). Speed: ${bus.speedKmh} km/h, ETA: ${bus.etaMinutes} mins.`,
          url: shareUrl
        });
      } catch {
        // User cancelled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#090f20] border border-cyan-400/60 p-6 sm:p-7 shadow-[0_0_35px_rgba(6,182,212,0.4)] ring-1 ring-cyan-500/30 space-y-5">
        {/* Neon top highlight line */}
        <div className="absolute top-0 left-12 right-12 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center text-cyan-300">
              <Share2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Share Live Bus Location</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  LIVE BEACON
                </span>
              </h3>
              <p className="text-xs text-slate-400">Broadcast live GPS coordinates & arrival ETA</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-slate-400 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Bus Live Telemetry Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white">{bus.number}</span>
              <span className="text-xs text-cyan-300 font-semibold">• {bus.routeName}</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <Radio size={13} className="text-emerald-400 animate-ping" />
              <span>{bus.status}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Speed</span>
              <span className="font-mono font-bold text-white text-sm">{bus.speedKmh} km/h</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">ETA</span>
              <span className="font-mono font-bold text-cyan-300 text-sm">{bus.etaMinutes} mins</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Occupancy</span>
              <span className="font-mono font-bold text-white text-sm">{bus.occupancy}/{bus.capacity}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Driver</span>
              <span className="font-semibold text-slate-200 text-xs truncate block">{bus.driverName.split(' ')[0]}</span>
            </div>
          </div>

          {/* Live GPS Coordinates banner */}
          <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs font-mono text-cyan-300">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-cyan-400 animate-bounce" />
              <span>GPS: {bus.currentLat.toFixed(4)}° N, {bus.currentLng.toFixed(4)}° E</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
              Active GPS Feed
            </span>
          </div>
        </div>

        {/* 1-Click Copy Tracking URL */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-300">
            Shareable Live Tracking Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 truncate focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-cyan-300 bg-cyan-950/70 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] hover:border-cyan-300 hover:text-white active:scale-95 active:shadow-[0_0_35px_rgba(6,182,212,0.95)] transition-all duration-150 cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Send Live Location via SMS to Mobile Number */}
        <form onSubmit={handleSendSmsToPhone} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Smartphone size={16} className="text-cyan-400" />
              <span>Send Live Coordinates to Mobile Phone via SMS</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">TELCO GATEWAY</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="tel"
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              placeholder="e.g. +1 (555) 392-1084"
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              required
            />
            <button
              type="submit"
              disabled={smsSending}
              className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-cyan-500 to-blue-600 border border-cyan-300/50 shadow-[0_0_18px_rgba(6,182,212,0.5)] hover:shadow-[0_0_28px_rgba(6,182,212,0.85)] active:scale-95 active:shadow-[0_0_35px_rgba(6,182,212,1)] transition-all duration-150 cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <Send size={13} />
              <span>{smsSending ? 'Sending...' : 'Send SMS'}</span>
            </button>
          </div>

          {smsSentNotice && (
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 text-xs flex items-center gap-2 font-medium">
              <Check size={14} className="text-cyan-400 shrink-0" />
              <span>SMS Dispatched! Check top of screen for simulated incoming SMS toast.</span>
            </div>
          )}
        </form>

        {/* Quick Social & System Share Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="py-2.5 px-3 rounded-xl font-bold text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
          >
            <ExternalLink size={14} />
            <span>Share via WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="py-2.5 px-3 rounded-xl font-bold text-xs text-cyan-300 bg-cyan-950/50 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-95 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
          >
            <Navigation size={14} />
            <span>Device Share Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
