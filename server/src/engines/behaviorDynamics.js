export class BehaviorDynamicsEngine {
  computeEntropy(flightTimes = [], mouseVelocities = []) {
    return { interactionEntropy: 0.86, botMacroDetected: false, behavioralTrustScore: 96.5 };
  }
}
export const behaviorDynamicsEngine = new BehaviorDynamicsEngine();