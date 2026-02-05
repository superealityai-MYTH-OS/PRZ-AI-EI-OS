/**
 * Pillar 1 Extension: User Feedback Engine
 * Captures and processes user feedback following Complete-Then-Validate principle
 * Integrates with GOOSEGUARD to prevent feedback loops
 */
export type FeedbackSentiment = 'positive' | 'neutral' | 'negative';
export type FeedbackType = 'satisfaction' | 'accuracy' | 'completeness' | 'usefulness';
export interface UserFeedback {
    id: string;
    artifactId: string;
    sentiment: FeedbackSentiment;
    type: FeedbackType;
    comment?: string;
    confidence: number;
    intensity: number;
    timestamp: number;
}
export interface FeedbackResult {
    accepted: boolean;
    reason?: string;
    suggestedAction?: string;
    adjustedResonance?: number;
}
export interface FeedbackAggregation {
    totalFeedback: number;
    positiveCount: number;
    negativeCount: number;
    neutralCount: number;
    averageConfidence: number;
    averageIntensity: number;
    dominantSentiment: FeedbackSentiment;
    resonanceAdjustment: number;
}
/**
 * Processes user feedback following the Complete-Then-Validate principle
 * Ensures feedback doesn't create redundant loops
 *
 * @param feedback User feedback to process
 * @param history Previous feedback history
 * @returns Result indicating whether to accept feedback and suggested actions
 */
export declare function processFeedback(feedback: UserFeedback, history: UserFeedback[]): FeedbackResult;
/**
 * Aggregates multiple feedback entries to determine overall sentiment and resonance impact
 *
 * @param feedbackList List of user feedback
 * @returns Aggregated feedback metrics
 */
export declare function aggregateFeedback(feedbackList: UserFeedback[]): FeedbackAggregation;
/**
 * Adjusts resonance score based on user feedback
 * Implements feedback-driven resonance refinement
 *
 * @param originalResonance Original resonance score
 * @param feedback User feedback
 * @returns Adjusted resonance score
 */
export declare function adjustResonanceWithFeedback(originalResonance: number, feedback: UserFeedback | FeedbackAggregation): number;
/**
 * Checks if feedback indicates need for state transition (Vapor ↔ Crystal)
 *
 * @param feedback User feedback or aggregation
 * @param currentResonance Current resonance score
 * @returns Whether state should transition and the new state
 */
export declare function shouldTransitionState(feedback: UserFeedback | FeedbackAggregation, currentResonance: number): {
    shouldTransition: boolean;
    newState: 'vapor' | 'crystal';
    reason: string;
};
/**
 * Detects contradictory feedback patterns
 * Helps prevent flip-flopping between states
 *
 * @param history Feedback history
 * @param windowMs Time window to check for contradictions
 * @returns Whether contradictory pattern detected
 */
export declare function detectContradictoryFeedback(history: UserFeedback[], windowMs?: number): {
    hasContradiction: boolean;
    pattern?: string;
};
//# sourceMappingURL=user-feedback.d.ts.map