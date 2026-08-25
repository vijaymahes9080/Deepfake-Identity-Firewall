import crypto from 'crypto';
export class ZKBiometricsEngine {
  generatePedersenCommitment(biometricScore, blindingFactor = crypto.randomBytes(32).toString('hex')) {
    const hash = crypto.createHash('sha256').update(String(biometricScore) + ':' + blindingFactor).digest('hex');
    return { commitment: hash, blindingFactor, timestamp: Date.now() };
  }
}
export const zkBiometricsEngine = new ZKBiometricsEngine();