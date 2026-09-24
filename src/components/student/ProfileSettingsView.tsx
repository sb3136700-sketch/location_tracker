import React, { useState } from 'react';
import {
  User,
  Settings,
  Bus,
  ShieldCheck,
  BellRing,
  Download,
  Lock,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  Moon,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileSettingsView: React.FC = () => {
  const {
    user,
    preferredStop,
    setPreferredStop,
    proximityThreshold,
    setProximityThreshold,
    pushEnabled,
    requestPushPermission,
    buses
  } = useApp();

  const [savedFeedback, setSavedFeedback] = useState(false);
  const [installPromptShown, setInstallPromptShown] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const handleInstallClick = () => {
    setInstallPromptShown(true);
    setTimeout(() => setInstallPromptShown(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Profile Header Card */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
          alt={user?.name}
          className="w-24 h-24 rounded-full object-cover ring-4 ring-cyan-500/40 shadow-xl"
        />
        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black text-white">{user?.name}</h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {user?.role.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Student ID: <strong className="text-slate-200 font-mono">{user?.student_id}</strong> • {user?.department}
          </p>
          <p className="text-xs text-slate-400">
            Academic Standing: <strong className="text-emerald-400">{user?.attendance}% Attendance (Good Standing)</strong>
          </p>
        </div>
      </div>

      {savedFeedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 size={16} />
          <span>Preferences updated and synchronized with Supabase profile!</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transit & Proximity Preferences */}
        <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Bus size={18} className="text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Transit & Bus Proximity Alerts</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Designated Bus Stop for Proximity Alerts
              </label>
              <select
                value={preferredStop}
                onChange={(e) => setPreferredStop(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              >
                {buses[0]?.stops.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.scheduledTime})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Haversine Alert Distance</span>
                <span className="font-mono text-cyan-400 font-bold">{proximityThreshold}m</span>
              </div>
              <input
                type="range"
                min="200"
                max="1200"
                step="50"
                value={proximityThreshold}
                onChange={(e) => setProximityThreshold(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition"
            >
              Update Transit Preferences
            </button>
          </form>
        </div>

        {/* PWA & Mobile Installation */}
        <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Smartphone size={18} className="text-cyan-400" />
              <h3 className="text-sm font-bold text-white">PWA & Offline Capability</h3>
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              CampusOne is Progressive Web App (PWA) ready. You can install it directly to your home screen on Android and iOS devices for full offline support and instant alerts.
            </p>

            <div className="mt-4 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Web Push Notifications:</span>
                <span className={`font-bold ${pushEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {pushEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Service Worker:</span>
                <span className="font-mono text-cyan-400">sw.js registered</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={requestPushPermission}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <BellRing size={14} className="text-cyan-400" />
              <span>{pushEnabled ? 'Push Permission Granted' : 'Enable Web Push'}</span>
            </button>

            <button
              onClick={handleInstallClick}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
            >
              <Download size={14} />
              <span>Install CampusOne PWA</span>
            </button>

            {installPromptShown && (
              <p className="text-[11px] text-cyan-300 text-center animate-pulse">
                Click "Add to Home Screen" or the install icon in your browser URL bar.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
