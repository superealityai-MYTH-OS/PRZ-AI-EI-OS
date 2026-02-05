"use strict";
/**
 * Marketing Agent for PRZ-AI-EI-OS
 * Implements the Seven Pillars to find developers who resonate with the PRZ vision
 *
 * This agent operates autonomously in the "Green Lane" (resonance >= 0.95)
 * to discover and engage developers interested in:
 * - AI agentic operations
 * - Flow-based systems
 * - High-resonance architectures
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingAgent = void 0;
exports.createMarketingAgent = createMarketingAgent;
const resonance_engine_1 = require("./prz/resonance-engine");
const gooseguard_1 = require("./prz/gooseguard");
const harmonic_field_1 = require("./harmonic-field");
/**
 * Marketing Agent class implementing the Seven Pillars
 */
class MarketingAgent {
    constructor() {
        this.actionHistory = [];
        this.loopDetectionCache = new Set();
    }
    /**
     * Finds developers who resonate with PRZ-AI-EI-OS vision
     * Implements Complete-Then-Validate: Returns complete list before requesting feedback
     *
     * @param query Optional search parameters
     * @returns Complete marketing result with developer list and campaign
     */
    async findResonantDevelopers(query) {
        const searchQuery = query || 'developers interested in AI agentic operations, flow, and high-resonance systems';
        // Pillar 3: GOOSEGUARD - Loop Detection
        const action = {
            id: `marketing-${Date.now()}`,
            type: 'developer_search',
            payload: searchQuery,
            timestamp: Date.now()
        };
        const guard = (0, gooseguard_1.beforeAction)(action, this.actionHistory);
        if (!guard.shouldProceed) {
            throw new Error(`GOOSEGUARD: ${guard.reason}`);
        }
        this.actionHistory.push(action);
        // Pillar 6: Harmonic Field Matching - Convert intent to vector
        const intentVector = (0, harmonic_field_1.intentToVector)(searchQuery);
        // Pillar 2: Resonance Threshold - Measure alignment
        const resonanceInput = {
            content: searchQuery,
            direction: intentVector.direction,
            magnitude: intentVector.magnitude,
            frequency: 0.95 // Target high-resonance developers
        };
        const resonanceContext = {
            state: 'crystal',
            patterns: [0.95, 0.98, 0.96], // Historical high-resonance patterns
            expectedDirection: [1, 0], // Action-oriented direction
            systemFrequency: 0.95 // PRZ operates at high frequency
        };
        const resonance = (0, resonance_engine_1.measureResonance)(resonanceInput, resonanceContext);
        // Pillar 1: Complete-Then-Validate - Generate complete deliverable
        const developers = await this.generateDeveloperList(searchQuery, resonance.score);
        const campaign = this.createMarketingCampaign(developers);
        // Pillar 5: Vapor ↔ Crystal States - Determine crystallization
        const crystallized = (0, resonance_engine_1.shouldCrystallize)(resonance);
        // Pillar 7: The Green Lane - Autonomous execution for high resonance
        const tier = resonance.score >= 0.95 ? 'GREEN LANE' : 'MONITORED';
        const executionMode = tier === 'GREEN LANE' ? 'AUTONOMOUS' : 'ASSISTED';
        return {
            developers,
            campaign,
            crystallized,
            tier,
            executionMode
        };
    }
    /**
     * Generates a complete list of developer profiles
     * Pillar 4: ZAK Echo Registry - Uses the 'developer_outreach' pattern
     */
    async generateDeveloperList(query, resonanceScore) {
        // In production, this would integrate with GitHub API, LinkedIn, etc.
        // For demo purposes, we generate representative profiles
        const interests = this.extractInterestsFromQuery(query);
        // Generate diverse developer profiles based on PRZ interests
        const profiles = [
            {
                username: 'flow_architect_42',
                interests: ['AI agents', 'flow-based programming', 'autonomous systems'],
                resonanceScore: 0.97,
                matchReason: 'Active in AI agentic operations and flow-based architectures'
            },
            {
                username: 'resonance_engineer',
                interests: ['high-resonance systems', 'intent matching', 'AI/EI'],
                resonanceScore: 0.96,
                matchReason: 'Specializes in resonance-based system design'
            },
            {
                username: 'crystal_state_dev',
                interests: ['state management', 'AI agents', 'crystallization patterns'],
                resonanceScore: 0.95,
                matchReason: 'Expert in state transitions and crystallization logic'
            },
            {
                username: 'harmonic_coder',
                interests: ['vector math', 'pattern matching', 'AI operations'],
                resonanceScore: 0.94,
                matchReason: 'Strong background in harmonic field mathematics'
            },
            {
                username: 'goose_guardian',
                interests: ['loop detection', 'meta-awareness', 'AI safety'],
                resonanceScore: 0.93,
                matchReason: 'Focuses on preventing redundant patterns in AI systems'
            },
            {
                username: 'zak_echo_master',
                interests: ['design patterns', 'AI agents', 'reusable frameworks'],
                resonanceScore: 0.96,
                matchReason: 'Creates reusable patterns for agentic operations'
            },
            {
                username: 'green_lane_runner',
                interests: ['autonomous execution', 'high-performance AI', 'flow optimization'],
                resonanceScore: 0.98,
                matchReason: 'Passionate about autonomous, high-flow execution systems'
            },
            {
                username: 'vapor_to_crystal',
                interests: ['idea management', 'state machines', 'AI lifecycle'],
                resonanceScore: 0.92,
                matchReason: 'Interested in managing idea states from vapor to crystal'
            }
        ];
        // Filter based on resonance threshold (Pillar 2)
        return profiles.filter(p => p.resonanceScore >= (resonanceScore - 0.05));
    }
    /**
     * Creates a marketing campaign for the discovered developers
     */
    createMarketingCampaign(developers) {
        const topInterests = this.aggregateInterests(developers);
        return {
            targetAudience: 'Developers interested in AI agentic operations, flow-based systems, and high-resonance architectures',
            message: `Join PRZ-AI-EI-OS: Build AI systems that prioritize Flow, Resonance, and Crystallization. 
        
The Seven Pillars approach eliminates "chatter friction" and enables autonomous execution in the Green Lane.

✨ Complete-Then-Validate: Deliver artifacts, not ideas
🎯 Resonance Threshold: High-precision intent matching (≥0.95)
🛡️ GOOSEGUARD: Break redundant loops, maintain flow
🌀 ZAK Echo Registry: Reusable harmonic patterns
💎 Vapor ↔ Crystal: Dynamic state management
📐 Harmonic Field: Polar-complex vector math for alignment
🚀 Green Lane: Autonomous execution for high-resonance tasks

Top community interests: ${topInterests.slice(0, 5).join(', ')}`,
            channels: ['GitHub', 'Dev.to', 'Hacker News', 'AI Research Forums', 'Twitter/X'],
            expectedResonance: 0.96
        };
    }
    /**
     * Extracts interests from search query
     */
    extractInterestsFromQuery(query) {
        const keywords = query.toLowerCase().match(/\b\w+\b/g) || [];
        return keywords.filter(k => k.length > 3);
    }
    /**
     * Aggregates interests across developer profiles
     */
    aggregateInterests(developers) {
        const interestMap = new Map();
        developers.forEach(dev => {
            dev.interests.forEach(interest => {
                interestMap.set(interest, (interestMap.get(interest) || 0) + 1);
            });
        });
        return Array.from(interestMap.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([interest]) => interest);
    }
    /**
     * Validates resonance and checks for crystallization
     * Pillar 5: Vapor ↔ Crystal States
     */
    checkCrystallizationStatus(resonanceScore) {
        if (resonanceScore >= 0.95) {
            return {
                state: 'crystal',
                reason: 'High resonance achieved (≥0.95). Ready for autonomous execution.'
            };
        }
        else {
            return {
                state: 'vapor',
                reason: `Resonance ${resonanceScore.toFixed(2)} below threshold. Requires monitoring.`
            };
        }
    }
    /**
     * Clears action history (useful for testing)
     */
    clearHistory() {
        this.actionHistory = [];
        this.loopDetectionCache.clear();
    }
}
exports.MarketingAgent = MarketingAgent;
/**
 * Factory function to create a marketing agent instance
 */
function createMarketingAgent() {
    return new MarketingAgent();
}
