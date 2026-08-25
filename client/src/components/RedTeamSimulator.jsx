import React, { useState } from 'react';
import { Skull, Play, Square, Zap, Shield, AlertTriangle, Sliders, RefreshCw, CheckCircle2 } from 'lucide-react';

export function RedTeamSimulator({ onSimulateAttack, activeSimulation, evaluation }) {
  const [selectedVectors, setSelectedVectors] = useState({
    face_swap: false,
    voice_clone: false,
    virtual_cam: false,
    screen_replay: false,
    lip_desync: false,
    identity_switch: false,
    behavior_macro: false
  });

  const [intensity, setIntensity] = useState(0.85);
  const [isRunningSequence, setIsRunningSequence] = useState(false);

  const attackDefinitions = [
    {
      id: 'face_swap',
      name: 'Neural Face Swap (SimSwap/GAN)',
      category: 'Video AI',
      desc: 'Injects facial boundary blending artifacts & frequency-domain DCT energy spikes.',
      mitigation: 'FaceShield DCT Spectral Filter & Gradient Inpainting Guard'
    },
    {
      id: 'voice_clone',
      name: 'AI Synthetic Voice Clone (VITS)',
      category: 'Audio AI',
      desc: 'Injects neural acoustic synthesizer vocoder phase discontinuity & unnatural pitch harmonics.',
      mitigation: 'VoiceShield Vocoder Phase Continuity & Harmonic Ratio Check'
    },
    {
      id: 'virtual_cam',
      name: 'Virtual Camera Driver Hook (OBS)',
      category: 'Driver / OS',
      desc: 'Bypasses hardware sensor by hooking DirectShow / MediaStream virtual software loopback.',
      mitigation: 'DeviceTrust Direct Sensor Probe & Virtual Driver Registry Audit'
    },
    {
      id: 'screen_replay',
      name: '4K Display Screen Replay (PAD)',
      category: 'Presentation',
      desc: 'Simulates high-density iPad/monitor video replay with Moire raster patterns & flat depth.',
      mitigation: 'ReplayGuard 2D Moire Spatial Analyzer & Photometric Flash Response'
    },
    {
      id: 'lip_desync',
      name: 'Audio-Visual Lip Desync (Dubbing)',
      category: 'Cross-Modal',
      desc: 'Injects +180ms audio latency delta between lip landmark motion and acoustic envelope.',
      mitigation: 'SyncGuard Phoneme-Viseme Cross-Correlation Time Delta Matrix'
    },
    {
      id: 'identity_switch',
      name: 'Identity Substitution / Proxy Switch',
      category: 'Biometric Drift',
      desc: 'Substitutes enrolled biometric vector with a proxy candidate mid-session.',
      mitigation: 'IdentityContinuity Temporal Embedding Cosine Tracker'
    },
    {
      id: 'behavior_macro',
      name: 'Synthetic Macro Bot Automation',
      category: 'Behavioral',
      desc: 'Injects zero-entropy linear mouse trajectory vectors and quantized keystrokes.',
      mitigation: 'BehaviourID Keystroke Flight-Time & Mouse Entropy Scorer'
    }
  ];

  const handleToggleVector = (id) => {
    const next = { ...selectedVectors, [id]: !selectedVectors[id] };
    setSelectedVectors(next);

    const activeKeys = Object.keys(next).filter(k => next[k]);
    onSimulateAttack(activeKeys, intensity);
  };

  const handleIntensityChange = (val) => {
    setIntensity(val);
    const activeKeys = Object.keys(selectedVectors).filter(k => selectedVectors[k]);
    if (activeKeys.length > 0) {
      onSimulateAttack(activeKeys, val);
    }
  };

  const handleClearAll = () => {
    const cleared = {
      face_swap: false,
      voice_clone: false,
      virtual_cam: false,
      screen_replay: false,
      lip_desync: false,
      identity_switch: false,
      behavior_macro: false
    };
    setSelectedVectors(cleared);
    onSimulateAttack([], intensity);
  };

  const handleRunFullChainAttack = async () => {
    setIsRunningSequence(true);
    const allKeys = ['virtual_cam', 'face_swap', 'voice_clone', 'screen_replay'];
    
    for (let i = 0; i < allKeys.length; i++) {
      const active = allKeys.slice(0, i + 1);
      const stateObj = { ...selectedVectors };
      active.forEach(k => { stateObj[k] = true; });
      setSelectedVectors(stateObj);
      onSimulateAttack(active, intensity);
      await new Promise(r => setTimeout(r, 1200));
    }
    setIsRunningSequence(false);
  };

  const activeCount = Object.values(selectedVectors).filter(Boolean).length;

  return (
    <div className="cyber-card corner-bracket p-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <Skull className="w-4 h-4 text-rose-500 animate-pulse" />
          <span className="font-display font-semibold tracking-wider text-sm text-gray-200">
            ADVERSARIAL AI RED-TEAM ATTACK SIMULATOR
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {activeCount > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-mono text-gray-400 hover:text-gray-200 px-2 py-1 rounded bg-slate-900 border border-gray-800"
            >
              RESET VECTORS
            </button>
          )}

          <button
            onClick={handleRunFullChainAttack}
            disabled={isRunningSequence}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-rose-600/40 to-amber-600/40 hover:from-rose-600/60 hover:to-amber-600/60 border border-rose-500/50 text-rose-200 px-3 py-1 rounded text-xs font-mono transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{isRunningSequence ? 'EXECUTING EXPLOIT CHAIN...' : 'RUN FULL CHAIN EXPLOIT'}</span>
          </button>
        </div>
      </div>

      {/* Intensity Slider Bar */}
      <div className="bg-black/50 border border-gray-800 rounded p-3 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-xs font-mono font-bold text-gray-200">ATTACK SYNTHESIS INTENSITY</div>
            <div className="text-[10px] text-gray-400 font-mono">Controls GAN artifact blending threshold & noise variance</div>
          </div>
        </div>
        <div className="flex items-center space-x-3 w-1/3">
          <input
            type="range"
            min="0.2"
            max="1.0"
            step="0.05"
            value={intensity}
            onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />
          <span className="font-mono font-bold text-rose-400 text-xs w-12 text-right">
            {Math.round(intensity * 100)}%
          </span>
        </div>
      </div>

      {/* Attack Vectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {attackDefinitions.map(vector => {
          const isActive = selectedVectors[vector.id];

          return (
            <div
              key={vector.id}
              onClick={() => handleToggleVector(vector.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isActive
                  ? 'bg-rose-950/40 border-rose-500/80 shadow-lg shadow-rose-500/20'
                  : 'bg-black/40 border-gray-800 hover:border-gray-700 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-gray-400 bg-slate-900 px-1.5 py-0.5 rounded border border-gray-800">
                  {vector.category}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    isActive
                      ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                      : 'bg-gray-800 text-gray-400 border-gray-700'
                  }`}
                >
                  {isActive ? 'INJECTED (ACTIVE)' : 'INACTIVE'}
                </span>
              </div>

              <h4 className={`font-display font-bold text-xs mb-1 ${isActive ? 'text-rose-200' : 'text-gray-200'}`}>
                {vector.name}
              </h4>

              <p className="text-[11px] text-gray-400 leading-relaxed mb-2">
                {vector.desc}
              </p>

              <div className="pt-2 border-t border-gray-800/80 text-[10px] font-mono">
                <span className="text-gray-500">DEFENSE: </span>
                <span className="text-emerald-400 font-semibold">{vector.mitigation}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Attack Status Bar */}
      <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-gray-300">
            ACTIVE ADVERSARIAL THREATS: <b className="text-rose-400">{activeCount} / 7 VECTORS</b>
          </span>
        </div>
        <div className="text-gray-400">
          AUTOMATED FIREWALL MITIGATION: <b className="text-emerald-400">STANDBY INTERCEPT</b>
        </div>
      </div>
    </div>
  );
}
