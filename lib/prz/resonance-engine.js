"use strict";
/**
 * Pillar 1: Resonance Engine
 * Measures intent alignment and trajectory
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureResonance = measureResonance;
exports.shouldCrystallize = shouldCrystallize;
function measureResonance(input, context) {
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
function shouldCrystallize(result) {
    return result.score >= result.threshold;
}
function calculateCosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magA * magB) || 0;
}
