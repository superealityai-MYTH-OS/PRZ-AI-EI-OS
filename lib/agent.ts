/**
 * PRZ Agent Orchestrator
 * Coordinates resonance, feedback, and emotional intelligence for task execution
 */

import { EmotionalContext, EmotionalIntelligence, EmotionalState } from '../src/emotional-intelligence';
import { runPrzPipelineWithFeedback, PipelineWithFeedbackResult } from './pipeline';
import { Action, beforeAction } from './prz/gooseguard';
import { UserFeedback, aggregateFeedback } from './prz/user-feedback';

export type AgentState = 'vapor' | 'crystal';

export interface AgentRunOptions {
  feedback?: UserFeedback;
  emotionalContext?: Partial<EmotionalContext>;
  id?: string;
}

export interface AgentRunResult extends PipelineWithFeedbackResult {
  emotionalState: EmotionalState;
  state: AgentState;
  resonanceTrend: 'up' | 'down' | 'flat';
  feedbackSummary: ReturnType<typeof aggregateFeedback>;
}

/**
 * Core PRZ agent that applies the Seven Pillars across a task lifecycle.
 * Handles loop prevention, resonance tracking, and feedback-aware refinement.
 */
export class PrzAgent {
  private readonly ei: EmotionalIntelligence;
  private readonly actionHistory: Action[] = [];
  private readonly feedbackHistory: UserFeedback[] = [];
  private readonly resonanceHistory: number[] = [];

  constructor(ei?: EmotionalIntelligence) {
    this.ei = ei ?? new EmotionalIntelligence();
  }

  /**
   * Executes a user request through the PRZ pipeline with optional feedback.
   * Applies GOOSEGUARD, tracks resonance trend, and annotates emotional state.
   *
   * @param userRequest The intent to execute
   * @param options Optional feedback and context
   * @returns Full pipeline result with agent metadata
   */
  async run(userRequest: string, options: AgentRunOptions = {}): Promise<AgentRunResult> {
    const actionId = options.id ?? `agent-${Date.now()}`;
    const action: Action = {
      id: actionId,
      type: 'user_request',
      payload: userRequest,
      timestamp: Date.now()
    };

    const guard = beforeAction(action, this.actionHistory);
    if (!guard.shouldProceed) {
      throw new Error(guard.reason ?? 'GOOSEGUARD blocked the action.');
    }

    this.actionHistory.push(action);

    const emotionalState = this.ei.analyzeEmotion({
      userInput: userRequest,
      previousInteractions: options.emotionalContext?.previousInteractions
    });

    const pipelineResult = await runPrzPipelineWithFeedback(
      userRequest,
      options.feedback,
      this.actionHistory,
      this.feedbackHistory
    );

    const effectiveResonance = pipelineResult.adjustedResonance ?? pipelineResult.resonance.score;
    this.resonanceHistory.push(effectiveResonance);

    if (options.feedback && pipelineResult.feedbackAccepted) {
      this.feedbackHistory.push(options.feedback);
    }

    const state: AgentState = effectiveResonance >= 0.95 ? 'crystal' : 'vapor';
    const feedbackSummary = aggregateFeedback(this.feedbackHistory);

    return {
      ...pipelineResult,
      emotionalState,
      state,
      resonanceTrend: this.calculateResonanceTrend(),
      feedbackSummary
    };
  }

  /**
   * Returns aggregated feedback and resonance history for monitoring.
   */
  getStatus(): {
    feedback: ReturnType<typeof aggregateFeedback>;
    resonanceHistory: number[];
    lastState: AgentState;
  } {
    const lastResonance = this.resonanceHistory[this.resonanceHistory.length - 1] ?? 0;
    return {
      feedback: aggregateFeedback(this.feedbackHistory),
      resonanceHistory: [...this.resonanceHistory],
      lastState: lastResonance >= 0.95 ? 'crystal' : 'vapor'
    };
  }

  /**
   * Clears all agent history (useful for fresh runs or tests).
   */
  reset(): void {
    this.actionHistory.splice(0, this.actionHistory.length);
    this.feedbackHistory.splice(0, this.feedbackHistory.length);
    this.resonanceHistory.splice(0, this.resonanceHistory.length);
  }

  private calculateResonanceTrend(): 'up' | 'down' | 'flat' {
    if (this.resonanceHistory.length < 2) {
      return 'flat';
    }

    const [previous, current] = this.resonanceHistory.slice(-2);
    const delta = current - previous;

    if (Math.abs(delta) < 0.01) {
      return 'flat';
    }

    return delta > 0 ? 'up' : 'down';
  }
}

/**
 * Factory helper for creating a PRZ agent instance.
 * @param ei Optional EmotionalIntelligence instance to reuse
 * @returns Configured PrzAgent
 */
export function createPrzAgent(ei?: EmotionalIntelligence): PrzAgent {
  return new PrzAgent(ei);
}
