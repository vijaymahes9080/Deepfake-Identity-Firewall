import React, { useState } from 'react';
import { Briefcase, CheckCircle, AlertTriangle, Code, Terminal, UserCheck, Mic, Video } from 'lucide-react';

export function InterviewMode({ evaluation, biometrics }) {
  const [candidateName] = useState('Vijay Mahes');
  const [role] = useState('Senior Staff AI / Security Engineer');
  const [codeSnippet, setCodeSnippet] = useState(
`// Candidate Live Coding Exercise: Zero-Knowledge Range Proof Verification
function verifyZKProof(commitment, response, challengeNonce) {
    const computedHash = sha256(commitment + challengeNonce);
    return computedHash.substring(0, 8) === response.substring(0, 8);
}`
  );

  const continuityScore = Math.max(88, 100 - (evaluation?.riskScore || 5));

  return (
    <div className="space-y-4">
      {/* Interview Header */}
      <div className="cyber-card corner-bracket p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-emerald-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-gray-100">
              TECHNICAL INTERVIEW CANDIDATE IDENTITY & AUTHENTICITY SENTINEL
            </h3>
            <p className="text-xs font-mono text-gray-400">
              Candidate: <b className="text-gray-200">{candidateName}</b> | Role: <b className="text-cyan-400">{role}</b>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-gray-400">INTERVIEW STATUS:</span>
          <span className="text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-500/40 px-2 py-0.5 rounded">
            IDENTITY_VERIFIED
          </span>
        </div>
      </div>

      {/* Candidate Scorecard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* 1. Identity Continuity */}
        <div className="cyber-card p-3">
          <div className="text-[10px] font-mono text-gray-400 mb-1">CANDIDATE CONTINUITY</div>
          <div className="font-display text-2xl font-bold text-emerald-400">{continuityScore.toFixed(1)}%</div>
          <div className="text-[10px] font-mono text-gray-400 mt-1">Zero proxy switching detected</div>
        </div>

        {/* 2. Voice Clone Anti-Spoofing */}
        <div className="cyber-card p-3">
          <div className="text-[10px] font-mono text-gray-400 mb-1">VOICE AUTHENTICITY</div>
          <div className="font-display text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Mic className="w-5 h-5 text-cyan-400" />
            <span>NATURAL</span>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">Vocoder phase check: Clean</div>
        </div>

        {/* 3. Virtual Camera Detection */}
        <div className="cyber-card p-3">
          <div className="text-[10px] font-mono text-gray-400 mb-1">DEVICE INTEGRITY</div>
          <div className="font-display text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Video className="w-5 h-5 text-emerald-400" />
            <span>DIRECT SENSOR</span>
          </div>
          <div className="text-[10px] font-mono text-gray-400 mt-1">No OBS/ManyCam driver hooks</div>
        </div>

        {/* 4. Lip-Sync Concordance */}
        <div className="cyber-card p-3">
          <div className="text-[10px] font-mono text-gray-400 mb-1">LIP-AUDIO SYNC DELTA</div>
          <div className="font-display text-2xl font-bold text-emerald-400">12 ms</div>
          <div className="text-[10px] font-mono text-gray-400 mt-1">Phoneme alignment: 98.4%</div>
        </div>
      </div>

      {/* Live Coding Sandbox & Identity Sentinel Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Code Editor */}
        <div className="cyber-card p-4 lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="font-display font-bold text-xs text-gray-200 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-emerald-400" /> LIVE INTERVIEW CODING WORKSPACE
            </span>
            <span className="text-[10px] font-mono text-gray-400">JAVASCRIPT / NODE.JS</span>
          </div>

          <textarea
            rows={7}
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            className="w-full bg-black/80 font-mono text-xs text-emerald-300 p-3 rounded border border-gray-800 focus:border-emerald-500 focus:outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-1">
            <span>Keystroke Flight Dynamics: <b>142ms (Human Variance Nominal)</b></span>
            <span className="text-emerald-400">Continuous Behavioral Signature: VALID</span>
          </div>
        </div>

        {/* Interview Integrity Checklist */}
        <div className="cyber-card p-4 flex flex-col justify-between">
          <div>
            <div className="font-display font-bold text-xs text-gray-200 border-b border-gray-800 pb-2 mb-3">
              INTEGRITY VERIFICATION CRITERIA
            </div>

            <div className="space-y-2.5 font-mono text-[11px]">
              <div className="flex items-center justify-between text-gray-300">
                <span>Real-Person Liveness</span>
                <span className="text-emerald-400 font-bold">VERIFIED</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>Face Authenticity (No Swap)</span>
                <span className="text-emerald-400 font-bold">VERIFIED</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>Voice Clone Detection</span>
                <span className="text-emerald-400 font-bold">CLEAN</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>Pre-Recorded Video Replay</span>
                <span className="text-emerald-400 font-bold">NEGATIVE</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span>Identity Continuity</span>
                <span className="text-emerald-400 font-bold">100% CONSTANT</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800 text-[10px] font-mono text-gray-500">
            Note: System evaluates technical authenticity and identity continuity only.
          </div>
        </div>
      </div>
    </div>
  );
}
