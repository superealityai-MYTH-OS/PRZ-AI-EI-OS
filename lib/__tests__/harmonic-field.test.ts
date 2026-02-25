import { calculatePatternMatchConfidence, intentToVector } from '../harmonic-field';

describe('Harmonic Field Module', () => {
    describe('calculatePatternMatchConfidence', () => {
        it('returns a high confidence for exact keyword matches', () => {
            const confidence = calculatePatternMatchConfidence(
                'Refactor React component',
                'Refactor React component'
            );

            // Should be close to 1.0 because keywords, harmonics, and magnitude match perfectly
            expect(confidence).toBeGreaterThan(0.9);
            expect(confidence).toBeLessThanOrEqual(1.000000000000001); // precision error buffer
        });

        it('returns a middle confidence for partial matches', () => {
            const confidence = calculatePatternMatchConfidence(
                'Refactor this old component',
                'Refactor React component with improved structure'
            );

            expect(confidence).toBeGreaterThan(0.1);
            expect(confidence).toBeLessThan(0.9);
        });

        it('returns low/zero confidence for completely unrelated text', () => {
            const confidence = calculatePatternMatchConfidence(
                'Analyze data',
                'Refactor React component'
            );

            // They share no words, so score should be very low
            expect(confidence).toBeLessThan(0.2);
        });

        it('is case insensitive and ignores punctuation', () => {
            const confidence1 = calculatePatternMatchConfidence(
                'Analyze data!',
                'analyze data'
            );

            expect(confidence1).toBeGreaterThan(0.9);
        });
    });

    describe('intentToVector', () => {
        it('calculates magnitude based on token length', () => {
            // Short text
            const shortVec = intentToVector('create');
            // Long text
            const longVec = intentToVector('create a very long and complex application');

            expect(longVec.magnitude).toBeGreaterThan(shortVec.magnitude);
            expect(longVec.magnitude).toBeLessThanOrEqual(1.0);
        });

        it('determines direction based on action verbs (x-axis heavy)', () => {
            const vec = intentToVector('create build make');
            expect(vec.direction[0]).toBeGreaterThan(vec.direction[1]);
        });

        it('determines direction based on analysis verbs (y-axis heavy)', () => {
            const vec = intentToVector('analyze review examine');
            expect(vec.direction[1]).toBeGreaterThan(vec.direction[0]);
        });

        it('provides a default direction for unknown verbs', () => {
            const vec = intentToVector('xyz abc');
            expect(vec.direction).toEqual([1, 0]);
        });
    });
});
