# DTOC Project Brief

Single-source-of-truth document for project context, team roles, security rules, and operational procedures.

---

## Project Overview

**DTOC** (Data Template Over Content) is a browser extension for extracting and transforming web page data using CSS selectors and custom templates. Supports Chrome MV3 and Firefox.

**Current State**: Single developer (human) + AI agents working in coordinated sprints

**Goals**:
1. Enable AI-assisted feature development without compromising quality
2. Establish clear role boundaries between product, dev, QA, and marketing
3. Maintain <1 second extraction latency
4. Achieve >80% test coverage
5. Support both Chrome MV3 and Firefox seamlessly
6. Ship updates monthly with full documentation

---

## User Personas

### Primary: Data Analyst
- **Need**: Extract structured data from web pages for analysis
- **Pain Point**: Manual copying, formatting inconsistencies
- **Solution**: Define template once, reuse across pages/sessions
- **Example**: Extract product listings (name, price, rating) to spreadsheet

### Secondary: Content Creator
- **Need**: Bulk extract content (headlines, authors, dates)
- **Pain Point**: Context switching between tools, data formatting
- **Solution**: One-click extraction, multiple export formats
- **Example**: Extract blog post metadata for content database

### Tertiary: Researcher
- **Need**: Validate data extraction consistency
- **Pain Point**: Manual spot-checking, hard to audit extraction logic
- **Solution**: Transparent template definitions, audit trail
- **Example**: Verify extraction rules produce consistent results

---

## Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Vanilla JavaScript | Lightweight, no dependency bloat |
| **Backend** | Chrome/Firefox APIs | Native browser integration |
| **Storage** | chrome.storage.local | Built-in, safe, quota generous |
| **Packaging** | Webpack/Rollup | Code bundling for extensions |
| **Testing** | Playwright | Real browser automation, cross-browser |
| **Documentation** | Markdown + GitBook | Version controlled, accessible |

---

## Team Roles

AI agents are organized by discipline with clear handoff points.

| Role | Agent Name | Owns | Input | Output | Rules |
|------|-----------|------|-------|--------|-------|
| **Dev Engineer** | Nova + Sage | Feature implementation, bug fixes | GitHub Issues, Feature PRs | Working code, passing tests, PR ready | Cannot approve own PRs; must pass QA first |
| **QA Engineer** | Ivy | Test automation, test approval, validation | PRs from Dev | Approved tests, test coverage report | Cannot test own code; cannot approve own findings |
| **Product Manager** | Remy | Sprint planning, feature specs, requirements | User feedback, roadmap | GitHub Issues, Feature PRs, Sprint plans | Cannot write code; owns prioritization |
| **Content/Marketing** | Content | Release notes, documentation, blog posts | Shipped features, code docs | Release notes, updated docs, blog posts | Cannot modify code; publishes after QA approval |

### Handoff Flow

```
Remy (Product)
    ↓
    Creates GitHub Issue with feature spec
    ↓
Nova/Sage (Dev)
    ↓
    Implements feature, creates PR (draft initially)
    ↓
Ivy (QA)
    ↓
    Writes/runs tests, approves code quality (review comment)
    ↓
Nova/Sage (Dev)
    ↓
    Addresses feedback, marks PR ready for merge
    ↓
Remy (Product)
    ↓
    Merges PR (maintainer role)
    ↓
Content (Marketing)
    ↓
    Creates release notes, updates docs
```

---

## Sprint Structure

Sprints are 2 weeks. Each sprint has:

- **Sprint Plan** (`docs/sprint-N/plan.md`): Features, bug fixes, priorities, capacity
- **Progress** (`docs/sprint-N/progress.md`): Daily standup format, blockers, updated estimates
- **Done** (`docs/sprint-N/done.md`): Shipped features, test coverage, deployment notes

### Sprint Workflow

1. **Monday**: Remy creates sprint plan (features to build, bugs to fix, priorities)
2. **Tuesday-Thursday**: Nova/Sage develop, Ivy tests concurrently
3. **Friday**: Review, merge, prepare release
4. **End of Sprint**: Content publishes release notes and doc updates

### Capacity Planning

- **Single developer assumption**: Plan for realistic feature throughput
- **AI agent capacity**: Agents can work in parallel on independent tasks
- **Risk buffer**: Reserve 20% capacity for urgent bugs, firefighting

---

## Security Rules

### Core Principle: Zero External Communication

1. **No network requests to external services**
   - All operations local-only
   - No telemetry, analytics, or data transmission
   - User data never leaves browser

2. **Input validation is mandatory**
   - All CSS selectors validated before execution (prevent injection)
   - Template field names must be alphanumeric + underscore
   - Message types validated against whitelist

3. **Message source validation required**
   - Only accept messages from extension origin
   - Validate message type before processing
   - Sanitize user content before display

4. **Storage security**
   - Use chrome.storage.local (isolated per user, per browser profile)
   - No sync to cloud (user can export manually if desired)
   - Assume user device is trusted

5. **Development Security**
   - No hardcoded secrets in code
   - No eval() or Function() constructor (code injection)
   - No innerHTML with user content (XSS)
   - Use DOMPurify or textContent for user-provided content

### Code Review Checklist (Security)

Before merging:
- [ ] No external API calls or network requests
- [ ] All user input validated (selectors, field names, messages)
- [ ] No eval(), Function(), or dynamic code execution
- [ ] innerHTML not used with user content
- [ ] Error messages don't leak sensitive info
- [ ] Secrets (keys, tokens, IDs) not in code

---

## Deployment Guide

### Chrome Web Store

1. **Prepare**:
   - Update `manifest.json` version
   - Update `package.json` version
   - Create git tag: `git tag v1.2.3`
   - Build: `npm run build:chrome`

2. **Package**:
   - Zip dist folder: `zip -r dtoc-v1.2.3.zip dist/`
   - Upload to Chrome Web Store Developer Dashboard

3. **Review**:
   - Google reviews submissions (typically 1-2 days)
   - Address any rejections

4. **Publish**:
   - Release to all users
   - Post release notes on GitHub

### Firefox Add-ons

1. **Prepare**:
   - Same version updates as Chrome
   - Build: `npm run build:firefox`

2. **Package**:
   - Create .xpi file (zip with manifest.json at root)
   - Upload to Mozilla Add-ons Developer Hub

3. **Review**:
   - Mozilla reviews submissions (typically 3-5 days)
   - Address any feedback

4. **Publish**:
   - Release to all users
   - Synchronize with Chrome release timing if possible

### Post-Deployment

1. **Monitoring**: Check store reviews for bugs, feedback
2. **Communication**: Post release notes, update documentation
3. **Support**: Monitor GitHub issues for user reports
4. **Hotfix Process**: If critical bug, repeat deploy cycle for patch version

---

## Testing Requirements

### Coverage Target: >80%

- **Unit tests**: Core extraction, formatting, validation logic
- **E2E tests**: Real browser, real pages, cross-browser
- **Edge cases**: Missing selectors, malformed fields, quota limits
- **Browser coverage**: Chrome MV3 + Firefox (both MV2 and MV3 if supported)

### QA Approval Criteria

Before merging, Ivy must verify:
- [ ] All tests pass (unit + E2E)
- [ ] >80% code coverage
- [ ] Tests pass consistently (no flakiness)
- [ ] Both Chrome and Firefox tested
- [ ] Happy path AND edge cases covered
- [ ] No performance regressions

### Test Locations

- **Unit tests**: `tests/specs/*.spec.js`
- **E2E tests**: `tests/e2e/*.spec.js`
- **Config**: `playwright.config.js`
- **Run**: `npm test`

---

## Common Workflows

### Adding a New Feature

1. **Remy (Product)**: File GitHub Issue with acceptance criteria
2. **Nova/Sage (Dev)**: Create branch, implement feature, write tests
3. **Ivy (QA)**: Review tests, add additional tests, approve in PR comment
4. **Nova/Sage (Dev)**: Merge after QA approval
5. **Content (Marketing)**: Document in release notes

### Fixing a Bug

1. **Dev discovers bug** (from user report or testing)
2. **File GitHub Issue** with reproduction steps
3. **Assign to Remy (Product)** for prioritization
4. **Nova/Sage (Dev)**: Fix + test, create PR
5. **Ivy (QA)**: Test fix, approve
6. **Merge** and prepare hotfix release if critical

### Code Review Process

- **Dev posts PR**: Includes tests, description of changes
- **Ivy reviews**: Adds test-related comments, approves in GitHub review
- **Nova/Sage addresses feedback**, pushes updates
- **Ivy re-reviews** if major changes
- **Remy merges** when all satisfied

---

## Artifacts and Documentation

### Persistent Files (version controlled)

- `README.md`: User-facing project intro
- `SECURITY.md`: Security policy, disclosure process
- `docs/ARCHITECTURE.md`: System design, data flows
- `docs/DEVELOPMENT_GUIDE.md`: Local setup, workflow
- `.github/copilot-instructions.md`: AI agent code conventions
- `.github/AGENTS.md`: Agent role definitions
- `.github/agents/*.agent.md`: Individual agent workflows
- `docs/CODEBASE_MAP.md`: Code navigation guide

### Sprint Artifacts (temporary, referenced for planning)

- `docs/sprint-N/plan.md`: Sprint features, capacity, priorities
- `docs/sprint-N/progress.md`: Daily progress, blockers
- `docs/sprint-N/done.md`: Shipped features, test coverage

### Release Artifacts (version controlled)

- **Release tag**: `git tag v1.2.3` with annotated message
- **Release notes**: Shipped features, bug fixes, known issues
- **Updated docs**: API changes, new features documented

---

## Decision Log (Key Decisions)

| Decision | Rationale | Date | Owner |
|----------|-----------|------|-------|
| Vanilla JS (no framework) | Minimize extension size, no dependency risk | Jan 2024 | Remy |
| Message-passing architecture | Cross-browser compatible, async-first | Jan 2024 | Nova |
| chrome.storage.local only | No cloud sync, user privacy-first | Jan 2024 | Security Review |
| Playwright for testing | Cross-browser, no plugin needed | Jan 2024 | Ivy |
| Conventional Commits | Clear commit history, automated tooling | Jan 2024 | Remy |
| AI agents for dev | Accelerate feature velocity | Jan 2024 | Remy |

---

## Resources

- **Chrome Extension Docs**: https://developer.chrome.com/docs/extensions/
- **Firefox WebExtensions Docs**: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
- **Playwright Docs**: https://playwright.dev
- **Conventional Commits**: https://www.conventionalcommits.org
- **Web Storage Limits**: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria

---

## Contact & Governance

- **Maintainer**: Single developer (human) + Remy (Product AI agent)
- **Issues/Features**: GitHub Issues (@ai-team-product for triage)
- **Security Reports**: SECURITY.md vulnerability disclosure process
- **Discussions**: GitHub Discussions for feature requests, roadmap feedback
