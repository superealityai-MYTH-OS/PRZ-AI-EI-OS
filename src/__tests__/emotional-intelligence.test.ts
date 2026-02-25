import { EmotionalIntelligence, EmotionalContext } from '../emotional-intelligence';

describe('EmotionalIntelligence', () => {
    let ei: EmotionalIntelligence;

    beforeEach(() => {
        ei = new EmotionalIntelligence();
    });

    describe('analyzeEmotion', () => {
        it('detects positive sentiment from keywords', () => {
            const context: EmotionalContext = { userInput: 'This is great and excellent!' };
            const state = ei.analyzeEmotion(context);

            expect(state.sentiment).toBe('positive');
            expect(state.intensity).toBeGreaterThan(0);
            expect(state.confidence).toBeGreaterThanOrEqual(0.7);
        });

        it('detects negative sentiment from keywords', () => {
            const context: EmotionalContext = { userInput: 'This is terrible and bad.' };
            const state = ei.analyzeEmotion(context);

            expect(state.sentiment).toBe('negative');
            expect(state.intensity).toBeGreaterThan(0);
            expect(state.confidence).toBeGreaterThanOrEqual(0.7);
        });

        it('detects neutral sentiment when no strong keywords present', () => {
            const context: EmotionalContext = { userInput: 'The application is running.' };
            const state = ei.analyzeEmotion(context);

            expect(state.sentiment).toBe('neutral');
            expect(state.intensity).toBe(0.5);
            expect(state.confidence).toBe(0.7); // Base confidence
        });

        it('maintains history of analyzed states', () => {
            ei.analyzeEmotion({ userInput: 'good' });
            ei.analyzeEmotion({ userInput: 'bad' });

            const history = ei.getHistory();
            expect(history.length).toBe(2);
            expect(history[0].sentiment).toBe('positive');
            expect(history[1].sentiment).toBe('negative');
        });
    });

    describe('clearHistory', () => {
        it('clears the emotional history array', () => {
            ei.analyzeEmotion({ userInput: 'good' });
            expect(ei.getHistory().length).toBe(1);

            ei.clearHistory();
            expect(ei.getHistory().length).toBe(0);
        });
    });

    describe('suggestResponse', () => {
        it('returns appropriate response for positive state', () => {
            const response = ei.suggestResponse({ sentiment: 'positive', confidence: 1, intensity: 1 });
            expect(response).toContain('Maintain positive engagement');
        });

        it('returns appropriate response for negative state', () => {
            const response = ei.suggestResponse({ sentiment: 'negative', confidence: 1, intensity: 1 });
            expect(response).toContain('empathy');
        });
    });

    describe('analyzeFeedback', () => {
        it('detects accuracy feedback type', () => {
            const state = ei.analyzeFeedback('This is correct but bad.');
            expect(state.sentiment).toBe('negative');
            expect(state.feedbackType).toBe('accuracy');
        });

        it('detects completeness feedback type', () => {
            const state = ei.analyzeFeedback('It is missing some features.');
            expect(state.feedbackType).toBe('completeness');
        });

        it('detects usefulness feedback type', () => {
            const state = ei.analyzeFeedback('This is very helpful and great.');
            expect(state.sentiment).toBe('positive');
            expect(state.feedbackType).toBe('usefulness');
        });

        it('defaults to satisfaction type if no specific keywords match', () => {
            const state = ei.analyzeFeedback('The UI looks nice.');
            expect(state.feedbackType).toBe('satisfaction');
        });
    });

    describe('isFeedbackSatisfied', () => {
        it('returns true for positive high-confidence feedback', () => {
            // "great" and "excellent" = 2 positive keywords, making confidence > 0.7
            expect(ei.isFeedbackSatisfied('This is great and excellent!')).toBe(true);
        });

        it('returns false for neutral feedback', () => {
            expect(ei.isFeedbackSatisfied('The text is blue.')).toBe(false);
        });

        it('returns false for negative feedback', () => {
            expect(ei.isFeedbackSatisfied('This is terrible! =)')).toBe(false);
        });
    });
});
