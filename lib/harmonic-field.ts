/**
 * Pillar 6: Harmonic Field Matching
 * Polar-complex vector math for high-precision intent alignment
 */

/**
 * Calculates pattern match confidence using harmonic field alignment
 * @param userRequest User's request string
 * @param pattern Pattern to match against
 * @returns Confidence score between 0 and 1
 */
export function calculatePatternMatchConfidence(
  userRequest: string,
  pattern: string
): number {
  const userTokens = tokenize(userRequest);
  const patternTokens = tokenize(pattern);
  
  // Calculate keyword overlap
  const keywordScore = calculateKeywordOverlap(userTokens, patternTokens);
  
  // Calculate semantic alignment using harmonic vectors
  const harmonicScore = calculateHarmonicAlignment(userTokens, patternTokens);
  
  // Calculate intent magnitude
  const magnitudeScore = calculateIntentMagnitude(userRequest, pattern);
  
  // Weighted combination
  return (keywordScore * 0.4) + (harmonicScore * 0.4) + (magnitudeScore * 0.2);
}

/**
 * Tokenizes a string into normalized words
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

/**
 * Calculates keyword overlap between two token sets
 */
function calculateKeywordOverlap(tokensA: string[], tokensB: string[]): number {
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Calculates harmonic alignment using vector representation
 */
function calculateHarmonicAlignment(tokensA: string[], tokensB: string[]): number {
  // Create frequency vectors
  const freqA = createFrequencyVector(tokensA);
  const freqB = createFrequencyVector(tokensB);
  
  // Calculate cosine similarity
  return calculateCosineSimilarity(freqA, freqB);
}

/**
 * Creates a frequency vector from tokens
 */
function createFrequencyVector(tokens: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  tokens.forEach(token => {
    freq.set(token, (freq.get(token) || 0) + 1);
  });
  return freq;
}

/**
 * Calculates cosine similarity between two frequency vectors
 */
function calculateCosineSimilarity(
  freqA: Map<string, number>,
  freqB: Map<string, number>
): number {
  const allTokens = new Set([...freqA.keys(), ...freqB.keys()]);
  
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;
  
  allTokens.forEach(token => {
    const a = freqA.get(token) || 0;
    const b = freqB.get(token) || 0;
    dotProduct += a * b;
    magA += a * a;
    magB += b * b;
  });
  
  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  return magnitude > 0 ? dotProduct / magnitude : 0;
}

/**
 * Calculates intent magnitude based on text characteristics
 */
function calculateIntentMagnitude(requestA: string, requestB: string): number {
  const lengthRatio = Math.min(requestA.length, requestB.length) / 
                      Math.max(requestA.length, requestB.length);
  
  // Penalize large length differences
  return Math.pow(lengthRatio, 0.5);
}

/**
 * Converts intent to a polar-complex vector representation
 */
export function intentToVector(intent: string): { magnitude: number; direction: number[] } {
  const tokens = tokenize(intent);
  const magnitude = Math.min(tokens.length / 10, 1); // Normalize by typical length
  
  // Simple directional encoding based on key verbs
  const actionVerbs = ['create', 'build', 'make', 'generate', 'develop'];
  const analysisVerbs = ['analyze', 'review', 'check', 'examine', 'study'];
  const modifyVerbs = ['update', 'change', 'modify', 'fix', 'improve'];
  
  let direction = [0, 0]; // [x, y] vector
  
  tokens.forEach(token => {
    if (actionVerbs.includes(token)) direction[0] += 1;
    if (analysisVerbs.includes(token)) direction[1] += 1;
    if (modifyVerbs.includes(token)) direction[0] += 0.5;
  });
  
  // Normalize direction
  const dirMag = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1]);
  if (dirMag > 0) {
    direction = [direction[0] / dirMag, direction[1] / dirMag];
  } else {
    direction = [1, 0]; // Default direction
  }
  
  return { magnitude, direction };
}
