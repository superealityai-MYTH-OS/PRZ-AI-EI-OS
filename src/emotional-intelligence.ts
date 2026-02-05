/**
 * Emotional Intelligence Module for GitHub Copilot
 * Provides artificial emotional intelligence capabilities
 */

export interface EmotionalState {
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  intensity: number;
}

export interface EmotionalContext {
  userInput: string;
  previousInteractions?: string[];
}

export class EmotionalIntelligence {
  private history: EmotionalState[] = [];
  
  // Constants for emotion analysis
  private readonly INTENSITY_SCALE_FACTOR = 3; // Keywords needed for maximum intensity
  private readonly BASE_CONFIDENCE = 0.7; // Baseline confidence level
  private readonly CONFIDENCE_INCREMENT = 0.1; // Confidence boost per keyword difference
  private readonly MAX_CONFIDENCE = 1.0; // Maximum confidence cap

  /**
   * Analyzes emotional context from user input
   * @param context The emotional context to analyze
   * @returns The detected emotional state
   */
  analyzeEmotion(context: EmotionalContext): EmotionalState {
    const { userInput } = context;
    
    // Simple sentiment analysis based on keywords
    const positiveKeywords = ['great', 'excellent', 'good', 'happy', 'love', 'perfect', 'awesome', 'thanks'];
    const negativeKeywords = ['bad', 'terrible', 'hate', 'awful', 'error', 'fail', 'problem', 'issue'];
    
    const lowerInput = userInput.toLowerCase();
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveKeywords.forEach(keyword => {
      if (lowerInput.includes(keyword)) positiveCount++;
    });
    
    negativeKeywords.forEach(keyword => {
      if (lowerInput.includes(keyword)) negativeCount++;
    });
    
    let sentiment: 'positive' | 'neutral' | 'negative';
    let intensity: number;
    
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
      intensity = Math.min(positiveCount / this.INTENSITY_SCALE_FACTOR, 1);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      intensity = Math.min(negativeCount / this.INTENSITY_SCALE_FACTOR, 1);
    } else {
      sentiment = 'neutral';
      intensity = 0.5;
    }
    
    const emotionalState: EmotionalState = {
      sentiment,
      confidence: Math.min(
        this.BASE_CONFIDENCE + (Math.abs(positiveCount - negativeCount) * this.CONFIDENCE_INCREMENT),
        this.MAX_CONFIDENCE
      ),
      intensity
    };
    
    this.history.push(emotionalState);
    
    return emotionalState;
  }

  /**
   * Gets the emotional history
   * @returns Array of previous emotional states
   */
  getHistory(): EmotionalState[] {
    return [...this.history];
  }

  /**
   * Clears the emotional history
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Gets a response suggestion based on emotional state
   * @param state The current emotional state
   * @returns A suggested response approach
   */
  suggestResponse(state: EmotionalState): string {
    if (state.sentiment === 'positive') {
      return 'Maintain positive engagement and encourage continued interaction.';
    } else if (state.sentiment === 'negative') {
      return 'Approach with empathy and focus on problem-solving.';
    } else {
      return 'Maintain neutral, informative tone.';
    }
  }

  /**
   * Analyzes user feedback emotion and extracts actionable insights
   * Specifically designed for post-artifact feedback analysis
   * @param feedbackText The feedback text to analyze
   * @returns The detected emotional state with feedback-specific metadata
   */
  analyzeFeedback(feedbackText: string): EmotionalState & { feedbackType: 'satisfaction' | 'accuracy' | 'completeness' | 'usefulness' } {
    const baseState = this.analyzeEmotion({ userInput: feedbackText });
    
    // Detect feedback type based on keywords
    const lowerText = feedbackText.toLowerCase();
    let feedbackType: 'satisfaction' | 'accuracy' | 'completeness' | 'usefulness' = 'satisfaction';
    
    if (lowerText.match(/accurate|correct|precise|exact|right|wrong/)) {
      feedbackType = 'accuracy';
    } else if (lowerText.match(/complete|missing|lacking|partial|full|thorough/)) {
      feedbackType = 'completeness';
    } else if (lowerText.match(/useful|helpful|practical|applicable|valuable|useless/)) {
      feedbackType = 'usefulness';
    }
    
    return {
      ...baseState,
      feedbackType
    };
  }

  /**
   * Generates a feedback-appropriate response
   * @param state The emotional state from feedback analysis
   * @returns A suggested response for the feedback
   */
  suggestFeedbackResponse(state: EmotionalState): string {
    if (state.sentiment === 'positive') {
      if (state.intensity > 0.7) {
        return 'Excellent! High positive feedback indicates successful crystallization. Proceeding to Green Lane.';
      }
      return 'Positive feedback received. Artifact meets resonance threshold. Maintaining trajectory.';
    } else if (state.sentiment === 'negative') {
      if (state.intensity > 0.7) {
        return 'Significant concerns detected. Returning to Vapor state for refinement. Please specify improvement areas.';
      }
      return 'Feedback indicates room for improvement. Analyzing specific issues for targeted fixes.';
    } else {
      return 'Neutral feedback suggests partial resonance. Consider providing specific areas for enhancement.';
    }
  }

  /**
   * Detects if feedback indicates satisfaction with the artifact
   * @param feedbackText The feedback text
   * @returns Boolean indicating satisfaction level
   */
  isFeedbackSatisfied(feedbackText: string): boolean {
    const state = this.analyzeFeedback(feedbackText);
    return state.sentiment === 'positive' && state.confidence >= 0.7;
  }
}
