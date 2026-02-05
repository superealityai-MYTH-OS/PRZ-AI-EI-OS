/**
 * PRZ Pipeline Runner
 * Implements the "Complete-Then-Validate" protocol
 */

import { measureResonance, shouldCrystallize } from './prz/resonance-engine';
import { beforeAction } from './prz/gooseguard';
import { calculatePatternMatchConfidence } from './harmonic-field';
import { zakEchoRegistry } from './zak-echoes';

export async function runPrzPipeline(userRequest: string, history: any[] = []) {
  // 1. Loop Detection (GOOSEGUARD)
  const guard = beforeAction({ id: 'current', type: 'request', payload: userRequest, timestamp: Date.now() }, history);
  if (!guard.shouldProceed) throw new Error(guard.reason);

  // 2. Pattern Matching (ZAK Echo Search)
  const bestMatch = zakEchoRegistry
    .map(echo => ({ echo, confidence: calculatePatternMatchConfidence(userRequest, echo.pattern) }))
    .sort((a, b) => b.confidence - a.confidence)[0];

  // 3. Execution (Simulated)
  let deliverable = `PRZ Deliverable for: ${userRequest}\n`;
  if (bestMatch && bestMatch.confidence >= 0.85) {
    deliverable += `Applied Pattern: ${bestMatch.echo.pattern}\n`;
  }

  // 4. Validation (Resonance Check)
  const resonance = measureResonance(
    { content: userRequest, direction: [1, 0], magnitude: 0.9, frequency: 0.5 },
    { state: 'active', patterns: [0.9], expectedDirection: [1, 0], systemFrequency: 0.5 }
  );

  return {
    deliverable,
    resonance,
    crystallized: shouldCrystallize(resonance),
    tier: resonance.score >= 0.95 ? 'GREEN LANE' : 'MONITORED'
  };
}