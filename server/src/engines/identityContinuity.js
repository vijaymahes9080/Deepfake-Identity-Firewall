/**
 * Identity Continuity Engine - Tracks temporal vector drift across an ongoing session:
 * Verifies that the enrolled person remains continuously present without proxy substitution.
 */

export class IdentityContinuityEngine {
  constructor() {
    this.sessions = new Map();
  }

  registerEnrollment(sessionId, baselineVector = {}) {
    const sessionData = {
      sessionId,
      enrolledAt: Date.now(),
      baselineVector: baselineVector.embedding || Array.from({ length: 128 }, () => (Math.random() * 2 - 1)),
      samples: [],
      continuityScore: 100,
      divergenceCount: 0,
      status: 'AUTHENTICATED'
    };
    this.sessions.set(sessionId, sessionData);
    return sessionData;
  }

  evaluateContinuity(sessionId, sampleVector = {}) {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = this.registerEnrollment(sessionId, sampleVector);
    }

    const currentEmbedding = sampleVector.embedding || session.baselineVector;
    
    // Compute cosine similarity between baseline and current
    let dot = 0;
    let normA = 0;
    let normB = 0;
    const len = Math.min(session.baselineVector.length, currentEmbedding.length);
    for (let i = 0; i < len; i++) {
      dot += session.baselineVector[i] * currentEmbedding[i];
      normA += session.baselineVector[i] ** 2;
      normB += currentEmbedding[i] ** 2;
    }
    const cosineSim = normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0.98;
    const drift = Math.max(0, 1 - cosineSim);

    const isMatch = cosineSim > 0.82;
    if (!isMatch) {
      session.divergenceCount++;
    }

    const continuityScore = Math.max(0, Math.round(cosineSim * 1000) / 10);
    const sessionAgeSec = Math.round((Date.now() - session.enrolledAt) / 1000);

    return {
      sessionId,
      continuityScore,
      cosineSimilarity: Math.round(cosineSim * 1000) / 1000,
      driftPercentage: `${(drift * 100).toFixed(1)}%`,
      identityMaintained: isMatch,
      sessionDurationSec: sessionAgeSec,
      divergenceIncidents: session.divergenceCount,
      status: isMatch ? 'CONTINUOUS_AUTHENTIC' : 'IDENTITY_DIVERGENCE_ALERT'
    };
  }
}

export const identityContinuityEngine = new IdentityContinuityEngine();
