/**
 * RiskFusion Engine - Multi-Modal Bayesian Identity Risk Aggregator
 * Evaluates 8 biometric & contextual layers to produce a normalized 0-100 Risk Score.
 */

export class RiskFusionEngine {
  constructor() {
    this.weights = {
      faceManipulation: 0.22,
      livenessFailure: 0.18,
      voiceSynthetic: 0.18,
      lipSyncDelta: 0.14,
      replayProbability: 0.12,
      deviceAnomaly: 0.08,
      behaviorAnomaly: 0.05,
      continuityDrift: 0.03
    };
  }

  evaluate(telemetry = {}) {
    const {
      faceScore = 0.05,        // 0.0 (real) -> 1.0 (deepfake)
      livenessScore = 0.95,    // 1.0 (alive) -> 0.0 (spoof)
      voiceScore = 0.05,       // 0.0 (natural) -> 1.0 (synthetic)
      syncDeltaMs = 12,        // normal: < 45ms, anomalous: > 120ms
      replayScore = 0.02,      // 0.0 (direct) -> 1.0 (replay)
      deviceRisk = 0.0,        // 0.0 (clean) -> 1.0 (virtual/hooked)
      behaviorScore = 0.05,    // 0.0 (human) -> 1.0 (bot/abnormal)
      continuityDrift = 0.02,  // 0.0 (stable) -> 1.0 (identity shift)
      activeAttacks = []
    } = telemetry;

    // Convert raw metrics to normalized risk dimensions [0, 100]
    const faceRisk = Math.min(100, Math.max(0, faceScore * 100));
    const livenessRisk = Math.min(100, Math.max(0, (1 - livenessScore) * 100));
    const voiceRisk = Math.min(100, Math.max(0, voiceScore * 100));
    
    // Sync risk: 0-40ms is 0 risk, >150ms is 100 risk
    const syncRisk = Math.min(100, Math.max(0, ((Math.abs(syncDeltaMs) - 35) / 120) * 100));
    const replayRisk = Math.min(100, Math.max(0, replayScore * 100));
    const devRisk = Math.min(100, Math.max(0, deviceRisk * 100));
    const behRisk = Math.min(100, Math.max(0, behaviorScore * 100));
    const contRisk = Math.min(100, Math.max(0, continuityDrift * 100));

    // Calculate baseline weighted composite
    let rawComposite = (
      faceRisk * this.weights.faceManipulation +
      livenessRisk * this.weights.livenessFailure +
      voiceRisk * this.weights.voiceSynthetic +
      syncRisk * this.weights.lipSyncDelta +
      replayRisk * this.weights.replayProbability +
      devRisk * this.weights.deviceAnomaly +
      behRisk * this.weights.behaviorAnomaly +
      contRisk * this.weights.continuityDrift
    );

    // Multi-modal non-linear correlation penalty:
    // If BOTH face and voice show manipulation, probability of coordinated attack spikes
    if (faceRisk > 45 && voiceRisk > 45) {
      rawComposite = Math.min(100, rawComposite * 1.35 + 15);
    }
    if (devRisk > 60 && (faceRisk > 40 || replayRisk > 40)) {
      rawComposite = Math.min(100, rawComposite * 1.25 + 10);
    }

    const finalRisk = Math.min(100, Math.max(0, Math.round(rawComposite * 10) / 10));
    const confidenceScore = Math.max(0, Math.min(100, Math.round((100 - finalRisk) * 10) / 10));

    // Determine Classification Tier
    let status = 'TRUSTED';
    let statusColor = '#00f5a0';
    let alertLevel = 'NORMAL';
    let actionRequired = 'ALLOW';

    if (finalRisk <= 20) {
      status = 'TRUSTED';
      statusColor = '#00f5a0'; // Emerald
      alertLevel = 'INFO';
      actionRequired = 'PASS';
    } else if (finalRisk <= 40) {
      status = 'LOW RISK';
      statusColor = '#00d4ff'; // Cyan
      alertLevel = 'LOW';
      actionRequired = 'PASS_MONITORED';
    } else if (finalRisk <= 60) {
      status = 'SUSPICIOUS';
      statusColor = '#ffb703'; // Amber
      alertLevel = 'ELEVATED';
      actionRequired = 'STEP_UP_CHALLENGE';
    } else if (finalRisk <= 80) {
      status = 'HIGH RISK';
      statusColor = '#ff5400'; // Orange
      alertLevel = 'HIGH';
      actionRequired = 'BLOCK_OR_REAUTH';
    } else {
      status = 'CRITICAL';
      statusColor = '#ff0055'; // Crimson
      alertLevel = 'CRITICAL';
      actionRequired = 'TERMINATE_SESSION';
    }

    // Identify primary threat vectors
    const threatFactors = [];
    if (faceRisk > 50) threatFactors.push({ module: 'FaceShield', threat: 'Neural Facial Inpainting / Boundary Blur Detected', risk: faceRisk });
    if (livenessRisk > 50) threatFactors.push({ module: 'LiveProof', threat: 'Sub-threshold Biological Pulse / Static Micro-expression', risk: livenessRisk });
    if (voiceRisk > 50) threatFactors.push({ module: 'VoiceShield', threat: 'Vocoder Harmonic Phase Anomaly / Synthetic Waveform', risk: voiceRisk });
    if (syncRisk > 50) threatFactors.push({ module: 'SyncGuard', threat: 'Phoneme-Viseme Audio/Video Desync (Latency Delta)', risk: syncRisk });
    if (replayRisk > 50) threatFactors.push({ module: 'ReplayGuard', threat: 'Display Screen Moire Pattern / Bezel Reflection', risk: replayRisk });
    if (devRisk > 50) threatFactors.push({ module: 'DeviceTrust', threat: 'Virtual Camera Driver (OBS/ManyCam) Hook Detected', risk: devRisk });
    if (behRisk > 50) threatFactors.push({ module: 'BehaviourID', threat: 'Non-Human Micro-Motion Dynamics / Scripted Macro', risk: behRisk });
    if (contRisk > 50) threatFactors.push({ module: 'IdentityContinuity', threat: 'Biometric Vector Divergence / Proxy Switch', risk: contRisk });

    return {
      timestamp: Date.now(),
      riskScore: finalRisk,
      confidenceScore,
      status,
      statusColor,
      alertLevel,
      actionRequired,
      threatFactors,
      breakdown: {
        face: { score: Math.round(faceRisk), label: 'Face Authenticity', weight: '22%' },
        liveness: { score: Math.round(livenessRisk), label: 'Biological Liveness', weight: '18%' },
        voice: { score: Math.round(voiceRisk), label: 'Voice Naturalness', weight: '18%' },
        sync: { score: Math.round(syncRisk), label: 'Lip-Audio Synchronization', weight: '14%' },
        replay: { score: Math.round(replayRisk), label: 'Replay & Screen Guard', weight: '12%' },
        device: { score: Math.round(devRisk), label: 'Device & Driver Trust', weight: '8%' },
        behavior: { score: Math.round(behRisk), label: 'Behavioral Biometrics', weight: '5%' },
        continuity: { score: Math.round(contRisk), label: 'Identity Continuity', weight: '3%' }
      }
    };
  }
}

export const riskFusionEngine = new RiskFusionEngine();
