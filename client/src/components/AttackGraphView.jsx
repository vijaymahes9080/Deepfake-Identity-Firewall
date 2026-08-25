import React from 'react';
import { GitBranch, Shield, AlertTriangle, Cpu, Radio, Video, Mic, Smartphone, Check, X } from 'lucide-react';

export function AttackGraphView({ attackGraph, evaluation }) {
  const { nodes = [], edges = [], attackPathDetected = false, entryPoint = 'Direct Sensor' } = attackGraph || {};
  const isHighRisk = evaluation?.riskScore > 60;

  // Visual layout coordinates for nodes
  const nodePositions = {
    sensor_cam: { x: 60, y: 50, icon: Video },
    virtual_driver: { x: 220, y: 50, icon: Smartphone },
    face_swap: { x: 380, y: 50, icon: AlertTriangle },
    mic_sensor: { x: 60, y: 170, icon: Mic },
    voice_clone: { x: 220, y: 170, icon: Radio },
    replay_stream: { x: 220, y: 280, icon: Video },
    sync_combiner: { x: 530, y: 110, icon: Cpu },
    firewall_gate: { x: 680, y: 110, icon: Shield },
    auth_session: { x: 820, y: 110, icon: Check }
  };

  return (
    <div className="cyber-card corner-bracket p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <span className="font-display font-semibold tracking-wider text-sm text-gray-200">
            DYNAMIC IDENTITY ATTACK GRAPH & INTRUSION CHAIN
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-gray-400">ENTRY POINT:</span>
          <span className={`px-2 py-0.5 rounded border ${
            attackPathDetected
              ? 'bg-rose-950/40 text-rose-300 border-rose-600/40'
              : 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40'
          }`}>
            {entryPoint}
          </span>
        </div>
      </div>

      {/* SVG Canvas for Topological Attack Pipeline */}
      <div className="w-full bg-black/60 rounded-lg p-2 border border-gray-800 overflow-x-auto">
        <svg viewBox="0 0 900 330" className="w-full h-64 min-w-[750px]">
          {/* Gradients and Filters */}
          <defs>
            <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-crimson" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="edge-clean" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f5a0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00f5a0" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="edge-malicious" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff5400" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ff0055" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Render Edges (Connecting Lines) */}
          {edges.map((edge, idx) => {
            const fromPos = nodePositions[edge.from];
            const toPos = nodePositions[edge.to];
            if (!fromPos || !toPos) return null;

            const isMalicious = edge.malicious;
            const strokeColor = isMalicious ? '#ff0055' : edge.active ? '#00f5a0' : 'rgba(255, 255, 255, 0.1)';
            const strokeWidth = isMalicious ? 2.5 : edge.active ? 1.5 : 1;

            return (
              <g key={idx}>
                <line
                  x1={fromPos.x + 35}
                  y1={fromPos.y + 20}
                  x2={toPos.x}
                  y2={toPos.y + 20}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isMalicious ? '6,4' : 'none'}
                  className={isMalicious ? 'animate-pulse' : ''}
                />
                {/* Flow particles if edge is active */}
                {edge.active && (
                  <circle
                    r={isMalicious ? 3 : 2}
                    fill={isMalicious ? '#ff0055' : '#00f5a0'}
                    filter={isMalicious ? 'url(#glow-crimson)' : 'url(#glow-emerald)'}
                  >
                    <animateMotion
                      path={`M ${fromPos.x + 35} ${fromPos.y + 20} L ${toPos.x} ${toPos.y + 20}`}
                      dur={isMalicious ? '1.5s' : '3s'}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map(node => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const isBreached = node.state === 'BREACHED' || node.state === 'WARNING';
            const isFirewall = node.id === 'firewall_gate';
            const isSession = node.id === 'auth_session';

            let borderColor = '#00f5a0';
            let bgColor = 'rgba(13, 22, 35, 0.9)';
            let textColor = '#e2e8f0';

            if (isBreached) {
              borderColor = '#ff0055';
              bgColor = 'rgba(60, 10, 20, 0.95)';
              textColor = '#ff6b8b';
            } else if (isFirewall) {
              borderColor = isHighRisk ? '#ff0055' : '#00d4ff';
              bgColor = isHighRisk ? 'rgba(50, 10, 20, 0.95)' : 'rgba(10, 30, 50, 0.95)';
            } else if (isSession) {
              borderColor = isHighRisk ? '#ff0055' : '#00f5a0';
            }

            const IconComponent = pos.icon || Shield;

            return (
              <g key={node.id} transform={`translate(${pos.x - 30}, ${pos.y})`}>
                {/* Node Box */}
                <rect
                  x="0"
                  y="0"
                  width="110"
                  height="45"
                  rx="6"
                  fill={bgColor}
                  stroke={borderColor}
                  strokeWidth={isBreached || isFirewall ? 2 : 1}
                  filter={isBreached ? 'url(#glow-crimson)' : undefined}
                />

                {/* Node Text & Label */}
                <text x="8" y="16" fill="#94a3b8" fontSize="8" fontFamily="'JetBrains Mono', monospace">
                  {node.layer.toUpperCase()}
                </text>
                <text x="8" y="32" fill={textColor} fontSize="9" fontWeight="bold" fontFamily="'Inter', sans-serif">
                  {node.label.length > 15 ? node.label.substring(0, 14) + '…' : node.label}
                </text>

                {/* Status Indicator Dot */}
                <circle
                  cx="100"
                  cy="12"
                  r="3.5"
                  fill={isBreached ? '#ff0055' : '#00f5a0'}
                  className={isBreached ? 'animate-pulse' : ''}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Attack Graph Explanation Footer */}
      <div className="grid grid-cols-3 gap-2 mt-3 text-xs font-mono">
        <div className="bg-black/40 border border-gray-800 rounded p-2 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-gray-300 text-[11px]">Direct Sensor Route: <b className="text-emerald-400">Active</b></span>
        </div>
        <div className="bg-black/40 border border-gray-800 rounded p-2 flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${attackPathDetected ? 'bg-rose-500 animate-ping' : 'bg-gray-600'}`} />
          <span className="text-gray-300 text-[11px]">Adversarial Pathway: <b className={attackPathDetected ? 'text-rose-400' : 'text-gray-400'}>{attackPathDetected ? 'DETECTED & ISOLATED' : 'CLEAR'}</b></span>
        </div>
        <div className="bg-black/40 border border-gray-800 rounded p-2 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-gray-300 text-[11px]">Firewall Gate: <b className="text-cyan-400">Zero-Trust Intercept</b></span>
        </div>
      </div>
    </div>
  );
}
