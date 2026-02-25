import { measureResonance, shouldCrystallize, ResonanceInput, ResonanceContext } from '../resonance-engine';

describe('Resonance Engine', () => {
  const baseContext: ResonanceContext = {
    state: 'active',
    patterns: [0.5],
    expectedDirection: [1, 0],
    systemFrequency: 0.5,
  };

  describe('measureResonance', () => {
    it('returns a score between 0 and 1', () => {
      const input: ResonanceInput = {
        content: 'test',
        direction: [1, 0],
        magnitude: 0.5,
        frequency: 0.5,
      };
      const result = measureResonance(input, baseContext);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    it('returns high score for perfectly aligned input', () => {
      const input: ResonanceInput = {
        content: 'aligned',
        direction: [1, 0],
        magnitude: 0.5,
        frequency: 0.5,
      };
      const result = measureResonance(input, baseContext);
      expect(result.score).toBeGreaterThanOrEqual(0.95);
    });

    it('returns a threshold of 0.95', () => {
      const input: ResonanceInput = {
        content: 'test',
        direction: [1, 0],
        magnitude: 0.5,
        frequency: 0.5,
      };
      const result = measureResonance(input, baseContext);
      expect(result.threshold).toBe(0.95);
    });

    it('returns lower score for misaligned direction', () => {
      const aligned: ResonanceInput = {
        content: 'aligned',
        direction: [1, 0],
        magnitude: 0.5,
        frequency: 0.5,
      };
      const misaligned: ResonanceInput = {
        content: 'misaligned',
        direction: [-1, 0],
        magnitude: 0.5,
        frequency: 0.5,
      };
      const alignedResult = measureResonance(aligned, baseContext);
      const misalignedResult = measureResonance(misaligned, baseContext);
      expect(alignedResult.score).toBeGreaterThan(misalignedResult.score);
    });
  });

  describe('shouldCrystallize', () => {
    it('returns true when score meets threshold', () => {
      expect(shouldCrystallize({ score: 0.95, threshold: 0.95 })).toBe(true);
      expect(shouldCrystallize({ score: 1.0, threshold: 0.95 })).toBe(true);
    });

    it('returns false when score is below threshold', () => {
      expect(shouldCrystallize({ score: 0.94, threshold: 0.95 })).toBe(false);
      expect(shouldCrystallize({ score: 0, threshold: 0.95 })).toBe(false);
    });
  });
});
