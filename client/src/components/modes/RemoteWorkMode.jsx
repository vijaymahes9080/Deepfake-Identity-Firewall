import React, { useState, useEffect } from 'react';
import { Laptop, Lock, Unlock, ShieldCheck, AlertOctagon, UserX, RefreshCw } from 'lucide-react';

export function RemoteWorkMode({ evaluation, onTriggerChallenge }) {
  const [sessionLocked, setSessionLocked] = useState(false);
  const [continuousAuthTimer, setContinuousAuthTimer] = useState(180); // 3 mins re-auth heartbeat

  const isCriticalRisk = evaluation?.riskScore > 65;

  // Auto lock session if risk spikes critical
  useEffect(() => {
    if (isCriticalRisk && !sessionLocked) {
      setSessionLocked(true);
    }
  }, [isCriticalRisk, sessionLocked]);

  useEffect(() => {
    const timer = setInterval(() => {
      setContinuousAuthTimer(prev => (prev <= 1 ? 180 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlockSession = () => {
    onTriggerChallenge();
    setSessionLocked(false);
  };

  return (
    <div className="space-y-4">
      {/* Remote Work Header */}
      <div className="cyber-card corner-bracket p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-950/60 border border-cyan-500/40 rounded-lg text-cyan-400">
            <Laptop className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-gray-100">
              ZERO-TRUST CONTINUOUS IDENTITY SENTINEL — ENTERPRISE WORKPLACE
            </h3>
            <p className="text-xs font-mono text-gray-400">
              Session: <b className="text-gray-200">ENTERPRISE-VPN-CORP-9204</b> | Privilege: <b className="text-amber-400">ROOT_ADMIN</b>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <span className="text-gray-400">NEXT PASSIVE HEARTBEAT:</span>
          <span className="text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-500/40 px-2 py-0.5 rounded">
            {continuousAuthTimer}s
          </span>
        </div>
      </div>

      {/* Lock Screen or Active Sentinel Workspace */}
      {sessionLocked ? (
        <div className="cyber-card p-8 text-center flex flex-col items-center justify-center border-rose-500/80 bg-rose-950/20">
          <div className="w-16 h-16 rounded-full bg-rose-950 border border-rose-500 flex items-center justify-center mb-4 animate-bounce">
            <Lock className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="font-display font-bold text-lg text-rose-200 mb-2">
            ZERO-TRUST SENTINEL LOCKDOWN TRIGGERED
          </h3>
          <p className="text-xs font-mono text-gray-400 max-w-md mb-6 leading-relaxed">
            The firewall detected an unauthenticated identity divergence or synthetic media stream. Access to corporate cloud resources has been locked to prevent session hijacking.
          </p>
          <button
            onClick={handleUnlockSession}
            className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-display font-bold px-6 py-2 rounded-lg text-xs shadow-lg shadow-rose-500/30 transition-all flex items-center space-x-2"
          >
            <Unlock className="w-4 h-4" />
            <span>BIOMETRIC STEP-UP RE-AUTHENTICATION</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="cyber-card p-4 lg:col-span-2 space-y-4">
            <div className="font-display font-bold text-xs text-gray-200 border-b border-gray-800 pb-2">
              ACTIVE CONTINUOUS WORKSPACE TELEMETRY
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-black/50 border border-gray-800 p-3 rounded">
                <div className="text-gray-400 text-[10px] mb-1">PASSIVE BIOMETRIC SAMPLING</div>
                <div className="text-emerald-400 font-bold text-sm">30 SAMPLES / MIN</div>
                <div className="text-[10px] text-gray-500 mt-1">Zero raw video stored (Vector only)</div>
              </div>

              <div className="bg-black/50 border border-gray-800 p-3 rounded">
                <div className="text-gray-400 text-[10px] mb-1">IDENTITY CONTINUITY DRIFT</div>
                <div className="text-emerald-400 font-bold text-sm">0.03 (TOLERANCE: 0.18)</div>
                <div className="text-[10px] text-gray-500 mt-1">Cosine similarity stable</div>
              </div>
            </div>

            <div className="bg-black/40 border border-gray-800 rounded p-3 text-xs font-mono space-y-1.5">
              <div className="text-gray-400 font-bold text-[11px]">ACCESS PERMISSIONS GUARDED:</div>
              <div className="flex items-center gap-2 text-gray-300 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Production Kubernetes Clusters (us-east-1)
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Enterprise Zero-Trust VPN Gateway
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Internal Code Repositories & Key Vaults
              </div>
            </div>
          </div>

          <div className="cyber-card p-4 flex flex-col justify-between">
            <div>
              <div className="font-display font-bold text-xs text-gray-200 border-b border-gray-800 pb-2 mb-3">
                SENTINEL SECURITY ACTIONS
              </div>

              <div className="space-y-2 font-mono text-xs">
                <button
                  onClick={() => setSessionLocked(true)}
                  className="w-full bg-rose-950/40 hover:bg-rose-900/60 border border-rose-600/50 text-rose-300 py-2 rounded text-xs transition-all flex items-center justify-center space-x-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>MANUAL LOCKDOWN</span>
                </button>

                <button
                  onClick={onTriggerChallenge}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-gray-700 text-gray-200 py-2 rounded text-xs transition-all flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>REQUEST PASSIVE RE-VERIFY</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-800 text-[10px] font-mono text-gray-500">
              Session auto-terminates if face is absent for &gt; 45 seconds.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
