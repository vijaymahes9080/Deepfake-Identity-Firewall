import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowLeft, ArrowRight, ArrowUp, RefreshCw, X, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ChallengeModal({ isOpen, onClose, onChallengeCompleted }) {
  const [challengeData, setChallengeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(15);
  const [stage, setStage] = useState('PROMPT'); // PROMPT | VERIFYING | SUCCESS | FAILED
  const [verificationLatency, setVerificationLatency] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchNewChallenge();
    }
  }, [isOpen]);

  const fetchNewChallenge = async () => {
    setLoading(true);
    setStage('PROMPT');
    setTimer(15);

    try {
      const res = await fetch('/api/v1/challenge/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: 'session_active_demo' })
      });
      const data = await res.json();
      if (data.success) {
        setChallengeData(data.challenge);
      }
    } catch (e) {
      // Fallback local challenge if offline
      setChallengeData({
        challengeId: `ch_${Date.now()}`,
        requiredDirection: 'LEFT (35°)',
        nonceCode: '7 4 9 2',
        instructions: 'Please turn your head LEFT (35°), then clearly speak the code: "7 4 9 2"'
      });
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    let interval;
    if (isOpen && stage === 'PROMPT' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && stage === 'PROMPT') {
      setStage('FAILED');
    }
    return () => clearInterval(interval);
  }, [isOpen, stage, timer]);

  const handleSimulatePass = async () => {
    setStage('VERIFYING');
    const startTime = Date.now();

    setTimeout(async () => {
      const latency = Date.now() - startTime + 850;
      setVerificationLatency(latency);

      try {
        await fetch('/api/v1/challenge/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeId: challengeData?.challengeId,
            response: {
              headMovementMatch: true,
              voiceNonceMatch: true,
              responseLatencyMs: latency
            }
          })
        });
      } catch (e) {}

      setStage('SUCCESS');
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
      } catch (e) {}

      if (onChallengeCompleted) onChallengeCompleted(true);
    }, 1200);
  };

  const handleSimulateFail = () => {
    setStage('FAILED');
    if (onChallengeCompleted) onChallengeCompleted(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="cyber-card corner-bracket w-full max-w-md p-5 border-emerald-500/60 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-2 border-b border-gray-800 pb-3 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="font-display font-bold text-sm text-gray-100">
            CHALLENGE.AI — DYNAMIC BIOMETRIC NONCE GATE
          </h3>
        </div>

        {stage === 'PROMPT' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">NONCE TIMEOUT:</span>
              <span className={`font-bold px-2 py-0.5 rounded ${timer < 5 ? 'text-rose-400 bg-rose-950 border border-rose-800' : 'text-emerald-400 bg-emerald-950 border border-emerald-800'}`}>
                {timer}s
              </span>
            </div>

            {/* Instruction Box */}
            <div className="bg-black/60 border border-gray-700 rounded-lg p-4 text-center space-y-3">
              <div className="text-xs font-mono text-gray-400">REQUIRED SPATIAL MOTION:</div>
              <div className="text-base font-display font-bold text-cyan-400 flex items-center justify-center gap-2">
                <ArrowLeft className="w-5 h-5 animate-pulse" />
                <span>{challengeData?.requiredDirection || 'TURN LEFT (35°)'}</span>
              </div>

              <div className="text-xs font-mono text-gray-400 pt-2 border-t border-gray-800">
                SPEAK THIS EPHEMERAL OTP NONCE:
              </div>
              <div className="font-mono text-2xl font-bold tracking-widest text-emerald-400 bg-black/80 py-2 rounded border border-emerald-500/30">
                {challengeData?.nonceCode || '8 4 9 1'}
              </div>
            </div>

            <p className="text-[11px] text-gray-400 font-mono text-center">
              Replay media and AI face-swaps fail dynamic nonces with unpredictable directional and phonetic challenges.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleSimulatePass}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold py-2 rounded text-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>SUBMIT LIVE ACTION</span>
              </button>

              <button
                onClick={handleSimulateFail}
                className="bg-rose-950 hover:bg-rose-900 border border-rose-600/60 text-rose-300 font-display font-bold py-2 rounded text-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>SIMULATE BOT SPOOF</span>
              </button>
            </div>
          </div>
        )}

        {stage === 'VERIFYING' && (
          <div className="py-8 text-center flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin" />
            <h4 className="font-display font-bold text-sm text-gray-200">CROSS-EXAMINING MULTIMODAL NONCE...</h4>
            <p className="text-xs font-mono text-gray-400">Verifying phoneme acoustic timing vs head landmark trajectory.</p>
          </div>
        )}

        {stage === 'SUCCESS' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-emerald-400">DYNAMIC CHALLENGE AUTHENTICATED</h4>
              <p className="text-xs font-mono text-gray-400 mt-1">
                Biological reaction verified in <b>{(verificationLatency / 1000).toFixed(2)}s</b>. Identity confirmed.
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-display font-bold px-6 py-2 rounded text-xs transition-all"
            >
              RESUME SECURE SESSION
            </button>
          </div>
        )}

        {stage === 'FAILED' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-950 border border-rose-500 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8 text-rose-400" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-rose-400">CHALLENGE VERIFICATION FAILED</h4>
              <p className="text-xs font-mono text-gray-400 mt-1">
                Head trajectory or acoustic nonce mismatch. Replay / Deepfake defense triggered.
              </p>
            </div>
            <div className="flex space-x-2 justify-center">
              <button
                onClick={fetchNewChallenge}
                className="bg-slate-800 hover:bg-slate-700 text-gray-200 font-mono text-xs px-4 py-2 rounded"
              >
                TRY NEW CHALLENGE
              </button>
              <button
                onClick={onClose}
                className="bg-rose-900 hover:bg-rose-800 text-rose-200 font-mono text-xs px-4 py-2 rounded"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
