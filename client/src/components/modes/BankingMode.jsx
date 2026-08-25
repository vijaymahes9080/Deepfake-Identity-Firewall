import React, { useState } from 'react';
import { Landmark, ShieldAlert, ArrowRight, CheckCircle2, Lock, AlertOctagon, Key } from 'lucide-react';
import confetti from 'canvas-confetti';

export function BankingMode({ evaluation, onTriggerChallenge }) {
  const [transactionAmount, setTransactionAmount] = useState('250,000.00');
  const [recipientIban, setRecipientIban] = useState('US89 APPL 9842 1092 3840 19');
  const [transactionState, setTransactionState] = useState('PENDING_AUTH'); // PENDING_AUTH | CHALLENGE_REQUIRED | AUTHORIZED | BLOCKED
  const [authStep, setAuthStep] = useState(1);

  const isHighRisk = evaluation?.riskScore > 50;

  const handleAuthorizeTransfer = () => {
    if (isHighRisk) {
      setTransactionState('BLOCKED');
      return;
    }

    if (evaluation?.riskScore > 20) {
      // Step-Up challenge required
      setTransactionState('CHALLENGE_REQUIRED');
      onTriggerChallenge();
    } else {
      setTransactionState('AUTHORIZED');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-4">
      {/* Banking Header */}
      <div className="cyber-card corner-bracket p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-950/60 border border-amber-500/40 rounded-lg text-amber-400">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-gray-100">
              GLOBAL INSTITUTIONAL ASSET TRANSFER & STEP-UP BIOMETRIC GATE
            </h3>
            <p className="text-xs font-mono text-gray-400">
              Account: <b className="text-gray-200">TREASURY_CORP_092</b> | Limit: <b className="text-emerald-400">$5,000,000 USD</b>
            </p>
          </div>
        </div>

        <div className="text-xs font-mono bg-slate-900 border border-gray-800 px-3 py-1.5 rounded flex items-center space-x-2">
          <span className="text-gray-400">TX SECURITY LEVEL:</span>
          <span className="text-amber-400 font-bold">TIER-4 STEP-UP GUARD</span>
        </div>
      </div>

      {/* Transaction Details & Step-Up Gate Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Transfer Form & Confirmation */}
        <div className="cyber-card p-4 lg:col-span-2 space-y-4">
          <div className="font-display font-bold text-xs text-gray-200 border-b border-gray-800 pb-2">
            WIRE TRANSFER SPECIFICATION
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">TRANSFER AMOUNT (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 font-bold">$</span>
                <input
                  type="text"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  className="w-full bg-black/60 border border-gray-700 rounded px-7 py-1.5 text-emerald-400 font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 block mb-1">RECIPIENT ROUTING / IBAN</label>
              <input
                type="text"
                value={recipientIban}
                onChange={(e) => setRecipientIban(e.target.value)}
                className="w-full bg-black/60 border border-gray-700 rounded px-3 py-1.5 text-gray-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Biometric Safeguard Overview */}
          <div className="bg-black/50 border border-gray-800 rounded p-3 text-xs space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-gray-400">Step 1: Multimodal Deepfake Verification</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASSED (94.2%)
              </span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-gray-400">Step 2: Synthetic Voice Anti-Spoofing</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> PASSED (98.9%)
              </span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-gray-400">Step 3: Device Driver Trust & WebRTC Integrity</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> HARDWARE_SENSOR_DIRECT
              </span>
            </div>
          </div>

          {/* Action Button */}
          {transactionState === 'AUTHORIZED' ? (
            <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-lg p-3 flex items-center justify-between text-emerald-300 font-mono text-xs">
              <span className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                TRANSACTION EXECUTED: $250,000.00 SETTLED ON FEDWIRE
              </span>
              <button
                onClick={() => setTransactionState('PENDING_AUTH')}
                className="px-2 py-1 rounded bg-emerald-900/60 border border-emerald-500 text-emerald-200 text-[10px]"
              >
                NEW TRANSFER
              </button>
            </div>
          ) : transactionState === 'BLOCKED' ? (
            <div className="bg-rose-950/40 border border-rose-500/50 rounded-lg p-3 flex items-center justify-between text-rose-300 font-mono text-xs">
              <span className="flex items-center gap-2 font-bold">
                <AlertOctagon className="w-5 h-5 text-rose-400" />
                TRANSACTION REJECTED: HIGH DEEPFAKE / IDENTITY RISK DETECTED
              </span>
              <button
                onClick={() => setTransactionState('PENDING_AUTH')}
                className="px-2 py-1 rounded bg-rose-900/60 border border-rose-500 text-rose-200 text-[10px]"
              >
                RE-EVALUATE
              </button>
            </div>
          ) : (
            <button
              onClick={handleAuthorizeTransfer}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-display font-bold py-2.5 rounded-lg text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <Key className="w-4 h-4" />
              <span>BIOMETRICALLY AUTHORIZE $250,000.00 WIRE</span>
            </button>
          )}
        </div>

        {/* Right: Real-Time Risk Gating Panel */}
        <div className="cyber-card p-4 flex flex-col justify-between">
          <div>
            <div className="font-display font-bold text-xs text-gray-200 border-b border-gray-800 pb-2 mb-3">
              BANKING RISK GATE METRICS
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="text-[10px] text-gray-400">TRANSACTION RISK LEVEL</div>
                <div className="text-xl font-bold mt-0.5" style={{ color: evaluation?.statusColor || '#00f5a0' }}>
                  {evaluation?.status || 'TRUSTED'} ({evaluation?.riskScore || 6.4}%)
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-400">STEP-UP CHALLENGE POLICY</div>
                <div className="text-gray-200 text-xs mt-0.5">
                  Threshold &gt; 20% requires dynamic nonce challenge response before clearing funds.
                </div>
              </div>

              <div>
                <div className="text-[10px] text-gray-400">CRYPTOGRAPHIC AUDIT ID</div>
                <div className="text-[10px] text-gray-400 bg-black/60 p-1.5 rounded border border-gray-800 break-all">
                  tx_0x9a8f4c2e1b849204859a0f3d
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800 text-[10px] font-mono text-gray-500">
            PCI-DSS & ISO-27001 Biometric Compliant
          </div>
        </div>
      </div>
    </div>
  );
}
