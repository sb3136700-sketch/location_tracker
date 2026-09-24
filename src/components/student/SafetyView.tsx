import React, { useState } from 'react';
import {
  ShieldAlert,
  Flame,
  HeartPulse,
  Truck,
  HelpCircle,
  Phone,
  MapPin,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Radio,
  Filter,
  Check,
  PhoneCall,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmergencyType, AlertCategory } from '../../types';

export const SafetyView: React.FC = () => {
  const {
    emergencyRecords,
    triggerEmergencySOS,
    emergencyContacts,
    notices,
    userCoords,
    requestUserLocation,
    locationPermission
  } = useApp();

  const [selectedSosType, setSelectedSosType] = useState<EmergencyType>('Medical');
  const [sosNotes, setSosNotes] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastDispatchedAlert, setLastDispatchedAlert] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [callModalContact, setCallModalContact] = useState<any>(null);

  const emergencyCategories: { type: EmergencyType; label: string; icon: any; color: string }[] = [
    { type: 'Medical', label: 'Medical Emergency', icon: HeartPulse, color: 'border-rose-500 bg-rose-500/15 text-rose-300' },
    { type: 'Security', label: 'Security & Threat', icon: ShieldAlert, color: 'border-amber-500 bg-amber-500/15 text-amber-300' },
    { type: 'Fire', label: 'Fire & Hazard', icon: Flame, color: 'border-orange-500 bg-orange-500/15 text-orange-300' },
    { type: 'Transport', label: 'Transit Accident', icon: Truck, color: 'border-blue-500 bg-blue-500/15 text-blue-300' },
    { type: 'Other', label: 'Other Critical Aid', icon: HelpCircle, color: 'border-purple-500 bg-purple-500/15 text-purple-300' },
  ];

  const handleTriggerSOS = async () => {
    setIsSubmitting(true);
    try {
      const alert = await triggerEmergencySOS(selectedSosType, sosNotes);
      setLastDispatchedAlert(alert);
      setConfirmModalOpen(false);
      setSosNotes('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAlerts = notices.filter((n) => {
    if (activeFilter === 'All') return true;
    return n.category === activeFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Safety Header */}
      <div className="bg-[#0b1329] p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">🛡️ Safety & Emergency SOS Hub</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
              24/7 RAPID DISPATCH
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Immediate dispatch connection to Campus Police, Triage Paramedics, and Safety Wardens. Emergency telemetry is strictly confidential.
          </p>
        </div>

        {/* Location Status Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={requestUserLocation}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
              locationPermission === 'granted'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <MapPin size={14} className={locationPermission === 'granted' ? 'text-emerald-400' : 'text-slate-400'} />
            <span>
              {locationPermission === 'granted'
                ? 'GPS Coordinates Ready for Dispatch'
                : 'Attach GPS to Emergency SOS'}
            </span>
          </button>
        </div>
      </div>

      {/* Dispatched Confirmation Banner (shows reference ID) */}
      {lastDispatchedAlert && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/80 via-[#0b1329] to-slate-900 border-2 border-rose-500 shadow-2xl animate-in zoom-in-95">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-rose-500 text-white font-black text-xl animate-pulse">
                🚨
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-rose-500 text-slate-950 tracking-wider">
                  EMERGENCY ALERT CREATED
                </span>
                <h3 className="text-lg font-black text-white mt-1.5">
                  Reference ID: <span className="font-mono text-cyan-300">{lastDispatchedAlert.referenceId}</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Type: <strong className="text-white">{lastDispatchedAlert.alertType}</strong> • Status:{' '}
                  <span className="font-bold text-emerald-400 uppercase">{lastDispatchedAlert.status}</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Campus Quick Response Unit has been alerted with your profile and timestamp. Stay calm and remain at a safe vantage point.
                </p>
              </div>
            </div>
            <button
              onClick={() => setLastDispatchedAlert(null)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hero SOS Action Console */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="text-center max-w-lg mx-auto mb-6">
          <h2 className="text-lg sm:text-xl font-black text-white">Emergency SOS Dispatcher</h2>
          <p className="text-xs text-slate-400 mt-1">
            Select the nature of emergency and tap the large SOS beacon below to alert responders.
          </p>
        </div>

        {/* Category Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto mb-8">
          {emergencyCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedSosType === cat.type;
            return (
              <button
                key={cat.type}
                onClick={() => setSelectedSosType(cat.type)}
                className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? `${cat.color} ring-2 ring-rose-400/50 scale-105 font-bold shadow-lg`
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon size={22} />
                <span className="text-xs tracking-tight">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Giant SOS Beacon */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative group">
            {/* Pulsing beacon halos */}
            <div className="absolute -inset-4 rounded-full bg-rose-500/20 animate-ping opacity-75 group-hover:opacity-100" />
            <div className="absolute -inset-2 rounded-full bg-rose-600/30 blur-md" />

            <button
              onClick={() => setConfirmModalOpen(true)}
              className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 hover:from-rose-600 hover:to-red-400 text-white font-black text-xl sm:text-2xl shadow-2xl shadow-rose-600/50 flex flex-col items-center justify-center gap-2 transition-transform active:scale-95 ring-4 ring-rose-400/40"
            >
              <ShieldAlert size={42} className="animate-pulse" />
              <span className="tracking-wider">EMERGENCY</span>
              <span className="text-[11px] font-bold tracking-widest text-rose-200 uppercase">
                {selectedSosType} SOS
              </span>
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-6 text-center max-w-sm">
            Pressing SOS will prompt for swift confirmation to prevent accidental dispatches.
          </p>
        </div>
      </div>

      {/* Emergency Hotlines Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Campus Emergency Hotlines
            </h3>
            <p className="text-xs text-slate-400">Official monitored helpline numbers</p>
          </div>
          <span className="text-xs text-slate-400">Direct dialing enabled</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-[#0b1329] border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                    {contact.department}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <h4 className="text-base font-bold text-white">{contact.name}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{contact.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-slate-300">{contact.phone}</span>
                <button
                  onClick={() => setCallModalContact(contact)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
                >
                  <PhoneCall size={13} />
                  <span>Call Hotline</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campus Broadcast Alerts Feed with Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Campus Safety & Operation Bulletins
            </h3>
            <p className="text-xs text-slate-400">Filtered by advisory type</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Emergency', 'Transport', 'Academic', 'Placement'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                  activeFilter === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-5 rounded-3xl bg-[#0b1329] border border-slate-800 shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    alert.priority === 'urgent'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : alert.priority === 'high'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}
                >
                  {alert.category} • {alert.priority}
                </span>
                <span className="text-[11px] text-slate-400">{alert.timestamp}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{alert.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                Issued by: <span className="text-slate-300 font-medium">{alert.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SOS Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border-2 border-rose-500/60 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400">
                <AlertOctagon size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Confirm Emergency Dispatch</h3>
                <p className="text-xs text-slate-400">Campus Quick Response Unit will be notified</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Emergency Type:</span>
                  <span className="font-bold text-rose-400 uppercase">{selectedSosType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location Telemetry:</span>
                  <span className="font-bold text-cyan-400">
                    {userCoords ? `${userCoords.lat.toFixed(4)}, ${userCoords.lng.toFixed(4)}` : 'Campus Zone (GPS not granted)'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Optional Details or Floor/Room:
                </label>
                <textarea
                  value={sosNotes}
                  onChange={(e) => setSosNotes(e.target.value)}
                  placeholder="e.g. 2nd floor library reading room, acute chest discomfort..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-rose-500 h-20 resize-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
                <Info size={16} className="shrink-0 text-amber-400" />
                <span>False emergency alarms are logged and audited by Campus Security.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriggerSOS}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldAlert size={14} />
                    <span>Confirm & Dispatch SOS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call Dialog Modal */}
      {callModalContact && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-slate-700 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <PhoneCall size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{callModalContact.name}</h3>
              <p className="text-xs text-slate-400">{callModalContact.department}</p>
              <p className="text-lg font-mono font-bold text-emerald-400 mt-2">{callModalContact.phone}</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setCallModalContact(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <a
                href={`tel:${callModalContact.phone}`}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Phone size={13} />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
