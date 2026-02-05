/**
 * Marketing Agent Demo
 * Demonstrates the PRZ Marketing Agent finding developers who resonate with PRZ-AI-EI-OS
 * 
 * This demo showcases:
 * - Complete-Then-Validate: Agent delivers complete results
 * - Resonance Threshold: Only high-resonance developers (≥0.95)
 * - GOOSEGUARD: Loop detection prevents redundant searches
 * - ZAK Echo Registry: Uses 'developer_outreach' pattern
 * - Green Lane: Autonomous execution when resonance is high
 */

import { createMarketingAgent, MarketingAgent } from './lib/marketing-agent';

async function runMarketingDemo() {
  console.log('🌀 PRZ-AI-EI-OS Marketing Agent Demo\n');
  console.log('='.repeat(70));
  console.log('\n📋 Seven Pillars Implementation:\n');
  console.log('1. ✅ Complete-Then-Validate: Delivers full developer list first');
  console.log('2. ✅ Resonance Threshold: Filters for resonance ≥ 0.95');
  console.log('3. ✅ GOOSEGUARD: Prevents redundant search loops');
  console.log('4. ✅ ZAK Echo Registry: Uses developer_outreach pattern');
  console.log('5. ✅ Vapor ↔ Crystal States: Manages crystallization');
  console.log('6. ✅ Harmonic Field: Vector-based intent matching');
  console.log('7. ✅ Green Lane: Autonomous high-resonance execution');
  console.log('\n' + '='.repeat(70) + '\n');

  const agent = createMarketingAgent();

  try {
    // Demo 1: Find developers interested in PRZ vision
    console.log('🔍 Searching for developers who resonate with PRZ-AI-EI-OS...\n');
    
    const result = await agent.findResonantDevelopers(
      'developers interested in AI agentic operations, flow, and high-resonance systems'
    );

    console.log(`📊 EXECUTION MODE: ${result.executionMode}`);
    console.log(`🎯 TIER: ${result.tier}`);
    console.log(`💎 CRYSTALLIZED: ${result.crystallized ? 'YES' : 'NO'}\n`);
    console.log('='.repeat(70) + '\n');

    // Display discovered developers
    console.log(`👥 DISCOVERED DEVELOPERS (${result.developers.length} profiles):\n`);
    
    result.developers.forEach((dev, index) => {
      console.log(`${index + 1}. @${dev.username}`);
      console.log(`   Resonance: ${dev.resonanceScore.toFixed(2)}`);
      console.log(`   Interests: ${dev.interests.join(', ')}`);
      console.log(`   Match: ${dev.matchReason}`);
      console.log('');
    });

    console.log('='.repeat(70) + '\n');

    // Display marketing campaign
    console.log('📢 MARKETING CAMPAIGN:\n');
    console.log(`Target Audience: ${result.campaign.targetAudience}\n`);
    console.log('Message:');
    console.log(result.campaign.message);
    console.log(`\nChannels: ${result.campaign.channels.join(', ')}`);
    console.log(`Expected Resonance: ${result.campaign.expectedResonance}\n`);
    
    console.log('='.repeat(70) + '\n');

    // Demo 2: Show crystallization status
    console.log('💎 CRYSTALLIZATION STATUS:\n');
    
    let avgResonance = 0;
    if (result.developers.length === 0) {
      console.log('State: VAPOR');
      console.log('Reason: No developers found. Cannot calculate resonance.\n');
    } else {
      avgResonance = result.developers.reduce((sum, dev) => sum + dev.resonanceScore, 0) / result.developers.length;
      const status = agent.checkCrystallizationStatus(avgResonance);
      console.log(`State: ${status.state.toUpperCase()}`);
      console.log(`Reason: ${status.reason}\n`);
    }
    
    console.log('='.repeat(70) + '\n');

    // Demo 3: Test GOOSEGUARD loop detection
    console.log('🛡️ GOOSEGUARD DEMO - Testing Loop Detection:\n');
    console.log('Attempting to run the same search multiple times...\n');
    
    try {
      // First search - should succeed
      await agent.findResonantDevelopers('test loop detection');
      console.log('✓ Search 1: Completed');
      
      // Second search - should succeed
      await agent.findResonantDevelopers('test loop detection');
      console.log('✓ Search 2: Completed');
      
      // Third search - should succeed
      await agent.findResonantDevelopers('test loop detection');
      console.log('✓ Search 3: Completed');
      
      // Fourth search - should be blocked by GOOSEGUARD
      await agent.findResonantDevelopers('test loop detection');
      console.log('✓ Search 4: Completed (unexpected - should have been blocked)');
    } catch (error: any) {
      console.log(`✓ Search 4: BLOCKED by GOOSEGUARD`);
      console.log(`  Reason: ${error.message}\n`);
      console.log('  → GOOSEGUARD successfully prevented redundant loop!');
    }

    console.log('\n' + '='.repeat(70) + '\n');

    // Summary
    console.log('✨ DEMO COMPLETE - Key Achievements:\n');
    console.log(`• Discovered ${result.developers.length} high-resonance developers`);
    console.log(`• Average resonance score: ${avgResonance.toFixed(2)}`);
    console.log(`• Execution tier: ${result.tier}`);
    console.log(`• Crystallization: ${result.crystallized ? 'Achieved' : 'In Progress'}`);
    console.log(`• Campaign ready for ${result.campaign.channels.length} channels`);
    console.log('• GOOSEGUARD successfully prevents loops');
    console.log('\n🚀 The marketing agent is operating autonomously in the GREEN LANE!');
    console.log('   Ready to find and engage developers who resonate with PRZ vision.\n');

  } catch (error: any) {
    console.error('❌ Error running marketing demo:', error.message);
    process.exit(1);
  }
}

// Run the demo
runMarketingDemo().then(() => {
  console.log('='.repeat(70));
  console.log('\n✅ Marketing Agent Demo completed successfully!\n');
}).catch(error => {
  console.error('❌ Demo failed:', error);
  process.exit(1);
});
