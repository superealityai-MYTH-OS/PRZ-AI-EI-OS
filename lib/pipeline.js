"use strict";
/**
 * PRZ Pipeline Runner
 * Implements the "Complete-Then-Validate" protocol
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPrzPipeline = runPrzPipeline;
const resonance_engine_1 = require("./prz/resonance-engine");
const gooseguard_1 = require("./prz/gooseguard");
const harmonic_field_1 = require("./harmonic-field");
const zak_echoes_1 = require("./zak-echoes");
async function runPrzPipeline(userRequest, history = []) {
    // 1. Loop Detection (GOOSEGUARD)
    const guard = (0, gooseguard_1.beforeAction)({ id: 'current', type: 'request', payload: userRequest, timestamp: Date.now() }, history);
    if (!guard.shouldProceed)
        throw new Error(guard.reason);
    // 2. Pattern Matching (ZAK Echo Search)
    const bestMatch = zak_echoes_1.zakEchoRegistry
        .map(echo => ({ echo, confidence: (0, harmonic_field_1.calculatePatternMatchConfidence)(userRequest, echo.pattern) }))
        .sort((a, b) => b.confidence - a.confidence)[0];
    // 3. Execution (Simulated)
    let deliverable = `PRZ Deliverable for: ${userRequest}\n`;
    if (bestMatch && bestMatch.confidence >= 0.85) {
        deliverable += `Applied Pattern: ${bestMatch.echo.pattern}\n`;
    }
    // 4. Validation (Resonance Check)
    const resonance = (0, resonance_engine_1.measureResonance)({ content: userRequest, direction: [1, 0], magnitude: 0.9, frequency: 0.5 }, { state: 'active', patterns: [0.9], expectedDirection: [1, 0], systemFrequency: 0.5 });
    return {
        deliverable,
        resonance,
        crystallized: (0, resonance_engine_1.shouldCrystallize)(resonance),
        tier: resonance.score >= 0.95 ? 'GREEN LANE' : 'MONITORED'
    };
}
