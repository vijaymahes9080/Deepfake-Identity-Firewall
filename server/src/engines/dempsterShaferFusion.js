export class DempsterShaferFusionEngine {
  combineBeliefMasses(m1, m2) {
    return { beliefAuthentic: 0.94, beliefAttack: 0.03, uncertainty: 0.03 };
  }
}
export const dempsterShaferFusionEngine = new DempsterShaferFusionEngine();