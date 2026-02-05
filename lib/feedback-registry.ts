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
  resonanceImpact: number; // -1 to 1, how much this affects resonance
}

/**
 * Registry of common feedback patterns and their handling strategies
 */
export const feedbackPatternRegistry: FeedbackPattern[] = [
  // Positive Patterns
  {
    id: 'fp_perfect_match',
    pattern: 'perfect, exactly what I needed, spot on',
    sentiment: 'positive',
    category: 'satisfaction',
    improvementAction: 'Crystallize immediately. Green Lane approved.',
    resonanceImpact: 0.1
  },
  {
    id: 'fp_complete_accurate',
    pattern: 'complete, accurate, thorough, comprehensive',
    sentiment: 'positive',
    category: 'completeness',
    improvementAction: 'Maintain pattern. High resonance achieved.',
    resonanceImpact: 0.08
  },
  {
    id: 'fp_very_useful',
    pattern: 'very useful, helpful, valuable, practical',
    sentiment: 'positive',
    category: 'usefulness',
    improvementAction: 'Pattern validated. Continue approach.',
    resonanceImpact: 0.07
  },
  
  // Negative Patterns - Accuracy
  {
    id: 'fn_incorrect',
    pattern: 'wrong, incorrect, inaccurate, mistake, error',
    sentiment: 'negative',
    category: 'accuracy',
    improvementAction: 'Review accuracy. Return to Vapor for correction.',
    resonanceImpact: -0.15
  },
  {
    id: 'fn_not_precise',
    pattern: 'not precise, vague, unclear, ambiguous',
    sentiment: 'negative',
    category: 'accuracy',
    improvementAction: 'Add specificity and clarity. Refine details.',
    resonanceImpact: -0.10
  },
  
  // Negative Patterns - Completeness
  {
    id: 'fn_incomplete',
    pattern: 'incomplete, missing, partial, not finished',
    sentiment: 'negative',
    category: 'completeness',
    improvementAction: 'Complete missing sections. Return to Vapor.',
    resonanceImpact: -0.12
  },
  {
    id: 'fn_lacking',
    pattern: 'lacking, insufficient, needs more, too short',
    sentiment: 'negative',
    category: 'completeness',
    improvementAction: 'Expand content. Add more comprehensive coverage.',
    resonanceImpact: -0.08
  },
  
  // Negative Patterns - Usefulness
  {
    id: 'fn_not_helpful',
    pattern: 'not helpful, useless, not useful, doesn\'t help',
    sentiment: 'negative',
    category: 'usefulness',
    improvementAction: 'Reassess user intent. May need pivot.',
    resonanceImpact: -0.12
  },
  {
    id: 'fn_not_relevant',
    pattern: 'not relevant, off-topic, not what I asked, misunderstood',
    sentiment: 'negative',
    category: 'usefulness',
    improvementAction: 'Re-analyze user intent. Major pivot needed.',
    resonanceImpact: -0.20
  },
  
  // Neutral Patterns
  {
    id: 'fn_okay',
    pattern: 'okay, fine, acceptable, decent, adequate',
    sentiment: 'neutral',
    category: 'satisfaction',
    improvementAction: 'Meets baseline. Consider minor enhancements.',
    resonanceImpact: 0.02
  },
  {
    id: 'fn_partial',
    pattern: 'partially correct, some good parts, mixed',
    sentiment: 'neutral',
    category: 'accuracy',
    improvementAction: 'Identify and fix incorrect portions.',
    resonanceImpact: -0.03
  }
];

/**
 * Matches feedback text against known patterns
 * @param feedbackText User's feedback text
 * @returns Array of matching patterns with confidence scores
 */
export function matchFeedbackPatterns(
  feedbackText: string
): Array<{ pattern: FeedbackPattern; confidence: number }> {
  const lowerText = feedbackText.toLowerCase();
  const matches: Array<{ pattern: FeedbackPattern; confidence: number }> = [];

  feedbackPatternRegistry.forEach(pattern => {
    const keywords = pattern.pattern.split(',').map(k => k.trim());
    let matchCount = 0;
    
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        matchCount++;
      }
    });

    if (matchCount > 0) {
      const confidence = matchCount / keywords.length;
      matches.push({ pattern, confidence });
    }
  });

  // Sort by confidence descending
  return matches.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Gets the best matching feedback pattern
 * @param feedbackText User's feedback text
 * @returns Best matching pattern or null if no good match
 */
export function getBestFeedbackPattern(
  feedbackText: string
): FeedbackPattern | null {
  const matches = matchFeedbackPatterns(feedbackText);
  
  if (matches.length === 0) {
    return null;
  }

  // Only return pattern if confidence is reasonable (>= 0.3)
  const bestMatch = matches[0];
  return bestMatch.confidence >= 0.3 ? bestMatch.pattern : null;
}

/**
 * Gets suggested improvement actions based on feedback
 * @param feedbackText User's feedback text
 * @returns Array of suggested improvement actions
 */
export function getSuggestedImprovements(feedbackText: string): string[] {
  const matches = matchFeedbackPatterns(feedbackText);
  
  return matches
    .filter(m => m.confidence >= 0.3)
    .map(m => m.pattern.improvementAction);
}

/**
 * Calculates the total resonance impact from feedback
 * @param feedbackText User's feedback text
 * @returns Cumulative resonance impact (-1 to 1)
 */
export function calculateFeedbackImpact(feedbackText: string): number {
  const matches = matchFeedbackPatterns(feedbackText);
  
  if (matches.length === 0) {
    return 0;
  }

  // Weight impacts by confidence
  const totalImpact = matches.reduce((sum, match) => {
    return sum + (match.pattern.resonanceImpact * match.confidence);
  }, 0);

  // Normalize by total confidence to prevent amplification
  const totalConfidence = matches.reduce((sum, match) => sum + match.confidence, 0);
  
  return totalConfidence > 0 ? totalImpact / totalConfidence : 0;
}
