"use strict";
/**
 * Pillar 3: GOOSEGUARD
 * Meta-awareness logic to detect and break redundant conversational loops
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.beforeAction = beforeAction;
exports.shouldSuggestPivot = shouldSuggestPivot;
/**
 * Detects if an action is part of a redundant loop
 * @param action Current action
 * @param history Previous actions
 * @returns Guard result indicating whether to proceed
 */
function beforeAction(action, history) {
    // Check for exact duplicates within a time window (5 minutes)
    const recentActions = history.filter(h => action.timestamp - h.timestamp < 300000);
    // Count similar actions
    const similarActions = recentActions.filter(h => {
        if (h.type !== action.type)
            return false;
        // For requests, check payload similarity
        if (typeof h.payload === 'string' && typeof action.payload === 'string') {
            const similarity = calculateStringSimilarity(h.payload, action.payload);
            return similarity > 0.85;
        }
        return false;
    });
    // If we see 3+ similar actions, it's a loop
    if (similarActions.length >= 3) {
        return {
            shouldProceed: false,
            reason: 'GOOSEGUARD: Redundant loop detected. Breaking to preserve flow.',
            suggestedPivot: 'Consider reformulating your request or exploring a different approach.'
        };
    }
    return { shouldProceed: true };
}
/**
 * Calculates string similarity using a simple character overlap metric
 */
function calculateStringSimilarity(a, b) {
    const setA = new Set(a.toLowerCase().split(/\s+/));
    const setB = new Set(b.toLowerCase().split(/\s+/));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
}
/**
 * Checks if we should suggest a pivot to the user
 */
function shouldSuggestPivot(history) {
    if (history.length < 5)
        return false;
    const recentActions = history.slice(-5);
    const types = recentActions.map(a => a.type);
    // If all recent actions are the same type, suggest a pivot
    return new Set(types).size === 1;
}
