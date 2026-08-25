import React, { useState, useEffect } from 'react';
import { GraduationCap, AlertTriangle, CheckCircle, Eye, Users, UserX, Clock, FileText } from 'lucide-react';

export function ExamMode({ evaluation, biometrics }) {
  const [examTimeRemaining, setExamTimeRemaining] = useState(3600 - 845); // 45m 55s
  const [incidents, setIncidents] = useState([
    { id: 1, time: '10:14:02', type: 'INFO', text: 'Candidate identity enrolled & cryptographically bound.' },
    { id: 2, time: '10:18:30', type: 'INFO', text: 'Continuous facial liveness & eye gaze verified.' }
  ]);

  const [faceCount, setFaceCount] = useState(1);
  const [gazeStatus, setGazeStatus] = useState('CENTER_FOCUSED');

  // Exam timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setExamTimeRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isAnomalous = evaluation?.riskScore > 40;

  return (
    <div className="space-y-4">
      {/* Exam Header Banner */}
      <div className="cyber-card corner-bracket p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-950/60 border border-indigo-500/40 rounded-lg text-indigo-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-gray-100">
              NATIONAL ADVANCED CS CERTIFICATION EXAM — AI PROCTORING SENTINEL
            </h3>
            <p className="text-xs font-mono text-gray-400">
              Candidate ID: <b className="text-gray-200">CAND-8942-VIJAY</b> | Session: <b className="text-emerald-400">SECURE_ACTIVE</b>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 font-mono text-xs">
          <div className="text-right">
            <div className="text-gray-400 text-[10px]">TIME REMAINING</div>
            <div className="text-lg font-bold text-cyan-400 flex items-center gap-1">
              <Clock className="w-4 h-4" /> {formatTime(examTimeRemaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Exam Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* 1. Exam Integrity Score */}
        <div className="cyber-card p-3">
          <div className="text-[10px] font-mono text-gray-400 mb-1">EXAM INTEGRITY SCORE</div>
          <div className="font-display text-2xl font-bold text-emerald-400">
            {(100 - (evaluation?.riskScore || 5)).toFixed(1)}%
          </div>
          <div className="text-[10px] font-mono text-gray-400 mt-1">Status: <b className="text-emerald-400">NOMINAL</b></div>
        </div>

        {/* 2. Detected Faces in Frame */}
        <div className="cyber-card p-3">
          <div className="text-[10px] font-mono text-gray-400 mb-1">REGISTERED FACES</div>
          <div className="font-display text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>1 PRESENT</span>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">No secondary faces detected</div>
        </div>

        {/* 3. Eye Gaze Tracking */}
        <div className="cyber-card p-3">
          <div className="text-[10px] font-mono text-gray-400 mb-1">EYE GAZE COMPLIANCE</div>
          <div className="font-display text-2xl font-bold text-gray-100 flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-400" />
            <span>ON SCREEN</span>
          </div>
          <div className="text-[10px] font-mono text-gray-400 mt-1">Gaze Deviation: <b className="text-emerald-400">4.2°</b></div>
        </div>

        {/* 4. Deepfake / Replay Risk */}
        <div className="cyber-card p-3">
          <div className="text-[10px] font-mono text-gray-400 mb-1">DEEPFAKE RISK</div>
          <div className="font-display text-2xl font-bold text-gray-100">
            <span style={{ color: evaluation?.statusColor || '#00f5a0' }}>{evaluation?.riskScore || 4.2}%</span>
          </div>
          <div className="text-[10px] font-mono text-gray-400 mt-1">Replay: <b className="text-emerald-400">CLEAN</b></div>
        </div>
      </div>

      {/* Proctoring Incident Timeline & Question Paper Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Exam Question View */}
        <div className="cyber-card p-4 lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="font-display font-bold text-xs text-gray-200 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" /> QUESTION 14 / 30: DISTRIBUTED CONSENSUS
            </span>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
              4 MARKS
            </span>
          </div>

          <div className="text-xs text-gray-300 leading-relaxed font-sans">
            In the context of the Raft distributed consensus algorithm, explain why a candidate node increments its current term number immediately prior to broadcasting a <code>RequestVote</code> RPC to all peer cluster nodes.
          </div>

          <div className="space-y-2 text-xs font-sans">
            {[
              'To guarantee that stale leader heartbeats with lower term IDs are permanently rejected by the quorum.',
              'To force all follower nodes to immediately dump their in-memory state machines.',
              'To recalculate the SHA-256 state hash of the uncommitted log entries.',
              'To trigger dynamic leader election timeout randomization in client gateways.'
            ].map((option, idx) => (
              <label
                key={idx}
                className="flex items-center space-x-2 p-2.5 rounded bg-black/40 border border-gray-800 hover:border-gray-700 cursor-pointer"
              >
                <input type="radio" name="raft_q" defaultChecked={idx === 0} className="accent-emerald-500" />
                <span className="text-gray-300">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Proctoring Event Log */}
        <div className="cyber-card p-4 flex flex-col justify-between">
          <div>
            <div className="font-display font-bold text-xs text-gray-200 border-b border-gray-800 pb-2 mb-3">
              LIVE PROCTORING INCIDENT LOG
            </div>
            <div className="space-y-2 font-mono text-[10px]">
              {incidents.map(inc => (
                <div key={inc.id} className="bg-black/40 border border-gray-800 rounded p-2 text-gray-300">
                  <div className="flex items-center justify-between text-gray-500 mb-0.5">
                    <span>{inc.time}</span>
                    <span className="text-emerald-400 font-bold">{inc.type}</span>
                  </div>
                  <div>{inc.text}</div>
                </div>
              ))}
              {isAnomalous && (
                <div className="bg-rose-950/40 border border-rose-500/40 rounded p-2 text-rose-300 animate-pulse">
                  <div className="flex items-center justify-between text-rose-400 mb-0.5 font-bold">
                    <span>JUST NOW</span>
                    <span>ALERT</span>
                  </div>
                  <div>Elevated deepfake / proxy threat intercepted by firewall.</div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-gray-800 text-[10px] font-mono text-gray-500 flex items-center justify-between">
            <span>AUDIT CHAIN: SHA-256</span>
            <span className="text-emerald-400">TAMPER-PROOF</span>
          </div>
        </div>
      </div>
    </div>
  );
}
