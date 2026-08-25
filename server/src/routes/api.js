import { Router } from 'express';
import { riskFusionEngine } from '../engines/riskFusion.js';
import { attackGraphEngine } from '../engines/attackGraph.js';
import { challengeAIEngine } from '../engines/challengeAI.js';
import { redTeamSimulatorEngine } from '../engines/redTeamSimulator.js';
import { identityContinuityEngine } from '../engines/identityContinuity.js';
import { privacyVaultEngine } from '../engines/privacyVault.js';

const router = Router();

// GET /api/v1/system/status - Health & Engine Telemetry
router.get('/system/status', (req, res) => {
  res.json({
    status: 'ONLINE',
    version: '2.4.0-firewall',
    timestamp: new Date().toISOString(),
    engines: {
      faceShield: 'ACTIVE',
      liveProof: 'ACTIVE',
      voiceShield: 'ACTIVE',
      syncGuard: 'ACTIVE',
      replayGuard: 'ACTIVE',
      deviceTrust: 'ACTIVE',
      behaviourID: 'ACTIVE',
      riskFusion: 'ACTIVE',
      attackGraph: 'ACTIVE',
      challengeAI: 'ACTIVE',
      privacyVault: 'ACTIVE',
      identityAPI: 'ACTIVE'
    },
    privacy: privacyVaultEngine.getPrivacyManifest()
  });
});

// POST /api/v1/verify/multimodal - Real-Time Evaluation
router.post('/verify/multimodal', (req, res) => {
  try {
    const telemetry = req.body || {};
    const riskEvaluation = riskFusionEngine.evaluate(telemetry);
    const attackGraph = attackGraphEngine.generateGraph(
      riskEvaluation.threatFactors.map(t => t.module),
      riskEvaluation.riskScore
    );

    // Audit log if high risk or anomaly
    if (riskEvaluation.riskScore > 35) {
      privacyVaultEngine.logEvent({
        action: riskEvaluation.actionRequired,
        actor: 'MultiModal Evaluation Gateway',
        details: `Evaluated Risk: ${riskEvaluation.riskScore}% (${riskEvaluation.status}) - Threats: ${riskEvaluation.threatFactors.map(t => t.threat).join('; ') || 'None'}`,
        riskScore: riskEvaluation.riskScore
      });
    }

    res.json({
      success: true,
      evaluation: riskEvaluation,
      attackGraph
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/v1/challenge/generate - Create Dynamic Nonce Challenge
router.post('/challenge/generate', (req, res) => {
  const { sessionId = 'session_default' } = req.body || {};
  const challenge = challengeAIEngine.generateChallenge(sessionId);

  privacyVaultEngine.logEvent({
    action: 'CHALLENGE_GENERATED',
    actor: 'ChallengeAI Engine',
    details: `Generated challenge ${challenge.challengeId}: Nonce: ${challenge.nonceCode} | Direction: ${challenge.requiredDirection}`
  });

  res.json({ success: true, challenge });
});

// POST /api/v1/challenge/validate - Validate Challenge Response
router.post('/challenge/validate', (req, res) => {
  const { challengeId, response } = req.body || {};
  const result = challengeAIEngine.verifyResponse(challengeId, response);

  privacyVaultEngine.logEvent({
    action: result.success ? 'CHALLENGE_PASSED' : 'CHALLENGE_FAILED',
    actor: 'ChallengeAI Engine',
    details: `Challenge ${challengeId} verified. Result: ${result.success ? 'AUTHENTIC' : 'FAILED'} (Latency: ${result.latencyMs}ms)`,
    riskScore: result.success ? 5 : 85
  });

  res.json(result);
});

// POST /api/v1/redteam/simulate - Run Adversarial Attack Simulation
router.post('/redteam/simulate', (req, res) => {
  const { attackVectors = [], intensity = 1.0 } = req.body || {};
  const simulation = redTeamSimulatorEngine.simulate(attackVectors, intensity);
  const evaluation = riskFusionEngine.evaluate(simulation.telemetryDelta);
  const attackGraph = attackGraphEngine.generateGraph(
    simulation.telemetryDelta.activeThreats,
    evaluation.riskScore
  );

  privacyVaultEngine.logEvent({
    action: 'RED_TEAM_ATTACK_SIMULATED',
    actor: 'Red-Team Adversarial Engine',
    details: `Simulated ${attackVectors.length} vectors (${attackVectors.join(', ') || 'None'}) at ${Math.round(intensity * 100)}% intensity. Resulting Risk: ${evaluation.riskScore}%`,
    riskScore: evaluation.riskScore
  });

  res.json({
    success: true,
    simulation,
    evaluation,
    attackGraph
  });
});

// POST /api/v1/continuity/evaluate - Identity Continuity Tracking
router.post('/continuity/evaluate', (req, res) => {
  const { sessionId = 'session_default', sampleVector = {} } = req.body || {};
  const result = identityContinuityEngine.evaluateContinuity(sessionId, sampleVector);
  res.json({ success: true, continuity: result });
});

// GET /api/v1/audit/logs - Cryptographically Linked Audit Trail
router.get('/audit/logs', (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const logs = privacyVaultEngine.getAuditLogs(limit);
  res.json({ success: true, logs });
});

export default router;
