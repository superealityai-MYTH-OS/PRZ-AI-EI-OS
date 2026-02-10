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

### PRZ Agent Orchestrator

Drive end-to-end tasks with feedback-aware state management:

```typescript
import { createPrzAgent } from './src/index';
import { UserFeedback } from './lib/prz/user-feedback';

const agent = createPrzAgent();
const feedback: UserFeedback = {
  id: 'fb-1',
  artifactId: 'artifact-123',
  sentiment: 'positive',
  type: 'usefulness',
  comment: 'Great output and very helpful',
  confidence: 0.9,
  intensity: 0.8,
  timestamp: Date.now()
};

const result = await agent.run('Generate a deployment checklist', { feedback });
console.log(result.state); // 'crystal' when resonance >= 0.95
console.log(result.resonanceTrend); // 'up' | 'down' | 'flat'
console.log(result.feedbackSummary.totalFeedback); // aggregated feedback metrics
```

## 🗄️ Database Integrations

PRZ OS includes modular adapters for popular NoSQL databases. Choose the databases that fit your needs:

### Supported Databases
- **MongoDB** - Flexible document store
- **Redis** - High-performance caching and real-time data
- **Apache Cassandra** - Distributed wide-column store
- **Firebase (Realtime DB & Firestore)** - Real-time sync for mobile/web
- **Amazon DynamoDB** - Serverless key-value and document store
- **Couchbase** - High-performance JSON document database
- **Neo4j** - Graph database for connected data

### Quick Start

```typescript
import { MongoDBAdapter } from './lib/database';

const db = new MongoDBAdapter({
  host: 'localhost',
  port: 27017,
  database: 'myapp'
});

await db.connect();
const userId = await db.insertOne('users', { name: 'John', email: 'john@example.com' });
const users = await db.find('users', { name: 'John' });
await db.disconnect();
```

### Installation

Install only the databases you need:

```bash
# MongoDB
npm install mongodb

# Redis  
npm install redis

# Other databases...
# See DATABASE.md for complete installation guide
```

**Run the demo:**
```bash
npm run demo:database
```

**📖 [Complete Database Documentation →](./DATABASE.md)**

## 📜 Compliance
All modules in `lib/prz/` are designed for Seven Pillars compliance. Use the `StateManager` to manage idea lifecycles and `GOOSEGUARD` to prevent interaction friction.

Part of the Super Reality OS project.
