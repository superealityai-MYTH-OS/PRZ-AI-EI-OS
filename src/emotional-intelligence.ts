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
      intensity = Math.min(positiveCount / 3, 1);
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
      intensity = Math.min(negativeCount / 3, 1);
    } else {
      sentiment = 'neutral';
      intensity = 0.5;
    }
    
    const emotionalState: EmotionalState = {
      sentiment,
      confidence: 0.7 + (Math.abs(positiveCount - negativeCount) * 0.1),
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
}
