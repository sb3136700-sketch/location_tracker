import React from 'react';
import { Smartphone, CheckCircle, X, Radio, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileSmsToast: React.FC = () => {
  const { activeIncomingSms, dismissIncomingSms, setActiveTab } = useApp();

  if (!activeIncomingSms) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[92vw] max-w-md animate-in fade-in slide-in-from-top-6 duration-300">
      <div className="relative rounded-2xl bg-[#090f20]/95 backdrop-blur-xl border border-cyan-400/70 p-4 shadow-[0_0_30px_rgba(6,182,212,0.45)] ring-1 ring-cyan-500/30">
        {/* Glow ambient bar */}
        <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]" />

        <div className="flex items-start gap-3">
          {/* Animated Glowing Phone Icon */}
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center shrink-0 text-cyan-300">
            <Smartphone size={20} className="animate-pulse" />
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black tracking-widest uppercase text-cyan-400">
                💬 SMS DISPATCHED
              </span>
              <span className="text-[10px] text-slate-500">•</span>
              <span className="text-[10px] font-mono text-slate-400">{activeIncomingSms.timestamp}</span>
            </div>

            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-xs font-bold text-white font-mono">{activeIncomingSms.to}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle size={10} />
                <span>Delivered</span>
              </span>
            </div>

            <p className="text-xs text-slate-200 leading-snug line-clamp-3 bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 font-mono text-[11px]">
              "{activeIncomingSms.message}"
            </p>

            <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
              <div className="flex items-center gap-1">
                <Radio size={11} className="text-cyan-400 animate-ping" />
                <span>{activeIncomingSms.provider}</span>
              </div>
              <span className="font-mono text-cyan-400/80">{activeIncomingSms.deliveryCode}</span>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={dismissIncomingSms}
            className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition active:scale-90"
            title="Dismiss SMS notification"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
