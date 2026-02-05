/**
 * PRZ-AI-EI-OS - Artificial Emotional Intelligence for GitHub Copilot
 * Main entry point
 */

export { EmotionalIntelligence, EmotionalState, EmotionalContext } from './emotional-intelligence';

// Version information
export const VERSION = '1.0.0';

/**
 * Creates a new instance of the Emotional Intelligence system
 * @returns A new EmotionalIntelligence instance
 */
export function createEmotionalIntelligence() {
  const { EmotionalIntelligence } = require('./emotional-intelligence');
  return new EmotionalIntelligence();
}
