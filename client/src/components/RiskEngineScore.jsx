import React from 'react';
import { ShieldCheck, ShieldAlert, AlertOctagon, Flame, CheckCircle, Info } from 'lucide-react';

export function RiskEngineScore({ evaluation }) {
  const {
    riskScore = 8.2,
    confidenceScore = 91.8,
    status = 'TRUSTED',
    statusColor = '#00f5a0',
    actionRequired = 'PASS',
    threatFactors = [],
    breakdown = {}
  } = evaluation || {};

  // Compute SVG Circle gauge path
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (riskScore / 100) * circumference;

  return (
    <div className="cyber-card corner-bracket p-4 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-display font-semibold tracking-wider text-sm text-gray-200">
            AI IDENTITY RISK ENGINE
          </span>
        </div>
        <span
          className="text-xs font-mono px-2.5 py-0.5 rounded-full font-bold border"
          style={{
            color: statusColor,
            borderColor: `${statusColor}60`,
            backgroundColor: `${statusColor}15`
          }}
        >
          {status}
        </span>
      </div>

      {/* Main Gauge Dial & Big Numbers */}
      <div className="flex items-center justify-around my-2">
        {/* SVG Circular Gauge */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Dynamic Value Ring */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={statusColor}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${statusColor}80)`
              }}
            />
          </svg>
          {/* Centered Readout */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold tracking-tight" style={{ color: statusColor }}>
              {riskScore}%
            </span>
            <span className="text-[10px] font-mono text-gray-400">RISK INDEX</span>
          </div>
        </div>

        {/* Confidence & Action Required */}
        <div className="flex flex-col space-y-2 text-right">
          <div>
            <div className="text-[11px] font-mono text-gray-400">IDENTITY CONFIDENCE</div>
            <div className="font-display text-xl font-bold text-emerald-400">{confidenceScore}%</div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-gray-400">GATEWAY POLICY</div>
            <div className="font-mono text-xs font-semibold text-gray-200 bg-slate-900 px-2 py-1 rounded border border-gray-800 inline-block">
              {actionRequired}
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="space-y-1.5 my-2">
        <div className="text-[11px] font-mono text-gray-400 font-semibold mb-1">
          MULTIMODAL LAYER BREAKDOWN
        </div>

        {Object.entries(breakdown).map(([key, item]) => {
          const isLayerRisk = item.score > 40;
          const barColor = item.score > 60 ? '#ff0055' : item.score > 35 ? '#ffb703' : '#00f5a0';

          return (
            <div key={key} className="flex items-center text-xs font-mono">
              <span className="w-40 text-gray-400 truncate text-[11px]">{item.label}</span>
              <div className="flex-1 bg-gray-900 h-2 rounded-full overflow-hidden mx-2 border border-gray-800">
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.min(100, Math.max(4, item.score))}%`,
                    backgroundColor: barColor
                  }}
                />
              </div>
              <span
                className="w-10 text-right font-bold text-[11px]"
                style={{ color: isLayerRisk ? barColor : '#cbd5e1' }}
              >
                {item.score}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Threat Alerts Area */}
      <div className="mt-2 pt-2 border-t border-gray-800">
        {threatFactors.length === 0 ? (
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono bg-emerald-950/20 border border-emerald-500/20 rounded p-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>All 8 biometric & context layers verified authentic. No anomalies detected.</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            {threatFactors.map((threat, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 text-rose-300 text-xs font-mono bg-rose-950/30 border border-rose-500/30 rounded p-1.5 animate-pulse"
              >
                <AlertOctagon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1 text-[11px]">
                  <span className="font-bold text-rose-200">[{threat.module}]</span> {threat.threat}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
