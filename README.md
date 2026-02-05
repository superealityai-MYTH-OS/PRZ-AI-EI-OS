# PRZ-AI-EI-OS
ARTIFICIAL EMOTIONAL INTELLIGENCE FOR GITHUB COPILOT

## Overview

PRZ-AI-EI-OS is an emotional intelligence module designed to enhance GitHub Copilot interactions by analyzing and responding to emotional context in user communications.

## Features

- **Emotion Analysis**: Detects sentiment (positive, neutral, negative) from user input
- **Confidence Scoring**: Provides confidence levels for emotional assessments
- **Interaction History**: Tracks emotional states over time
- **Response Suggestions**: Recommends appropriate response strategies

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

This will compile the TypeScript source files to JavaScript in the `dist/` directory.

## Usage

```typescript
import { EmotionalIntelligence } from 'prz-ai-ei-os';

const ei = new EmotionalIntelligence();

const state = ei.analyzeEmotion({
  userInput: "This is great! I love this feature."
});

console.log(state);
// Output: { sentiment: 'positive', confidence: 0.8, intensity: 0.66 }

const suggestion = ei.suggestResponse(state);
console.log(suggestion);
// Output: "Maintain positive engagement and encourage continued interaction."
```

## API

### `EmotionalIntelligence`

Main class for emotional intelligence operations.

#### Methods

- `analyzeEmotion(context: EmotionalContext): EmotionalState` - Analyzes emotional context
- `getHistory(): EmotionalState[]` - Returns history of emotional states
- `clearHistory(): void` - Clears the emotional history
- `suggestResponse(state: EmotionalState): string` - Suggests response strategy

## License

MIT License - See LICENSE file for details
