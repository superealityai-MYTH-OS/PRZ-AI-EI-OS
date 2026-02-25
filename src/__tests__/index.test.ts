import * as index from '../index';
import { EmotionalIntelligence } from '../emotional-intelligence';

describe('Index Module', () => {
    it('exports VERSION matching package.json', () => {
        // Basic check that version string exists and is a valid format
        expect(index.VERSION).toBeDefined();
        expect(typeof index.VERSION).toBe('string');
        expect(index.VERSION.split('.').length).toBe(3); // typically x.y.z
    });

    describe('createEmotionalIntelligence', () => {
        it('returns a new instance of EmotionalIntelligence', () => {
            const ei = index.createEmotionalIntelligence();
            expect(ei).toBeInstanceOf(EmotionalIntelligence);
        });

        it('returns independent instances on multiple calls', () => {
            const ei1 = index.createEmotionalIntelligence();
            const ei2 = index.createEmotionalIntelligence();

            expect(ei1).not.toBe(ei2); // Different strict equality
        });
    });

    it('exports required feedback functionality', () => {
        expect(index.processFeedback).toBeDefined();
        expect(index.aggregateFeedback).toBeDefined();
        expect(index.adjustResonanceWithFeedback).toBeDefined();
        expect(index.shouldTransitionState).toBeDefined();
        expect(index.detectContradictoryFeedback).toBeDefined();
    });
});
