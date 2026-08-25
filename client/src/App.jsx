import React, { useState } from 'react';
import { 
  Shield, Activity, Cpu, GitBranch, Skull, GraduationCap, 
  Landmark, Briefcase, Laptop, Terminal, Lock, Sparkles, AlertTriangle, Radio
} from 'lucide-react';
import { useBiometrics } from './hooks/useBiometrics';
import { useFirewallSocket } from './hooks/useFirewallSocket';
import { BiometricHUD } from './components/BiometricHUD';
import { RiskEngineScore } from './components/RiskEngineScore';
import { AttackGraphView } from './components/AttackGraphView';
import { EngineGrid } from './components/EngineGrid';
import { RedTeamSimulator } from './components/RedTeamSimulator';
import { ExamMode } from './components/modes/ExamMode';
import { BankingMode } from './components/modes/BankingMode';
import { InterviewMode } from './components/modes/InterviewMode';
import { RemoteWorkMode } from './components/modes/RemoteWorkMode';
import { ChallengeModal } from './components/ChallengeModal';
import { ApiSandbox } from './components/ApiSandbox';
import { PrivacyVaultModal } from './components/PrivacyVaultModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('soc'); // soc | redteam | exam | banking | interview | remotework | api
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Biometrics Hook
  const biometrics = useBiometrics();

  // Real-time Firewall WebSocket Hook
  const { evaluation, attackGraph, isConnected, sendManualTelemetry, setEvaluation, setAttackGraph } = useFirewallSocket({
    faceScore: 0.04,
    livenessScore: 0.96,
    voiceScore: 0.05,
    syncDeltaMs: 12,
    replayScore: 0.02,
    deviceRisk: biometrics.deviceFingerprint?.virtualDriverDetected ? 0.8 : 0.0,
    behaviorScore: 0.05
  });

  // Handle Red-Team Simulated Attack Injection
  const handleSimulateAttack = async (attackVectors, intensity = 1.0) => {
    try {
      const res = await fetch('/api/v1/redteam/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attackVectors, intensity })
      });
      const data = await res.json();
      if (data.success) {
        setEvaluation(data.evaluation);
        setAttackGraph(data.attackGraph);
        sendManualTelemetry(data.simulation.telemetryDelta);
        return;
      }
    } catch (err) {
      console.warn('Backend offline, using client-side simulated attack evaluation:', err);
    }

    // Client-side fallback calculation for GitHub Pages static hosting
    const hasFace = attackVectors.includes('face_swap');
    const hasVoice = attackVectors.includes('voice_clone');
    const hasVirtual = attackVectors.includes('virtual_cam');
    const hasReplay = attackVectors.includes('screen_replay');
    const hasSync = attackVectors.includes('lip_desync');
    const hasSwitch = attackVectors.includes('identity_switch');
    const hasMacro = attackVectors.includes('behavior_macro');

    let baseRisk = 5;
    if (hasFace) baseRisk += 30 * intensity;
    if (hasVoice) baseRisk += 25 * intensity;
    if (hasVirtual) baseRisk += 18 * intensity;
    if (hasReplay) baseRisk += 20 * intensity;
    if (hasSync) baseRisk += 15 * intensity;
    if (hasSwitch) baseRisk += 25 * intensity;
    if (hasMacro) baseRisk += 12 * intensity;

    const finalRisk = Math.min(100, Math.round(baseRisk));
    const confidence = Math.max(0, 100 - finalRisk);

    let status = 'TRUSTED';
    let statusColor = '#00f5a0';
    let actionRequired = 'PASS';

    if (finalRisk > 80) {
      status = 'CRITICAL';
      statusColor = '#ff0055';
      actionRequired = 'TERMINATE_SESSION';
    } else if (finalRisk > 60) {
      status = 'HIGH RISK';
      statusColor = '#ff5400';
      actionRequired = 'BLOCK_OR_REAUTH';
    } else if (finalRisk > 35) {
      status = 'SUSPICIOUS';
      statusColor = '#ffb703';
      actionRequired = 'STEP_UP_CHALLENGE';
    } else if (finalRisk > 20) {
      status = 'LOW RISK';
      statusColor = '#00d4ff';
      actionRequired = 'PASS_MONITORED';
    }

    const threats = [];
    if (hasFace) threats.push({ module: 'FaceShield', threat: 'Neural Inpainting / Boundary Blur Detected' });
    if (hasVoice) threats.push({ module: 'VoiceShield', threat: 'Vocoder Harmonic Phase Anomaly Detected' });
    if (hasVirtual) threats.push({ module: 'DeviceTrust', threat: 'Virtual Camera Driver Hook Detected' });
    if (hasReplay) threats.push({ module: 'ReplayGuard', threat: 'Screen Moire Raster Pattern Detected' });
    if (hasSync) threats.push({ module: 'SyncGuard', threat: 'Phoneme-Viseme Audio-Visual Lag Desync' });
    if (hasSwitch) threats.push({ module: 'IdentityContinuity', threat: 'Biometric Cosine Vector Shift Detected' });
    if (hasMacro) threats.push({ module: 'BehaviourID', threat: 'Zero-Entropy Synthetic Interaction Bot' });

    setEvaluation({
      riskScore: finalRisk,
      confidenceScore: confidence,
      status,
      statusColor,
      alertLevel: finalRisk > 60 ? 'CRITICAL' : finalRisk > 35 ? 'ELEVATED' : 'NORMAL',
      actionRequired,
      threatFactors: threats,
      breakdown: {
        face: { score: hasFace ? Math.round(92 * intensity) : 4, label: 'Face Authenticity', weight: '22%' },
        liveness: { score: (hasFace || hasReplay) ? Math.round(85 * intensity) : 6, label: 'Biological Liveness', weight: '18%' },
        voice: { score: hasVoice ? Math.round(90 * intensity) : 5, label: 'Voice Naturalness', weight: '18%' },
        sync: { score: hasSync ? Math.round(88 * intensity) : 8, label: 'Lip-Audio Synchronization', weight: '14%' },
        replay: { score: hasReplay ? Math.round(89 * intensity) : 3, label: 'Replay & Screen Guard', weight: '12%' },
        device: { score: hasVirtual ? Math.round(95 * intensity) : 2, label: 'Device & Driver Trust', weight: '8%' },
        behavior: { score: hasMacro ? Math.round(85 * intensity) : 5, label: 'Behavioral Biometrics', weight: '5%' },
        continuity: { score: hasSwitch ? Math.round(92 * intensity) : 3, label: 'Identity Continuity', weight: '3%' }
      }
    });

    setAttackGraph(prev => ({
      ...prev,
      attackPathDetected: attackVectors.length > 0,
      entryPoint: hasVirtual ? 'Virtual Driver Hook' : hasReplay ? 'Screen Capture Stream' : hasFace ? 'Real-Time Inpainter' : 'Direct Sensor'
    }));
  };

  const isCritical = evaluation?.riskScore > 60;
  const isSuspicious = evaluation?.riskScore > 35;

  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-gray-100">
      {/* Top Cyber Defense Operations Header */}
      <header className="border-b border-gray-800/80 bg-black/60 backdrop-blur-xl sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between">
        {/* Left: Brand Identity & Live Stream Badge */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className={`p-2 rounded-lg border ${
              isCritical
                ? 'bg-rose-950/80 border-rose-500 text-rose-400 shadow-lg shadow-rose-500/30'
                : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-400 shadow-lg shadow-emerald-500/20'
            }`}>
              <Shield className="w-5 h-5" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-display font-bold text-sm tracking-wider text-white">
                DEEPFAKE IDENTITY FIREWALL
              </h1>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.2 rounded">
                v2.4-PRO
              </span>
            </div>
            <p className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>MULTIMODAL CONTINUOUS ZERO-TRUST LAYER</span>
              <span className="text-gray-600">•</span>
              <span className="text-gray-400">WS: {isConnected ? 'CONNECTED' : 'STANDBY'}</span>
            </p>
          </div>
        </div>

        {/* Center: Operational Mode Switcher Tabs */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/80 p-1 rounded-lg border border-gray-800 text-xs font-mono">
          {[
            { id: 'soc', label: 'LIVE SOC', icon: Activity },
            { id: 'redteam', label: 'RED-TEAM AI', icon: Skull },
            { id: 'exam', label: 'EXAM PROCTOR', icon: GraduationCap },
            { id: 'banking', label: 'BANKING GATE', icon: Landmark },
            { id: 'interview', label: 'INTERVIEW', icon: Briefcase },
            { id: 'remotework', label: 'ZERO-TRUST WORK', icon: Laptop },
            { id: 'api', label: 'DEV API', icon: Terminal }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Quick Action Controls & Modals */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPrivacyOpen(true)}
            className="flex items-center space-x-1.5 text-xs font-mono bg-slate-900 hover:bg-slate-800 border border-gray-700 text-gray-300 px-2.5 py-1.5 rounded transition-all"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">PRIVACY VAULT</span>
          </button>

          <button
            onClick={() => setIsChallengeOpen(true)}
            className="flex items-center space-x-1.5 text-xs font-mono bg-gradient-to-r from-emerald-600/40 to-cyan-600/40 hover:from-emerald-600/60 hover:to-cyan-600/60 border border-emerald-500/50 text-emerald-300 px-3 py-1.5 rounded transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>NONCE CHALLENGE</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex overflow-x-auto p-2 bg-black/80 border-b border-gray-800 space-x-1 font-mono text-xs">
        {[
          { id: 'soc', label: 'SOC' },
          { id: 'redteam', label: 'Red-Team' },
          { id: 'exam', label: 'Exam' },
          { id: 'banking', label: 'Banking' },
          { id: 'interview', label: 'Interview' },
          { id: 'remotework', label: 'Remote' },
          { id: 'api', label: 'API' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 rounded whitespace-nowrap ${
              activeTab === tab.id ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 space-y-4">
        {/* Tab 1: Live SOC Dashboard */}
        {activeTab === 'soc' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Viewport: Biometric HUD (7 Cols) */}
              <div className="lg:col-span-7">
                <BiometricHUD
                  biometrics={biometrics}
                  evaluation={evaluation}
                  onTriggerChallenge={() => setIsChallengeOpen(true)}
                  activeThreatCount={evaluation?.threatFactors?.length || 0}
                />
              </div>

              {/* Right Viewport: Risk Score & Dial (5 Cols) */}
              <div className="lg:col-span-5">
                <RiskEngineScore evaluation={evaluation} />
              </div>
            </div>

            {/* Dynamic Attack Graph */}
            <AttackGraphView attackGraph={attackGraph} evaluation={evaluation} />

            {/* 12-Core Engine Status Grid */}
            <EngineGrid evaluation={evaluation} />
          </div>
        )}

        {/* Tab 2: Adversarial Red-Team Simulator */}
        {activeTab === 'redteam' && (
          <div className="space-y-4">
            <RedTeamSimulator
              onSimulateAttack={handleSimulateAttack}
              evaluation={evaluation}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-7">
                <AttackGraphView attackGraph={attackGraph} evaluation={evaluation} />
              </div>
              <div className="lg:col-span-5">
                <RiskEngineScore evaluation={evaluation} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Online Exam Mode */}
        {activeTab === 'exam' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4">
                <BiometricHUD
                  biometrics={biometrics}
                  evaluation={evaluation}
                  onTriggerChallenge={() => setIsChallengeOpen(true)}
                />
              </div>
              <div className="lg:col-span-8">
                <ExamMode evaluation={evaluation} biometrics={biometrics} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Banking Gate */}
        {activeTab === 'banking' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4">
                <BiometricHUD
                  biometrics={biometrics}
                  evaluation={evaluation}
                  onTriggerChallenge={() => setIsChallengeOpen(true)}
                />
              </div>
              <div className="lg:col-span-8">
                <BankingMode
                  evaluation={evaluation}
                  onTriggerChallenge={() => setIsChallengeOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Technical Interview Mode */}
        {activeTab === 'interview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4">
                <BiometricHUD
                  biometrics={biometrics}
                  evaluation={evaluation}
                  onTriggerChallenge={() => setIsChallengeOpen(true)}
                />
              </div>
              <div className="lg:col-span-8">
                <InterviewMode evaluation={evaluation} biometrics={biometrics} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Remote Work Zero-Trust Sentinel */}
        {activeTab === 'remotework' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4">
                <BiometricHUD
                  biometrics={biometrics}
                  evaluation={evaluation}
                  onTriggerChallenge={() => setIsChallengeOpen(true)}
                />
              </div>
              <div className="lg:col-span-8">
                <RemoteWorkMode
                  evaluation={evaluation}
                  onTriggerChallenge={() => setIsChallengeOpen(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Developer API */}
        {activeTab === 'api' && (
          <ApiSandbox />
        )}
      </main>

      {/* Global Modals */}
      <ChallengeModal
        isOpen={isChallengeOpen}
        onClose={() => setIsChallengeOpen(false)}
      />

      <PrivacyVaultModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
