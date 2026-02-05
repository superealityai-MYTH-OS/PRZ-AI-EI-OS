/**
 * Pillar 1 Extension: User Feedback Engine
 * Captures and processes user feedback following Complete-Then-Validate principle
 * Integrates with GOOSEGUARD to prevent feedback loops
 */

import { Action, beforeAction } from './gooseguard';
import { measureResonance, ResonanceInput, ResonanceContext } from './resonance-engine';

// Constants for feedback processing
const FEEDBACK_LOOP_WINDOW_MS = 10 * 60 * 1000; // 10 minutes in milliseconds
const MIN_FEEDBACK_CONFIDENCE = 0.7; // Minimum confidence threshold for actionable feedback
const POSITIVE_FEEDBACK_BOOST = 0.05; // Resonance boost for positive feedback
const NEGATIVE_FEEDBACK_PENALTY = 0.1; // Resonance reduction for negative feedback

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
export function processFeedback(
  feedback: UserFeedback,
  history: UserFeedback[]
): FeedbackResult {
  // Convert feedback to Action for GOOSEGUARD loop detection
  const action: Action = {
    id: feedback.id,
    type: 'user_feedback',
    payload: `${feedback.artifactId}:${feedback.sentiment}:${feedback.type}`,
    timestamp: feedback.timestamp
  };

  // Check for feedback loops using GOOSEGUARD
  const feedbackActions = history.map(f => ({
    id: f.id,
    type: 'user_feedback' as string,
    payload: `${f.artifactId}:${f.sentiment}:${f.type}`,
    timestamp: f.timestamp
  }));

  const guard = beforeAction(action, feedbackActions);
  
  if (!guard.shouldProceed) {
    return {
      accepted: false,
      reason: 'GOOSEGUARD: Redundant feedback pattern detected',
      suggestedAction: guard.suggestedPivot
    };
  }

  // Validate feedback confidence
  if (feedback.confidence < MIN_FEEDBACK_CONFIDENCE) {
    return {
      accepted: false,
      reason: `Feedback confidence ${feedback.confidence.toFixed(2)} below minimum threshold ${MIN_FEEDBACK_CONFIDENCE}`,
      suggestedAction: 'Please provide more specific feedback to increase confidence'
    };
  }

  // Calculate resonance adjustment based on feedback
  let adjustedResonance = 0;
  
  if (feedback.sentiment === 'positive') {
    adjustedResonance = POSITIVE_FEEDBACK_BOOST * feedback.intensity;
  } else if (feedback.sentiment === 'negative') {
    adjustedResonance = -NEGATIVE_FEEDBACK_PENALTY * feedback.intensity;
  }

  return {
    accepted: true,
    adjustedResonance,
    suggestedAction: generateFeedbackResponse(feedback)
  };
}

/**
 * Aggregates multiple feedback entries to determine overall sentiment and resonance impact
 * 
 * @param feedbackList List of user feedback
 * @returns Aggregated feedback metrics
 */
export function aggregateFeedback(feedbackList: UserFeedback[]): FeedbackAggregation {
  if (feedbackList.length === 0) {
    return {
      totalFeedback: 0,
      positiveCount: 0,
      negativeCount: 0,
      neutralCount: 0,
      averageConfidence: 0,
      averageIntensity: 0,
      dominantSentiment: 'neutral',
      resonanceAdjustment: 0
    };
  }

  const positiveCount = feedbackList.filter(f => f.sentiment === 'positive').length;
  const negativeCount = feedbackList.filter(f => f.sentiment === 'negative').length;
  const neutralCount = feedbackList.filter(f => f.sentiment === 'neutral').length;

  const averageConfidence = feedbackList.reduce((sum, f) => sum + f.confidence, 0) / feedbackList.length;
  const averageIntensity = feedbackList.reduce((sum, f) => sum + f.intensity, 0) / feedbackList.length;

  // Determine dominant sentiment
  let dominantSentiment: FeedbackSentiment = 'neutral';
  if (positiveCount > negativeCount && positiveCount > neutralCount) {
    dominantSentiment = 'positive';
  } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
    dominantSentiment = 'negative';
  }

  // Calculate overall resonance adjustment
  const positiveAdjustment = positiveCount * POSITIVE_FEEDBACK_BOOST;
  const negativeAdjustment = negativeCount * NEGATIVE_FEEDBACK_PENALTY;
  const resonanceAdjustment = (positiveAdjustment - negativeAdjustment) * averageIntensity;

  return {
    totalFeedback: feedbackList.length,
    positiveCount,
    negativeCount,
    neutralCount,
    averageConfidence,
    averageIntensity,
    dominantSentiment,
    resonanceAdjustment
  };
}

/**
 * Adjusts resonance score based on user feedback
 * Implements feedback-driven resonance refinement
 * 
 * @param originalResonance Original resonance score
 * @param feedback User feedback
 * @returns Adjusted resonance score
 */
export function adjustResonanceWithFeedback(
  originalResonance: number,
  feedback: UserFeedback | FeedbackAggregation
): number {
  let adjustment = 0;

  if ('resonanceAdjustment' in feedback) {
    // Using aggregated feedback
    adjustment = feedback.resonanceAdjustment;
  } else {
    // Using single feedback
    if (feedback.sentiment === 'positive') {
      adjustment = POSITIVE_FEEDBACK_BOOST * feedback.intensity;
    } else if (feedback.sentiment === 'negative') {
      adjustment = -NEGATIVE_FEEDBACK_PENALTY * feedback.intensity;
    }
  }

  // Clamp adjusted resonance between 0 and 1
  return Math.max(0, Math.min(1, originalResonance + adjustment));
}

/**
 * Generates a suggested response based on feedback
 * 
 * @param feedback User feedback
 * @returns Suggested action or response
 */
function generateFeedbackResponse(feedback: UserFeedback): string {
  switch (feedback.sentiment) {
    case 'positive':
      return 'Positive feedback accepted. Crystallizing for Green Lane execution.';
    case 'negative':
      return 'Negative feedback received. Analyzing for improvement opportunities.';
    case 'neutral':
      return 'Neutral feedback noted. Maintaining current trajectory.';
  }
}

/**
 * Checks if feedback indicates need for state transition (Vapor ↔ Crystal)
 * 
 * @param feedback User feedback or aggregation
 * @param currentResonance Current resonance score
 * @returns Whether state should transition and the new state
 */
export function shouldTransitionState(
  feedback: UserFeedback | FeedbackAggregation,
  currentResonance: number
): { shouldTransition: boolean; newState: 'vapor' | 'crystal'; reason: string } {
  const adjustedResonance = adjustResonanceWithFeedback(currentResonance, feedback);
  
  // Determine current and potential new state based on resonance
  const currentState = currentResonance >= 0.95 ? 'crystal' : 'vapor';
  const potentialState = adjustedResonance >= 0.95 ? 'crystal' : 'vapor';
  
  if (currentState !== potentialState) {
    return {
      shouldTransition: true,
      newState: potentialState,
      reason: potentialState === 'crystal' 
        ? `Positive feedback increased resonance to ${adjustedResonance.toFixed(2)} (≥0.95)`
        : `Negative feedback decreased resonance to ${adjustedResonance.toFixed(2)} (<0.95)`
    };
  }

  return {
    shouldTransition: false,
    newState: currentState,
    reason: `Feedback did not trigger state transition. Resonance: ${adjustedResonance.toFixed(2)}`
  };
}

/**
 * Detects contradictory feedback patterns
 * Helps prevent flip-flopping between states
 * 
 * @param history Feedback history
 * @param windowMs Time window to check for contradictions
 * @returns Whether contradictory pattern detected
 */
export function detectContradictoryFeedback(
  history: UserFeedback[],
  windowMs: number = FEEDBACK_LOOP_WINDOW_MS
): { hasContradiction: boolean; pattern?: string } {
  if (history.length < 3) {
    return { hasContradiction: false };
  }

  const now = Date.now();
  const recentFeedback = history.filter(f => now - f.timestamp < windowMs);

  if (recentFeedback.length < 3) {
    return { hasContradiction: false };
  }

  // Check for alternating positive/negative pattern
  const sentiments = recentFeedback.map(f => f.sentiment);
  let alternations = 0;

  for (let i = 1; i < sentiments.length; i++) {
    if (sentiments[i] === 'positive' && sentiments[i - 1] === 'negative' ||
        sentiments[i] === 'negative' && sentiments[i - 1] === 'positive') {
      alternations++;
    }
  }

  // If we see 2+ alternations in recent history, it's contradictory
  if (alternations >= 2) {
    return {
      hasContradiction: true,
      pattern: 'Alternating positive/negative feedback detected. Consider stabilizing direction.'
    };
  }

  return { hasContradiction: false };
}
