/**
 * PRZ Pipeline Runner
 * Implements the "Complete-Then-Validate" protocol
 */

import { measureResonance, shouldCrystallize } from './prz/resonance-engine';
import { beforeAction } from './prz/gooseguard';
import { calculatePatternMatchConfidence } from './harmonic-field';
import { zakEchoRegistry } from './zak-echoes';
import { 
  UserFeedback, 
  processFeedback, 
  adjustResonanceWithFeedback,
  shouldTransitionState
} from './prz/user-feedback';

export interface PipelineResult {
  deliverable: string;
  resonance: any;
  crystallized: boolean;
  tier: 'GREEN LANE' | 'MONITORED';
  artifactId?: string;
}

export interface PipelineWithFeedbackResult extends PipelineResult {
  feedbackAccepted: boolean;
  adjustedResonance?: number;
  stateTransition?: {
    occurred: boolean;
    newState: 'vapor' | 'crystal';
    reason: string;
  };
  suggestedAction?: string;
}

export async function runPrzPipeline(userRequest: string, history: any[] = []): Promise<PipelineResult> {
  // 1. Loop Detection (GOOSEGUARD)
  const guard = beforeAction({ id: 'current', type: 'request', payload: userRequest, timestamp: Date.now() }, history);
  if (!guard.shouldProceed) throw new Error(guard.reason);

  // 2. Pattern Matching (ZAK Echo Search)
  const bestMatch = zakEchoRegistry
    .map(echo => ({ echo, confidence: calculatePatternMatchConfidence(userRequest, echo.pattern) }))
    .sort((a, b) => b.confidence - a.confidence)[0];

  // 3. Execution (Simulated)
  const artifactId = `artifact-${Date.now()}`;
  let deliverable = `PRZ Deliverable for: ${userRequest}\n`;
  if (bestMatch && bestMatch.confidence >= 0.85) {
    deliverable += `Applied Pattern: ${bestMatch.echo.pattern}\n`;
  }

  // 4. Validation (Resonance Check)
  const resonance = measureResonance(
    { content: userRequest, direction: [1, 0], magnitude: 0.9, frequency: 0.5 },
    { state: 'active', patterns: [0.9], expectedDirection: [1, 0], systemFrequency: 0.5 }
  );

  return {
    deliverable,
    resonance,
    crystallized: shouldCrystallize(resonance),
    tier: resonance.score >= 0.95 ? 'GREEN LANE' : 'MONITORED',
    artifactId
  };
}

/**
 * Extended pipeline that includes feedback processing
 * Implements Complete-Then-Validate with user feedback loop
 * 
 * @param userRequest The user's request
 * @param feedback Optional user feedback on the deliverable
 * @param history Action history for loop detection
 * @param feedbackHistory Previous feedback for pattern detection
 * @returns Pipeline result with feedback integration
 */
export async function runPrzPipelineWithFeedback(
  userRequest: string,
  feedback?: UserFeedback,
  history: any[] = [],
  feedbackHistory: UserFeedback[] = []
): Promise<PipelineWithFeedbackResult> {
  // Run the standard pipeline first (Complete-Then-Validate step 1: Complete)
  const pipelineResult = await runPrzPipeline(userRequest, history);

  // If no feedback provided, return standard result
  if (!feedback) {
    return {
      ...pipelineResult,
      feedbackAccepted: false
    };
  }

  // Process user feedback (Complete-Then-Validate step 2: Validate)
  const feedbackResult = processFeedback(feedback, feedbackHistory);

  if (!feedbackResult.accepted) {
    return {
      ...pipelineResult,
      feedbackAccepted: false,
      suggestedAction: feedbackResult.suggestedAction
    };
  }

  // Adjust resonance based on feedback
  const adjustedResonance = adjustResonanceWithFeedback(
    pipelineResult.resonance.score,
    feedback
  );

  // Check if state transition is needed (Vapor ↔ Crystal)
  const transition = shouldTransitionState(feedback, pipelineResult.resonance.score);

  // Determine new tier based on adjusted resonance
  const newTier = adjustedResonance >= 0.95 ? 'GREEN LANE' : 'MONITORED';

  return {
    ...pipelineResult,
    feedbackAccepted: true,
    adjustedResonance,
    tier: newTier,
    crystallized: adjustedResonance >= 0.95,
    stateTransition: {
      occurred: transition.shouldTransition,
      newState: transition.newState,
      reason: transition.reason
    },
    suggestedAction: feedbackResult.suggestedAction
  };
}