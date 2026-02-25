import { runPrzPipeline, runPrzPipelineWithFeedback } from '../pipeline';
import * as gooseguard from '../prz/gooseguard';
import * as resonanceEngine from '../prz/resonance-engine';
import { UserFeedback } from '../prz/user-feedback';

// Mock dependencies
jest.mock('../prz/gooseguard');
jest.mock('../prz/resonance-engine');

describe('PRZ Pipeline', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Default mocks
        (gooseguard.beforeAction as jest.Mock).mockReturnValue({
            shouldProceed: true,
            reason: 'OK'
        });

        (resonanceEngine.measureResonance as jest.Mock).mockReturnValue({
            score: 0.96,
            directionMatch: 0.9,
            magnitudeMatch: 0.9,
            frequencyMatch: 0.9
        });

        (resonanceEngine.shouldCrystallize as jest.Mock).mockReturnValue(true);
    });

    describe('runPrzPipeline', () => {
        it('should run successfully and return GREEN LANE for high resonance', async () => {
            const result = await runPrzPipeline('Analyze data');

            expect(result.tier).toBe('GREEN LANE');
            expect(result.crystallized).toBe(true);
            expect(result.deliverable).toContain('PRZ Deliverable for: Analyze data');
            expect(result.artifactId).toBeDefined();
        });

        it('should throw an error if GOOSEGUARD blocks the action', async () => {
            (gooseguard.beforeAction as jest.Mock).mockReturnValue({
                shouldProceed: false,
                reason: 'Loop detected'
            });

            await expect(runPrzPipeline('Analyze data')).rejects.toThrow('Loop detected');
        });

        it('should return MONITORED for low resonance', async () => {
            (resonanceEngine.measureResonance as jest.Mock).mockReturnValue({
                score: 0.8,
                directionMatch: 0.8,
                magnitudeMatch: 0.8,
                frequencyMatch: 0.8
            });
            (resonanceEngine.shouldCrystallize as jest.Mock).mockReturnValue(false);

            const result = await runPrzPipeline('Analyze data');

            expect(result.tier).toBe('MONITORED');
            expect(result.crystallized).toBe(false);
        });
    });

    describe('runPrzPipelineWithFeedback', () => {
        it('should handle request without feedback', async () => {
            const result = await runPrzPipelineWithFeedback('Analyze data');

            expect(result.feedbackAccepted).toBe(false);
            expect(result.tier).toBe('GREEN LANE'); // Default mock gives >= 0.95
        });

        it('should process valid positive feedback and adjust resonance', async () => {
            const feedback: UserFeedback = {
                id: 'fb-1',
                artifactId: 'art-1',
                sentiment: 'positive',
                type: 'completeness',
                comment: 'Great work',
                confidence: 0.9,
                intensity: 0.8,
                timestamp: Date.now()
            };

            const result = await runPrzPipelineWithFeedback('Analyze data', feedback);

            expect(result.feedbackAccepted).toBe(true);

            // Since it was positive feedback and initial score was 0.96 (from mock),
            // the base adjustResonanceWithFeedback function would have capped it to 1.0
            expect(result.adjustedResonance).toBeGreaterThan(0.95);
            expect(result.tier).toBe('GREEN LANE');
            expect(result.stateTransition?.occurred).toBeDefined();
        });

        it('should process negative feedback and potentially downgrade tier', async () => {
            const feedback: UserFeedback = {
                id: 'fb-2',
                artifactId: 'art-1',
                sentiment: 'negative',
                type: 'accuracy',
                comment: 'Incorrect',
                confidence: 0.9,
                intensity: 0.8,
                timestamp: Date.now()
            };

            // Set an initial lower score
            (resonanceEngine.measureResonance as jest.Mock).mockReturnValue({
                score: 0.85,
                directionMatch: 0.8,
                magnitudeMatch: 0.8,
                frequencyMatch: 0.8
            });

            const result = await runPrzPipelineWithFeedback('Analyze data', feedback);

            expect(result.feedbackAccepted).toBe(true);
            expect(result.tier).toBe('MONITORED');
            expect(result.adjustedResonance).toBeLessThan(0.85); // Score drops with negative feedback
        });
    });
});
