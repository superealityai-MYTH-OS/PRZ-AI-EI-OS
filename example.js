/**
 * Example usage of PRZ-AI-EI-OS
 * Demonstrates the emotional intelligence capabilities
 */

const { EmotionalIntelligence } = require('./dist/emotional-intelligence');

console.log('PRZ-AI-EI-OS - Emotional Intelligence Demo\n');
console.log('='.repeat(50));

// Create an instance
const ei = new EmotionalIntelligence();

// Test cases
const testCases = [
  "This is great! I love this feature.",
  "I'm having a terrible problem with this error.",
  "The function returns the expected result.",
  "Awesome work! This is perfect and excellent!",
  "This is awful and I hate dealing with these issues."
];

testCases.forEach((input, index) => {
  console.log(`\nTest ${index + 1}: "${input}"`);
  const state = ei.analyzeEmotion({ userInput: input });
  console.log('  Sentiment:', state.sentiment);
  console.log('  Confidence:', state.confidence.toFixed(2));
  console.log('  Intensity:', state.intensity.toFixed(2));
  console.log('  Suggestion:', ei.suggestResponse(state));
});

console.log('\n' + '='.repeat(50));
console.log(`\nTotal interactions analyzed: ${ei.getHistory().length}`);
console.log('\nBuild successful! ✓');
