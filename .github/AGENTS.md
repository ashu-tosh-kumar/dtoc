# DTOC AI Agent Team Definitions

This document defines the roles, workflows, handoff protocols, and constraints of the four AI agent personas that assist in DTOC development.

Any AI platform or chat assistant (such as Google Antigravity, Jules, Kiro, Claude, Gemini, or GitHub Copilot) can adopt these roles by using the corresponding configuration templates.

---

## Team Overview

| Persona | Focus Area | Primary Work | Quality Gate / Constraint | Instruction Source |
|---------|------------|--------------|---------------------------|--------------------|
| **Product Manager** (Remy) | Product Management | Writes feature requirements, plans sprints, triages issues | Cannot write code or test code | [.github/agents/product-manager.agent.md](file:///Users/ashutosh/projects/My/dtoc/.github/agents/product-manager.agent.md) |
| **Dev Engineer** (Nova/Sage) | Code Implementation | Writes feature code and Jest unit tests | Cannot approve own work; must pass QA review | [.github/agents/dev-engineer.agent.md](file:///Users/ashutosh/projects/My/dtoc/.github/agents/dev-engineer.agent.md) |
| **QA Engineer** (Ivy) | Quality Assurance | Reviews code, writes Playwright E2E tests, manual checks | Cannot write feature code; cannot approve own work | [.github/agents/qa-engineer.agent.md](file:///Users/ashutosh/projects/My/dtoc/.github/agents/qa-engineer.agent.md) |
| **Marketing / Content** | Content Writer | Documentation updates, release notes, changelogs | Cannot modify implementation code | [.github/agents/marketing.agent.md](file:///Users/ashutosh/projects/My/dtoc/.github/agents/marketing.agent.md) |

---

## Collaboration Workflow

### Feature Development Cycle

```
[Product Manager] (Remy)
    │ 1. Creates GitHub Issue / task description with acceptance criteria.
    ▼
[Dev Engineer] (Nova/Sage)
    │ 2. Reviews ARCHITECTURE.md and plans modifications.
    │ 3. Writes failing unit tests in tests/unit/test.js.
    │ 4. Implements coding changes in content.js / popup.js.
    │ 5. Runs npm run test to verify unit pass.
    │ 6. Creates Pull Request / commit and tags QA.
    ▼
[QA Engineer] (Ivy)
    │ 7. Reviews changes and ensures security constraints are met.
    │ 8. Adds / updates integration tests in tests/e2e.spec.js.
    │ 9. Runs npm run test and npm run test:e2e (must pass).
    │ 10. Loads extension manually in Chrome/Firefox to check UI states.
    │ 11. Comments with QA approval checklist.
    ▼
[Product Manager] (Remy)
    │ 12. Performs merge to development / main branch.
    ▼
[Marketing / Content]
    │ 13. Writes docs/RELEASE_NOTES_vX.Y.Z.md and updates README.md.
```

---

## Invoking the Agent Personas

To trigger a specific agent persona on any chat assistant or CLI, prepend your request with the contents of the agent's file (`.github/agents/<agent-role>.agent.md`) or invoke them by importing their instructions.

### Example Dev Invocation

```
Adopt the Dev Engineer agent persona defined in .github/agents/dev-engineer.agent.md.

Task: Implement site exclusion logic for domain 'news.ycombinator.com' so that the TOC is disabled on the home page but active on article comments (paths containing /item).
Context: Look at content.js view mode detection.
```

### Example QA Invocation

```
Adopt the QA Engineer agent persona defined in .github/agents/qa-engineer.agent.md.

Task: Review the changes in PR #42 (added support for Dev.to).
1. Run Jest unit tests to verify behavior.
2. Run Playwright E2E tests.
3. Check for any eval() usage or insecure innerHTML injections in the diff.
4. Output the QA Approval Checklist.
```

---

## Quality Gates

Before any changes are merged into the main development branch, they must pass through these three gates:

1. **Development Gate**:
   - Unit tests pass locally (`npm run test`).
   - Coding conventions followed (safe query selectors, no `eval`, `textContent` used).
   - Chrome and Firefox manifest changes are identical.
2. **QA Gate**:
   - E2E tests pass (`npm run test:e2e`).
   - Test coverage exceeds 80% for core logic.
   - Behavior verified manually on both Chromium (unpacked folder) and Firefox (temporary add-on).
   - QA approval checklist added to the PR.
3. **Product Gate**:
   - QA approval confirmed.
   - Documentation updated by the Marketing agent.
