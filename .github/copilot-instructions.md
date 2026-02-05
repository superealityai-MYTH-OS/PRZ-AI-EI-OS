# PRZ AI/EI/OS - GitHub Copilot Instructions

## Project Overview
The **Post-Reality Zone (PRZ)** Operating System for Agentic Operations provides a compliant framework for building AI systems that prioritize **Flow**, **Resonance**, and **Crystallization**. This system is designed to minimize interaction friction ("Chatter Friction") and maximize autonomous completion through high-resonance intent matching.

**Mission**: Deliver complete artifacts, not just ideas—reducing AI agent back-and-forth while maintaining quality through resonance validation.

## Technology Stack
- **Language**: TypeScript 5.x
- **Runtime**: Node.js 20+
- **Module System**: CommonJS
- **Build Tool**: TypeScript Compiler (tsc)
- **Target**: ES2020

## Coding Guidelines & Patterns

### TypeScript Standards
- Use **strict mode** (all strict type checking enabled)
- Prefer **explicit types** over inference for public APIs and function parameters
- Use **interfaces** for data structures and contracts
- Use **classes** for stateful components (e.g., EmotionalIntelligence, StateManager)
- Always enable `esModuleInterop` and `forceConsistentCasingInFileNames`

### Naming Conventions
- **Files**: Use kebab-case for file names (e.g., `resonance-engine.ts`, `emotional-intelligence.ts`)
- **Classes/Interfaces**: Use PascalCase (e.g., `EmotionalIntelligence`, `EmotionalState`)
- **Functions/Variables**: Use camelCase (e.g., `analyzeEmotion`, `measureResonance`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `INTENSITY_SCALE_FACTOR`, `BASE_CONFIDENCE`)

### Code Organization
- **Main entry point**: `src/index.ts` - exports public API
- **Core logic**: `src/` directory for business logic
- **PRZ framework**: `lib/prz/` for Seven Pillars compliance modules
- **Shared utilities**: `lib/` directory for pipeline and utility functions
- **Output**: Build artifacts go to `dist/` directory (gitignored)

### Documentation
- All public APIs must have **JSDoc comments** including:
  - Function/method description
  - `@param` tags for all parameters
  - `@returns` tag for return values
- Document complex algorithms and business logic inline
- Keep comments concise and focused on "why" rather than "what"

### Error Handling
- Throw descriptive errors with clear messages
- Use custom error classes when appropriate
- Document expected errors in function JSDoc with `@throws` tags
- Handle edge cases explicitly

## Seven Pillars Compliance

All code contributions must align with the **Seven Pillars** framework:

1. **Complete-Then-Validate**: Always deliver 100% complete artifacts before requesting feedback
2. **Resonance Threshold**: Validate ideas using the resonance engine (threshold ≥ 0.95 for Green Lane)
3. **GOOSEGUARD**: Implement meta-awareness to detect and break redundant loops
4. **ZAK Echo Registry**: Use or extend pre-validated patterns for common tasks
5. **Vapor ↔ Crystal States**: Manage dynamic state transitions based on resonance
6. **Harmonic Field Matching**: Use polar-complex vector math for intent alignment
7. **The Green Lane**: Enable autonomous execution for high-resonance tasks

### Adding New Features
When adding new modules or features:
- Ensure they **reduce chatter friction** (minimize back-and-forth interactions)
- Provide clear **resonance validation** for user intent matching
- Make them **modular** and pluggable into the PRZ Pipeline
- Document how they align with the Seven Pillars

### ZAK Echo Registry Contributions
When adding new ZAK Echoes to `lib/zak-echoes.ts`:
- Each echo must represent a **pre-validated pattern** for a specific task
- Include pattern matching criteria (keywords, structure, context)
- Specify expected confidence thresholds (typically ≥ 0.85)
- Document the task domain (e.g., "React Component Refactoring", "API Documentation")

## Testing Requirements
- **Framework**: Tests will use standard Node.js testing when implemented
- **Coverage**: Aim for ≥ 80% code coverage for new features
- **Test Types**:
  - Unit tests for individual functions and classes
  - Integration tests for pipeline workflows
  - Resonance validation tests for pattern matching
- Run `npm test` to execute test suite
- All new features should include corresponding tests
- Bug fixes should include regression tests

## Security & Compliance
- **Never commit secrets** or API keys to the repository
- **Validate all user input** before processing
- Use **parameterized queries** if database integration is added
- **Never log sensitive data** (user credentials, API tokens, personal information)
- Follow **principle of least privilege** in access control
- All security-critical code should be reviewed by at least two maintainers

## File Structure Best Practices
```
src/                      # Main source code
├── index.ts              # Public API exports
├── emotional-intelligence.ts  # EI module
└── [feature].ts          # Feature-specific modules

lib/                      # Shared utilities and framework
├── pipeline.ts           # PRZ pipeline runner
├── prz/                  # Seven Pillars modules
│   ├── resonance-engine.ts
│   └── gooseguard.ts
├── harmonic-field.ts     # Intent matching logic
└── zak-echoes.ts         # Pattern registry

dist/                     # Build output (gitignored)
```

## Common Anti-Patterns to Avoid
- ❌ **Chatter Friction**: Avoid creating features that require excessive back-and-forth
- ❌ **Incomplete Deliverables**: Never output partial or "work in progress" artifacts
- ❌ **Low Resonance**: Don't proceed with ideas below resonance threshold (< 0.95 for Green Lane)
- ❌ **Loop Redundancy**: Watch for and prevent redundant conversation loops
- ❌ **Implicit Typing**: Always use explicit types for public APIs
- ❌ **Magic Numbers**: Use named constants instead of hardcoded values

## Build & Development Commands
```bash
npm run build      # Compile TypeScript to dist/
npm run clean      # Remove dist/ directory
npm test           # Run test suite
```

## Module Exports
- Export only what's necessary for public API from `src/index.ts`
- Keep internal utilities private to their modules
- Use named exports for better IDE support and tree-shaking

## Resonance-Based Development
When implementing features that involve user intent matching:
1. Use `measureResonance()` from `lib/prz/resonance-engine.ts`
2. Check resonance score against thresholds (≥ 0.95 for Green Lane)
3. Use `shouldCrystallize()` to determine state transitions
4. Apply GOOSEGUARD checks via `beforeAction()` to prevent loops

## Contributing Philosophy
This project operates in the **Green Lane**:
- Be respectful and constructive
- Focus on flow and completion over perfection
- Help others find their resonance
- Reduce friction in collaboration
- Move ideas from Vapor to Crystal through validation

---
Part of the Super Reality OS project.
For more details, see [CONTRIBUTING.md](../CONTRIBUTING.md) and [README.md](../README.md).
