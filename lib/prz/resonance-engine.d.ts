/**
 * Pillar 1: Resonance Engine
 * Measures intent alignment and trajectory
 */
export interface ResonanceInput {
    content: string;
    direction: number[];
    magnitude: number;
    frequency: number;
}
export interface ResonanceContext {
    state: 'vapor' | 'crystal' | 'active';
    patterns: number[];
    expectedDirection: number[];
    systemFrequency: number;
}
export declare function measureResonance(input: ResonanceInput, context: ResonanceContext): {
    score: number;
    directionSim: number;
    magnitudeMatch: number;
    frequencyMatch: number;
    threshold: number;
};
export declare function shouldCrystallize(result: {
    score: number;
    threshold: number;
}): boolean;
//# sourceMappingURL=resonance-engine.d.ts.map