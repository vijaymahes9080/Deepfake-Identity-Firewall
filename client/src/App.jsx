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
  const handleSimulateAttack = async (attackVectors, intensity) => {
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
      }
    } catch (err) {
      console.warn('Simulated attack dispatch error:', err);
    }
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
