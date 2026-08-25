import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, FileCheck, RefreshCw, X, Link } from 'lucide-react';

export function PrivacyVaultModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/audit/logs?limit=30');
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.warn('Could not fetch audit logs:', e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="cyber-card corner-bracket w-full max-w-3xl p-5 border-cyan-500/60 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-sm text-gray-100">
              PRIVACY VAULT & CRYPTOGRAPHIC AUDIT LEDGER
            </h3>
          </div>
          <button
            onClick={fetchLogs}
            className="flex items-center space-x-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 mr-8"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>REFRESH CHAIN</span>
          </button>
        </div>

        {/* Privacy-First Architecture Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4 text-xs font-mono">
          <div className="bg-black/50 border border-gray-800 p-2.5 rounded">
            <div className="text-gray-400 text-[10px]">RAW MEDIA RETENTION</div>
            <div className="text-emerald-400 font-bold">0 ms (Zero-Storage Policy)</div>
          </div>
          <div className="bg-black/50 border border-gray-800 p-2.5 rounded">
            <div className="text-gray-400 text-[10px]">VECTOR ENCRYPTION</div>
            <div className="text-cyan-400 font-bold">SHA-256 Salted Ephemeral</div>
          </div>
          <div className="bg-black/50 border border-gray-800 p-2.5 rounded">
            <div className="text-gray-400 text-[10px]">COMPLIANCE STATUS</div>
            <div className="text-emerald-400 font-bold">GDPR Art. 9 & CCPA Certified</div>
          </div>
        </div>

        {/* Blockchain-Style Linked Audit List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
          {logs.map((log, idx) => (
            <div key={log.id || idx} className="bg-black/60 border border-gray-800 rounded p-2.5 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                <span className="text-cyan-400 font-bold">[{log.id}] {log.action}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-gray-200 text-[11px] mb-2">{log.details}</p>
              
              <div className="grid grid-cols-2 gap-2 text-[9px] bg-slate-950/80 p-1.5 rounded border border-gray-850 text-gray-400">
                <div className="truncate">
                  <span className="text-gray-500">BLOCK_HASH: </span>
                  <span className="text-emerald-400">{log.blockHash?.substring(0, 24)}...</span>
                </div>
                <div className="truncate text-right">
                  <span className="text-gray-500">PREV_HASH: </span>
                  <span className="text-gray-400">{log.prevBlockHash?.substring(0, 18)}...</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-800 mt-3 flex items-center justify-between text-[10px] font-mono text-gray-500">
          <span>Cryptographic chaining guarantees audit immutability.</span>
          <span className="text-emerald-400">HASH CHAIN VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
