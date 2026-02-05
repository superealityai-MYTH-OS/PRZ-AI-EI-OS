/**
 * User Feedback Feature Demo
 * Demonstrates the Complete-Then-Validate workflow with user feedback integration
 * 
 * This demo showcases:
 * - Complete-Then-Validate: Deliver artifact first, then collect feedback
 * - Feedback processing with GOOSEGUARD loop detection
 * - Resonance adjustment based on feedback
 * - State transitions (Vapor ↔ Crystal) triggered by feedback
 * - Emotional Intelligence feedback analysis
 * - Feedback pattern matching and improvement suggestions
 */

import { runPrzPipelineWithFeedback } from './lib/pipeline';
import { createEmotionalIntelligence } from './src/index';
import { 
  UserFeedback,
  processFeedback,
  aggregateFeedback,
  detectContradictoryFeedback
} from './lib/prz/user-feedback';
import {
  matchFeedbackPatterns,
  getSuggestedImprovements,
  calculateFeedbackImpact
} from './lib/feedback-registry';

async function runFeedbackDemo() {
  console.log('🌀 PRZ-AI-EI-OS User Feedback Feature Demo\n');
  console.log('='.repeat(70));
  console.log('\n📋 Demonstrating Complete-Then-Validate with User Feedback:\n');
  console.log('1. ✅ Deliver complete artifact first');
  console.log('2. ✅ Collect user feedback');
  console.log('3. ✅ Analyze feedback with Emotional Intelligence');
  console.log('4. ✅ Adjust resonance based on feedback');
  console.log('5. ✅ Trigger state transitions (Vapor ↔ Crystal)');
  console.log('6. ✅ Prevent feedback loops with GOOSEGUARD');
  console.log('\n' + '='.repeat(70) + '\n');

  // Create EI instance for feedback analysis
  const ei = createEmotionalIntelligence();

  // Demo 1: Successful workflow with positive feedback
  console.log('📊 DEMO 1: Positive Feedback Flow\n');
  console.log('User Request: "Create a React component for user authentication"\n');

  // Step 1: Complete artifact delivery
  const result1 = await runPrzPipelineWithFeedback(
    'Create a React component for user authentication'
  );

  console.log('✓ Artifact Delivered:');
  console.log(`  Tier: ${result1.tier}`);
  console.log(`  Resonance: ${result1.resonance.score.toFixed(2)}`);
  console.log(`  Crystallized: ${result1.crystallized ? 'YES' : 'NO'}\n`);

  // Step 2: User provides positive feedback
  const positiveFeedback: UserFeedback = {
    id: 'feedback-1',
    artifactId: result1.artifactId || 'artifact-1',
    sentiment: 'positive',
    type: 'completeness',
    comment: 'This is perfect! Exactly what I needed. Very complete and accurate.',
    confidence: 0.95,
    intensity: 0.9,
    timestamp: Date.now()
  };

  console.log('User Feedback: "' + positiveFeedback.comment + '"\n');

  // Step 3: Analyze feedback with EI
  const eiAnalysis = ei.analyzeFeedback(positiveFeedback.comment);
  console.log('✓ Emotional Intelligence Analysis:');
  console.log(`  Sentiment: ${eiAnalysis.sentiment}`);
  console.log(`  Confidence: ${eiAnalysis.confidence.toFixed(2)}`);
  console.log(`  Intensity: ${eiAnalysis.intensity.toFixed(2)}`);
  console.log(`  Feedback Type: ${eiAnalysis.feedbackType}`);
  console.log(`  Response: ${ei.suggestFeedbackResponse(eiAnalysis)}\n`);

  // Step 4: Match feedback patterns
  const patterns = matchFeedbackPatterns(positiveFeedback.comment);
  console.log('✓ Matched Feedback Patterns:');
  patterns.slice(0, 3).forEach(p => {
    console.log(`  - ${p.pattern.id}: ${p.pattern.improvementAction} (confidence: ${p.confidence.toFixed(2)})`);
  });
  console.log('');

  // Step 5: Process feedback through pipeline
  const result1WithFeedback = await runPrzPipelineWithFeedback(
    'Create a React component for user authentication',
    positiveFeedback
  );

  console.log('✓ Feedback Processing Result:');
  console.log(`  Feedback Accepted: ${result1WithFeedback.feedbackAccepted ? 'YES' : 'NO'}`);
  console.log(`  Original Resonance: ${result1.resonance.score.toFixed(2)}`);
  console.log(`  Adjusted Resonance: ${result1WithFeedback.adjustedResonance?.toFixed(2)}`);
  console.log(`  New Tier: ${result1WithFeedback.tier}`);
  console.log(`  State Transition: ${result1WithFeedback.stateTransition?.occurred ? 'YES' : 'NO'}`);
  if (result1WithFeedback.stateTransition?.occurred) {
    console.log(`    → New State: ${result1WithFeedback.stateTransition.newState.toUpperCase()}`);
    console.log(`    → Reason: ${result1WithFeedback.stateTransition.reason}`);
  }
  console.log(`  Suggested Action: ${result1WithFeedback.suggestedAction}\n`);

  console.log('='.repeat(70) + '\n');

  // Demo 2: Negative feedback flow
  console.log('📊 DEMO 2: Negative Feedback Flow\n');
  console.log('User Request: "Generate API documentation for my service"\n');

  const result2 = await runPrzPipelineWithFeedback(
    'Generate API documentation for my service'
  );

  console.log('✓ Artifact Delivered:');
  console.log(`  Tier: ${result2.tier}`);
  console.log(`  Resonance: ${result2.resonance.score.toFixed(2)}\n`);

  // User provides negative feedback
  const negativeFeedback: UserFeedback = {
    id: 'feedback-2',
    artifactId: result2.artifactId || 'artifact-2',
    sentiment: 'negative',
    type: 'completeness',
    comment: 'This is incomplete and missing several important sections. Not what I asked for.',
    confidence: 0.85,
    intensity: 0.8,
    timestamp: Date.now()
  };

  console.log('User Feedback: "' + negativeFeedback.comment + '"\n');

  const eiAnalysis2 = ei.analyzeFeedback(negativeFeedback.comment);
  console.log('✓ Emotional Intelligence Analysis:');
  console.log(`  Sentiment: ${eiAnalysis2.sentiment}`);
  console.log(`  Intensity: ${eiAnalysis2.intensity.toFixed(2)}`);
  console.log(`  Response: ${ei.suggestFeedbackResponse(eiAnalysis2)}\n`);

  const improvements = getSuggestedImprovements(negativeFeedback.comment);
  console.log('✓ Suggested Improvements:');
  improvements.slice(0, 3).forEach(imp => {
    console.log(`  - ${imp}`);
  });
  console.log('');

  const impact = calculateFeedbackImpact(negativeFeedback.comment);
  console.log(`✓ Calculated Resonance Impact: ${impact.toFixed(3)}\n`);

  const result2WithFeedback = await runPrzPipelineWithFeedback(
    'Generate API documentation for my service',
    negativeFeedback
  );

  console.log('✓ Feedback Processing Result:');
  console.log(`  Feedback Accepted: ${result2WithFeedback.feedbackAccepted ? 'YES' : 'NO'}`);
  console.log(`  Original Resonance: ${result2.resonance.score.toFixed(2)}`);
  console.log(`  Adjusted Resonance: ${result2WithFeedback.adjustedResonance?.toFixed(2)}`);
  console.log(`  New Tier: ${result2WithFeedback.tier}`);
  console.log(`  State Transition: ${result2WithFeedback.stateTransition?.occurred ? 'YES' : 'NO'}`);
  if (result2WithFeedback.stateTransition?.occurred) {
    console.log(`    → New State: ${result2WithFeedback.stateTransition.newState.toUpperCase()}`);
    console.log(`    → Reason: ${result2WithFeedback.stateTransition.reason}`);
  }
  console.log('');

  console.log('='.repeat(70) + '\n');

  // Demo 3: GOOSEGUARD - Feedback loop detection
  console.log('📊 DEMO 3: GOOSEGUARD Feedback Loop Detection\n');
  console.log('Testing contradictory feedback pattern detection...\n');

  const feedbackHistory: UserFeedback[] = [
    {
      id: 'fb-1',
      artifactId: 'artifact-3',
      sentiment: 'positive',
      type: 'satisfaction',
      comment: 'Great work!',
      confidence: 0.9,
      intensity: 0.8,
      timestamp: Date.now() - 4000
    },
    {
      id: 'fb-2',
      artifactId: 'artifact-3',
      sentiment: 'negative',
      type: 'accuracy',
      comment: 'This is wrong',
      confidence: 0.85,
      intensity: 0.7,
      timestamp: Date.now() - 3000
    },
    {
      id: 'fb-3',
      artifactId: 'artifact-3',
      sentiment: 'positive',
      type: 'satisfaction',
      comment: 'Actually it looks good',
      confidence: 0.8,
      intensity: 0.6,
      timestamp: Date.now() - 2000
    }
  ];

  const contradiction = detectContradictoryFeedback(feedbackHistory);
  console.log('✓ Contradictory Feedback Detection:');
  console.log(`  Has Contradiction: ${contradiction.hasContradiction ? 'YES' : 'NO'}`);
  if (contradiction.hasContradiction) {
    console.log(`  Pattern: ${contradiction.pattern}\n`);
  } else {
    console.log('  Pattern: No contradictions detected\n');
  }

  // Attempt to process contradictory feedback
  const contradictoryFeedback: UserFeedback = {
    id: 'fb-4',
    artifactId: 'artifact-3',
    sentiment: 'negative',
    type: 'usefulness',
    comment: 'Never mind, this is not helpful',
    confidence: 0.75,
    intensity: 0.7,
    timestamp: Date.now()
  };

  const contradictoryResult = processFeedback(contradictoryFeedback, feedbackHistory);
  console.log('✓ Processing Additional Contradictory Feedback:');
  console.log(`  Accepted: ${contradictoryResult.accepted ? 'YES' : 'NO'}`);
  if (!contradictoryResult.accepted) {
    console.log(`  Reason: ${contradictoryResult.reason}`);
    console.log(`  Suggested Action: ${contradictoryResult.suggestedAction}`);
  }
  console.log('');

  console.log('='.repeat(70) + '\n');

  // Demo 4: Aggregated feedback analysis
  console.log('📊 DEMO 4: Aggregated Feedback Analysis\n');

  const multipleFeedback: UserFeedback[] = [
    {
      id: 'fb-agg-1',
      artifactId: 'artifact-4',
      sentiment: 'positive',
      type: 'satisfaction',
      comment: 'Good job',
      confidence: 0.85,
      intensity: 0.7,
      timestamp: Date.now()
    },
    {
      id: 'fb-agg-2',
      artifactId: 'artifact-4',
      sentiment: 'positive',
      type: 'accuracy',
      comment: 'Very accurate',
      confidence: 0.9,
      intensity: 0.8,
      timestamp: Date.now()
    },
    {
      id: 'fb-agg-3',
      artifactId: 'artifact-4',
      sentiment: 'neutral',
      type: 'completeness',
      comment: 'Okay but could use more details',
      confidence: 0.75,
      intensity: 0.5,
      timestamp: Date.now()
    },
    {
      id: 'fb-agg-4',
      artifactId: 'artifact-4',
      sentiment: 'positive',
      type: 'usefulness',
      comment: 'Useful information',
      confidence: 0.88,
      intensity: 0.75,
      timestamp: Date.now()
    }
  ];

  const aggregated = aggregateFeedback(multipleFeedback);
  console.log('✓ Aggregated Feedback Metrics:');
  console.log(`  Total Feedback: ${aggregated.totalFeedback}`);
  console.log(`  Positive: ${aggregated.positiveCount}`);
  console.log(`  Negative: ${aggregated.negativeCount}`);
  console.log(`  Neutral: ${aggregated.neutralCount}`);
  console.log(`  Dominant Sentiment: ${aggregated.dominantSentiment.toUpperCase()}`);
  console.log(`  Average Confidence: ${aggregated.averageConfidence.toFixed(2)}`);
  console.log(`  Average Intensity: ${aggregated.averageIntensity.toFixed(2)}`);
  console.log(`  Resonance Adjustment: ${aggregated.resonanceAdjustment > 0 ? '+' : ''}${aggregated.resonanceAdjustment.toFixed(3)}\n`);

  console.log('='.repeat(70) + '\n');

  // Summary
  console.log('✨ DEMO COMPLETE - User Feedback Feature Highlights:\n');
  console.log('• ✅ Complete-Then-Validate workflow implemented');
  console.log('• ✅ Emotional Intelligence analyzes feedback sentiment');
  console.log('• ✅ Resonance adjusts based on feedback (positive/negative)');
  console.log('• ✅ State transitions triggered by feedback quality');
  console.log('• ✅ GOOSEGUARD prevents contradictory feedback loops');
  console.log('• ✅ Pattern matching suggests improvement actions');
  console.log('• ✅ Aggregated feedback provides comprehensive metrics');
  console.log('\n🚀 The user feedback system maintains flow while enabling validation!');
  console.log('   Users can provide feedback after artifact delivery, and the system');
  console.log('   adjusts resonance, triggers state transitions, and prevents loops.\n');
}

// Run the demo
runFeedbackDemo().then(() => {
  console.log('='.repeat(70));
  console.log('\n✅ User Feedback Feature Demo completed successfully!\n');
}).catch(error => {
  console.error('❌ Demo failed:', error);
  process.exit(1);
});
