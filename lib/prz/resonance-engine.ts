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

export function measureResonance(input: ResonanceInput, context: ResonanceContext) {
  const directionSim = calculateCosineSimilarity(input.direction, context.expectedDirection);
  const magnitudeMatch = 1 - Math.abs(input.magnitude - (context.patterns[0] || 0.5));
  const frequencyMatch = 1 - Math.abs(input.frequency - context.systemFrequency);
  
  const score = (directionSim * 0.5) + (magnitudeMatch * 0.3) + (frequencyMatch * 0.2);
  
  return {
    score,
    directionSim,
    magnitudeMatch,
    frequencyMatch,
    threshold: 0.95
  };
}

export function shouldCrystallize(result: { score: number, threshold: number }): boolean {
  return result.score >= result.threshold;
}

function calculateCosineSimilarity(a: number[], b: number[]) {
  const dotProduct = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magA * magB) || 0;
}