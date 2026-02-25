import {
    processFeedback,
    aggregateFeedback,
    adjustResonanceWithFeedback,
    shouldTransitionState,
    detectContradictoryFeedback,
    UserFeedback
} from '../user-feedback';
import * as gooseguard from '../gooseguard';

jest.mock('../gooseguard');

describe('User Feedback Module', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (gooseguard.beforeAction as jest.Mock).mockReturnValue({
            shouldProceed: true,
            reason: 'OK'
        });
    });

    const mockFeedback: UserFeedback = {
        id: 'f1',
        artifactId: 'a1',
        sentiment: 'positive',
        type: 'completeness',
        confidence: 0.9,
        intensity: 0.8,
        timestamp: Date.now()
    };

    describe('processFeedback', () => {
        it('accepts valid feedback and returns resonance adjustment', () => {
            const result = processFeedback(mockFeedback, []);
            expect(result.accepted).toBe(true);
            expect(result.adjustedResonance).toBeGreaterThan(0);
            expect(result.suggestedAction).toContain('Positive feedback accepted');
        });

        it('rejects feedback if GOOSEGUARD detects a loop', () => {
            (gooseguard.beforeAction as jest.Mock).mockReturnValue({
                shouldProceed: false,
                reason: 'Loop detected',
                suggestedPivot: 'Try something else'
            });

            const result = processFeedback(mockFeedback, []);
            expect(result.accepted).toBe(false);
            expect(result.reason).toContain('GOOSEGUARD: Redundant feedback pattern detected');
            expect(result.suggestedAction).toBe('Try something else');
        });

        it('rejects feedback if confidence is below threshold', () => {
            const lowConfidenceFeedback = { ...mockFeedback, confidence: 0.5 };
            const result = processFeedback(lowConfidenceFeedback, []);
            expect(result.accepted).toBe(false);
            expect(result.reason).toContain('below minimum threshold');
        });

        it('calculates negative adjustment for negative feedback', () => {
            const negativeFeedback: UserFeedback = { ...mockFeedback, sentiment: 'negative' };
            const result = processFeedback(negativeFeedback, []);
            expect(result.accepted).toBe(true);
            expect(result.adjustedResonance).toBeLessThan(0);
        });
    });

    describe('aggregateFeedback', () => {
        it('handles empty feedback list', () => {
            const result = aggregateFeedback([]);
            expect(result.totalFeedback).toBe(0);
            expect(result.dominantSentiment).toBe('neutral');
        });

        it('correctly aggregates multiple feedback entries', () => {
            const feedbackList: UserFeedback[] = [
                mockFeedback,
                { ...mockFeedback, id: 'f2', sentiment: 'positive', intensity: 0.9 },
                { ...mockFeedback, id: 'f3', sentiment: 'negative', intensity: 0.7 }
            ];

            const result = aggregateFeedback(feedbackList);
            expect(result.totalFeedback).toBe(3);
            expect(result.positiveCount).toBe(2);
            expect(result.negativeCount).toBe(1);
            expect(result.dominantSentiment).toBe('positive');
            expect(result.resonanceAdjustment).toBeGreaterThan(-1); // Adjustment can be 0 or small positive based on math
        });
    });

    describe('shouldTransitionState', () => {
        it('detects transition from vapor to crystal', () => {
            const result = shouldTransitionState(mockFeedback, 0.92); // 0.92 + boost >= 0.95
            expect(result.shouldTransition).toBe(true);
            expect(result.newState).toBe('crystal');
        });

        it('detects transition from crystal to vapor', () => {
            const negativeFeedback: UserFeedback = { ...mockFeedback, sentiment: 'negative', intensity: 1.0 };
            const result = shouldTransitionState(negativeFeedback, 0.96); // 0.96 - penalty < 0.95
            expect(result.shouldTransition).toBe(true);
            expect(result.newState).toBe('vapor');
        });

        it('does not transition if thresholds are not crossed', () => {
            const result = shouldTransitionState(mockFeedback, 0.96);
            expect(result.shouldTransition).toBe(false);
            expect(result.newState).toBe('crystal');
        });
    });

    describe('detectContradictoryFeedback', () => {
        it('returns false for empty or small history', () => {
            expect(detectContradictoryFeedback([]).hasContradiction).toBe(false);
            expect(detectContradictoryFeedback([mockFeedback, mockFeedback]).hasContradiction).toBe(false);
        });

        it('detects alternating positive/negative pattern', () => {
            const now = Date.now();
            const history = [
                { ...mockFeedback, sentiment: 'positive' as const, timestamp: now - 3000 },
                { ...mockFeedback, sentiment: 'negative' as const, timestamp: now - 2000 },
                { ...mockFeedback, sentiment: 'positive' as const, timestamp: now - 1000 },
                { ...mockFeedback, sentiment: 'negative' as const, timestamp: now }
            ];

            const result = detectContradictoryFeedback(history);
            expect(result.hasContradiction).toBe(true);
            expect(result.pattern).toBeDefined();
        });
    });
});
