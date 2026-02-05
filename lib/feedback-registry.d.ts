/**
 * Feedback Pattern Registry
 * Stores common feedback patterns and their corresponding improvement actions
 * Similar to ZAK Echo Registry but focused on feedback-driven refinements
 */
export interface FeedbackPattern {
    id: string;
    pattern: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    category: 'accuracy' | 'completeness' | 'usefulness' | 'satisfaction';
    improvementAction: string;
    resonanceImpact: number;
}
/**
 * Registry of common feedback patterns and their handling strategies
 */
export declare const feedbackPatternRegistry: FeedbackPattern[];
/**
 * Matches feedback text against known patterns
 * @param feedbackText User's feedback text
 * @returns Array of matching patterns with confidence scores
 */
export declare function matchFeedbackPatterns(feedbackText: string): Array<{
    pattern: FeedbackPattern;
    confidence: number;
}>;
/**
 * Gets the best matching feedback pattern
 * @param feedbackText User's feedback text
 * @returns Best matching pattern or null if no good match
 */
export declare function getBestFeedbackPattern(feedbackText: string): FeedbackPattern | null;
/**
 * Gets suggested improvement actions based on feedback
 * @param feedbackText User's feedback text
 * @returns Array of suggested improvement actions
 */
export declare function getSuggestedImprovements(feedbackText: string): string[];
/**
 * Calculates the total resonance impact from feedback
 * @param feedbackText User's feedback text
 * @returns Cumulative resonance impact (-1 to 1)
 */
export declare function calculateFeedbackImpact(feedbackText: string): number;
//# sourceMappingURL=feedback-registry.d.ts.map