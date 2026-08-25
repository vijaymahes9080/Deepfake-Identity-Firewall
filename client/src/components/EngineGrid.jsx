import React from 'react';
import { 
  ShieldAlert, Eye, Mic, Zap, Repeat, Smartphone, 
  MousePointer, Cpu, GitBranch, Lock, Sparkles, Terminal 
} from 'lucide-react';

export function EngineGrid({ evaluation }) {
  const isHighRisk = evaluation?.riskScore > 60;
  const isSuspicious = evaluation?.riskScore > 35;

  const engines = [
    {
      id: 'faceshield',
      name: 'FaceShield',
      role: 'Deepfake & Face-Swap Guard',
      icon: ShieldAlert,
      accuracy: '99.4%',
      latency: '14ms',
      status: evaluation?.breakdown?.face?.score > 40 ? 'ALERT' : 'NOMINAL',
      desc: 'Frequency-domain DCT spectral filtering & neural boundary blending detection.'
    },
    {
      id: 'liveproof',
      name: 'LiveProof',
      role: 'Biological Liveness & rPPG',
      icon: Eye,
      accuracy: '98.8%',
      latency: '18ms',
      status: evaluation?.breakdown?.liveness?.score > 40 ? 'ALERT' : 'NOMINAL',
      desc: 'Remote photoplethysmography pulse rhythm, pupil contraction & micro-saccades.'
    },
    {
      id: 'voiceshield',
      name: 'VoiceShield',
      role: 'Synthetic Voice & Clone Blocker',
      icon: Mic,
      accuracy: '99.1%',
      latency: '22ms',
      status: evaluation?.breakdown?.voice?.score > 40 ? 'ALERT' : 'NOMINAL',
      desc: 'Vocoder phase continuity, harmonic ratio anomalies & TTS artifacts.'
    },
    {
      id: 'syncguard',
      name: 'SyncGuard',
      role: 'Lip-Audio Synchronization',
      icon: Zap,
      accuracy: '98.5%',
      latency: '16ms',
      status: evaluation?.breakdown?.sync?.score > 40 ? 'ALERT' : 'NOMINAL',
      desc: 'Phoneme-viseme cross-modal correlation with millisecond temporal delta.'
    },
    {
      id: 'replayguard',
      name: 'ReplayGuard',
      role: 'Presentation Attack Detection (PAD)',
      icon: Repeat,
      accuracy: '97.9%',
      latency: '20ms',
      status: evaluation?.breakdown?.replay?.score > 40 ? 'ALERT' : 'NOMINAL',
      desc: 'Screen Moire raster pattern, bezel reflection & 3D photometric reflectance.'
    },
    {
      id: 'devicetrust',
      name: 'DeviceTrust',
      role: 'Hardware & Driver Integrity',
      icon: Smartphone,
      accuracy: '99.6%',
      latency: '8ms',
      status: evaluation?.breakdown?.device?.score > 40 ? 'ALERT' : 'NOMINAL',
      desc: 'Virtual video driver hooks (OBS/ManyCam), WebGL GPU signature & sandbox verification.'
    },
    {
      id: 'behaviourid',
      name: 'BehaviourID',
      role: 'Behavioral Biometrics',
      icon: MousePointer,
      accuracy: '96.4%',
      latency: '30ms',
      status: evaluation?.breakdown?.behavior?.score > 40 ? 'ALERT' : 'NOMINAL',
      desc: 'Keystroke flight intervals, mouse trajectory velocity & interaction entropy.'
    },
    {
      id: 'riskfusion',
      name: 'RiskFusion',
      role: 'Multimodal Bayesian Risk Engine',
      icon: Cpu,
      accuracy: '99.7%',
      latency: '5ms',
      status: isHighRisk ? 'ALERT' : isSuspicious ? 'ELEVATED' : 'NOMINAL',
      desc: 'Non-linear multimodal threat aggregation & 0-100 composite index calculation.'
    },
    {
      id: 'attackgraph',
      name: 'AttackGraph',
      role: 'Dynamic Threat Chain Tracker',
      icon: GitBranch,
      accuracy: '100%',
      latency: '6ms',
      status: 'NOMINAL',
      desc: 'Real-time topological reconstruction of sensor-to-account exploit pathways.'
    },
    {
      id: 'challengeai',
      name: 'ChallengeAI',
      role: 'Adaptive Dynamic Nonces',
      icon: Sparkles,
      accuracy: '99.8%',
      latency: '15ms',
      status: 'ACTIVE',
      desc: 'Dynamic spatial directional head movements & cryptographic spoken OTP nonces.'
    },
    {
      id: 'privacyvault',
      name: 'PrivacyVault',
      role: 'Zero-Knowledge Biometric Vault',
      icon: Lock,
      accuracy: '100%',
      latency: '2ms',
      status: 'SECURE',
      desc: 'Zero raw-media retention, salted SHA-256 vector hashing & tamper-evident audit logs.'
    },
    {
      id: 'identityapi',
      name: 'IdentityAPI',
      role: 'Enterprise Developer SDK',
      icon: Terminal,
      accuracy: '99.9%',
      latency: '10ms',
      status: 'READY',
      desc: 'High-throughput REST and WebSocket endpoints for Banking, Exams & Enterprise.'
    }
  ];

  return (
    <div className="cyber-card corner-bracket p-4">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span className="font-display font-semibold tracking-wider text-sm text-gray-200">
            12-CORE BIOMETRIC FIREWALL DEFENSE SUITE
          </span>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 px-2 py-0.5 rounded">
          12/12 ENGINES OPERATIONAL
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {engines.map(engine => {
          const Icon = engine.icon;
          const isAlert = engine.status === 'ALERT';
          const isElevated = engine.status === 'ELEVATED';

          return (
            <div
              key={engine.id}
              className={`bg-black/50 border rounded-lg p-3 transition-all hover:bg-slate-900/60 ${
                isAlert
                  ? 'border-rose-500/60 shadow-lg shadow-rose-500/10'
                  : isElevated
                  ? 'border-amber-500/50'
                  : 'border-gray-800 hover:border-emerald-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded ${
                    isAlert ? 'bg-rose-950/60 text-rose-400' : 'bg-slate-900 text-emerald-400 border border-gray-800'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-xs text-gray-100">{engine.name}</h4>
                    <p className="text-[10px] text-gray-400 font-mono truncate w-32">{engine.role}</p>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    isAlert
                      ? 'bg-rose-900/40 text-rose-300 border border-rose-500'
                      : isElevated
                      ? 'bg-amber-900/40 text-amber-300 border border-amber-500'
                      : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {engine.status}
                </span>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed mb-3 h-10 overflow-hidden">
                {engine.desc}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-gray-850 text-[10px] font-mono text-gray-500">
                <span>ACCURACY: <b className="text-gray-300">{engine.accuracy}</b></span>
                <span>LATENCY: <b className="text-emerald-400">{engine.latency}</b></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
