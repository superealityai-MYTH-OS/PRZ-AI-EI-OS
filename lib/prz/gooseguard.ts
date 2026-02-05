/**
 * Pillar 3: GOOSEGUARD
 * Meta-awareness logic to detect and break redundant conversational loops
 */

// Constants for loop detection
const LOOP_DETECTION_WINDOW_MS = 5 * 60 * 1000; // 5 minutes in milliseconds
const SIMILARITY_THRESHOLD = 0.85; // Threshold for determining action similarity
const MAX_SIMILAR_ACTIONS = 3; // Maximum similar actions before triggering loop detection

export interface Action {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

export interface GuardResult {
  shouldProceed: boolean;
  reason?: string;
  suggestedPivot?: string;
}

/**
 * Detects if an action is part of a redundant loop
 * @param action Current action
 * @param history Previous actions
 * @returns Guard result indicating whether to proceed
 */
export function beforeAction(action: Action, history: Action[]): GuardResult {
  // Check for exact duplicates within a time window (5 minutes)
  const recentActions = history.filter(
    h => action.timestamp - h.timestamp < LOOP_DETECTION_WINDOW_MS
  );

  // Count similar actions
  const similarActions = recentActions.filter(h => {
    if (h.type !== action.type) return false;
    
    // For requests, check payload similarity
    if (typeof h.payload === 'string' && typeof action.payload === 'string') {
      const similarity = calculateStringSimilarity(h.payload, action.payload);
      return similarity > SIMILARITY_THRESHOLD;
    }
    
    return false;
  });

  // If we see 3+ similar actions, it's a loop
  if (similarActions.length >= MAX_SIMILAR_ACTIONS) {
    return {
      shouldProceed: false,
      reason: 'GOOSEGUARD: Redundant loop detected. Breaking to preserve flow.',
      suggestedPivot: 'Consider reformulating your request or exploring a different approach.'
    };
  }

  return { shouldProceed: true };
}

/**
 * Calculates string similarity using a simple character overlap metric
 */
function calculateStringSimilarity(a: string, b: string): number {
  const setA = new Set(a.toLowerCase().split(/\s+/));
  const setB = new Set(b.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
}

/**
 * Checks if we should suggest a pivot to the user
 */
export function shouldSuggestPivot(history: Action[]): boolean {
  if (history.length < 5) return false;
  
  const recentActions = history.slice(-5);
  const types = recentActions.map(a => a.type);
  
  // If all recent actions are the same type, suggest a pivot
  return new Set(types).size === 1;
}
