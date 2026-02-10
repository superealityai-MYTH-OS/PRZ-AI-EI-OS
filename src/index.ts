/**
 * PRZ-AI-EI-OS - Artificial Emotional Intelligence for GitHub Copilot
 * Main entry point
 */

import { EmotionalIntelligence as EI } from './emotional-intelligence';
export { EmotionalIntelligence, EmotionalState, EmotionalContext } from './emotional-intelligence';
export { PrzAgent, createPrzAgent } from '../lib/agent';

// Export feedback functionality
export {
  UserFeedback,
  FeedbackResult,
  FeedbackAggregation,
  FeedbackSentiment,
  FeedbackType,
  processFeedback,
  aggregateFeedback,
  adjustResonanceWithFeedback,
  shouldTransitionState,
  detectContradictoryFeedback
} from '../lib/prz/user-feedback';

// Export feedback patterns
export {
  FeedbackPattern,
  feedbackPatternRegistry,
  matchFeedbackPatterns,
  getBestFeedbackPattern,
  getSuggestedImprovements,
  calculateFeedbackImpact
} from '../lib/feedback-registry';

// Version information
export const VERSION = '1.0.0';

/**
 * Creates a new instance of the Emotional Intelligence system
 * @returns A new EmotionalIntelligence instance
 */
export function createEmotionalIntelligence() {
  return new EI();
}
