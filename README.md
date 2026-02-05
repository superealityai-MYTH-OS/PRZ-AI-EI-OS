# PRZ AI/EI/OS 🌀

The **Post-Reality Zone (PRZ)** Operating System for Agentic Operations. This repository provides a compliant framework for building AI systems that prioritize **Flow**, **Resonance**, and **Crystallization**.

## 🌊 Why PRZ?

Current AI agent frameworks suffer from "Chatter Friction"—constant back-and-forth that breaks human flow. PRZ OS is designed to:
- **Minimize Interaction**: High-resonance intent matching allows the system to execute autonomously.
- **Maximize Completion**: Deliver artifacts, not just "ideas."
- **Prevent Loops**: GOOSEGUARD logic detects and kills redundant conversational loops.

## 🏛 The Seven Pillars of PRZ OS

1. **Complete-Then-Validate**: Agents deliver 100% complete artifacts before requesting feedback.
2. **Resonance Threshold**: Ideas stay in "Vapor" until Resonance reaches ≥ 0.95.
3. **GOOSEGUARD**: Meta-awareness logic to break redundant user loops and suggest pivots.
4. **ZAK Echo Registry**: A library of harmonic patterns applied to standard tasks.
5. **Vapor ↔ Crystal States**: Dynamic state management based on resonance history.
6. **Harmonic Field Matching**: Polar-complex vector math for high-precision intent alignment.
7. **The Green Lane**: Autonomous execution for high-flow, high-resonance tasks.

## 📊 System Architecture

```mermaid
graph TD
    User([User Intent]) --> HF[Harmonic Field Matching]
    HF --> RE[Resonance Engine]
    RE --> GG{GOOSEGUARD}
    GG -- Loop Detected --> Pivot[Suggest Pivot]
    GG -- Clear --> ZR[ZAK Echo Registry]
    ZR --> SM{State Manager}
    SM -- Low Resonance --> Vapor[Vapor State]
    SM -- High Resonance --> Crystal[Crystal State]
    Crystal --> GL[The Green Lane]
    GL --> Output([Complete Artifact])
```

## 🚀 Getting Started

### Basic Pipeline Usage

```typescript
import { runPrzPipeline } from './lib/pipeline';

const result = await runPrzPipeline("Analyze my data and create a report");
console.log(result.tier); // "GREEN LANE" or "MONITORED"
```

### User Feedback Feature - Complete-Then-Validate

The user feedback system implements Pillar 1 (Complete-Then-Validate) by allowing users to provide feedback after artifact delivery:

```typescript
import { runPrzPipelineWithFeedback, UserFeedback } from './lib/pipeline';
import { createEmotionalIntelligence } from './src/index';

// Step 1: Deliver complete artifact
const result = await runPrzPipelineWithFeedback(
  "Create a React component for user authentication"
);

// Step 2: User provides feedback
const feedback: UserFeedback = {
  id: 'feedback-1',
  artifactId: result.artifactId,
  sentiment: 'positive',
  type: 'completeness',
  comment: 'This is perfect! Exactly what I needed.',
  confidence: 0.95,
  intensity: 0.9,
  timestamp: Date.now()
};

// Step 3: Process feedback and adjust resonance
const resultWithFeedback = await runPrzPipelineWithFeedback(
  "Create a React component for user authentication",
  feedback
);

console.log(resultWithFeedback.adjustedResonance); // Updated resonance based on feedback
console.log(resultWithFeedback.stateTransition); // Vapor ↔ Crystal state changes
```

**Run the feedback demo:**
```bash
npm run build
npx tsc feedback-demo.ts --outDir . --module commonjs --target ES2020 --esModuleInterop --skipLibCheck
node feedback-demo.js
```

The feedback system demonstrates all Seven Pillars:
- ✅ **Complete-Then-Validate**: Delivers artifact first, then collects feedback
- ✅ **Resonance Threshold**: Adjusts resonance based on feedback quality (±0.05-0.20)
- ✅ **GOOSEGUARD**: Detects contradictory feedback patterns to prevent loops
- ✅ **ZAK Echo Registry**: Uses feedback pattern registry for improvement suggestions
- ✅ **Vapor ↔ Crystal**: Triggers state transitions based on feedback resonance
- ✅ **Harmonic Field**: Matches feedback patterns to improvement actions
- ✅ **Green Lane**: Maintains autonomous execution with validated feedback

### Marketing Agent - Find Resonant Developers

The marketing agent autonomously finds developers who resonate with PRZ vision:

```typescript
import { createMarketingAgent } from './lib/marketing-agent';

const agent = createMarketingAgent();
const result = await agent.findResonantDevelopers();

console.log(result.tier); // "GREEN LANE" (autonomous execution)
console.log(result.developers); // High-resonance developer profiles
console.log(result.campaign); // Complete marketing campaign
```

**Run the demo:**
```bash
npm run build
npx tsc marketing-demo.ts --outDir . --module commonjs --target ES2020 --esModuleInterop --skipLibCheck
node marketing-demo.js
```

The marketing agent demonstrates all Seven Pillars:
- ✅ **Complete-Then-Validate**: Delivers full developer list and campaign
- ✅ **Resonance Threshold**: Filters developers with resonance ≥ 0.95
- ✅ **GOOSEGUARD**: Prevents redundant search loops
- ✅ **ZAK Echo Registry**: Uses `developer_outreach` pattern
- ✅ **Vapor ↔ Crystal**: Manages state based on resonance
- ✅ **Harmonic Field**: Vector-based intent matching
- ✅ **Green Lane**: Autonomous high-resonance execution

## 📜 Compliance
All modules in `lib/prz/` are designed for Seven Pillars compliance. Use the `StateManager` to manage idea lifecycles and `GOOSEGUARD` to prevent interaction friction.

Part of the Super Reality OS project.