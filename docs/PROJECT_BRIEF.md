# DTOC Project Brief

Single-source-of-truth document for project context, team roles, security rules, and operational procedures.

---

## Project Overview

**DTOC** (Dynamic Table of Contents) is a browser extension that extracts page headings reactively and presents them in a beautiful, floating Table of Contents overlay.

- **Supported Browsers**: Chrome (MV3) and Firefox.
- **Current State**: Single developer (human) + AI agents working in coordinated workflows.
- **Goals**:
  1. Enable AI-assisted feature development and documentation updates without quality degradation.
  2. Maintain a storage-driven, zero-latency local-only architecture.
  3. Keep DOM extraction and rendering times under 1 second.
  4. Ensure robust test coverage (Jest unit tests + Playwright cross-browser E2E tests).
  5. Provide seamless support for all natively supported websites (see [SUPPORTED_SITES.md](../SUPPORTED_SITES.md)), with experimental support (Beta) for any other site.

---

## User Personas

### Primary: Confluence / Wiki Reader
- **Need**: Easily navigate long-form documentation pages.
- **Pain Point**: Constant scrolling back and forth on large wiki articles.
- **Solution**: A floating TOC sidebar that updates as headings appear and allows smooth jumping with appropriate header offsets.

### Secondary: Developer / Blogger (Dev.to / Medium)
- **Need**: Fast navigation through technical blogs, tutorials, and document reviews.
- **Pain Point**: Lack of consistent, built-in site tables of contents.
- **Solution**: Auto-generated TOC that respects writing boundaries and disables itself when typing/editing drafts.

---

## Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend UI** | Vanilla HTML, CSS, JavaScript | No framework overhead; maintains small bundle size (<50KB) |
| **Extension API** | Chrome & Firefox WebExtensions APIs | Direct integration with browser storage and page contexts |
| **State Sync** | `chrome.storage.local` / `browser.storage.local` | Asynchronous, isolated, storage-driven state sync (no service worker) |
| **Packaging** | `web-ext` CLI + standard ZIP shell scripts | Clean, dependency-free packaging for Chrome and Firefox stores |
| **Testing** | Jest (Unit) & Playwright (E2E) | Fast unit logic verification + real-browser cross-browser E2E automation |

---

## Team Roles

AI agents are organized by discipline with clear boundaries. Any AI tool (such as Google Antigravity, Jules, Kiro, Claude, Gemini, or Copilot) can adopt these roles by using the corresponding agent instruction files.

| Role | Agent Persona | Owns | Inputs | Outputs | Constraints |
|------|---------------|------|--------|---------|-------------|
| **Product Manager** | Remy | Issue specifications, sprint goals, prioritization | User feedback, roadmap | GitHub Issues, `task.md` specs | Cannot write implementation code |
| **Dev Engineer** | Nova / Sage | Feature implementation, bug fixes, unit tests | GitHub Issues, specs | Source code changes, unit tests | Cannot approve own PRs; must pass QA review |
| **QA Engineer** | Ivy | Quality gates, E2E tests, browser validation | Dev PRs, code changes | E2E tests, approval reviews | Cannot write feature code; cannot approve own work |
| **Marketing / Content** | Content | Documentation, release notes, changelogs | Merged PRs, features | `README.md` updates, release notes | Cannot modify source files |

### Agentic Handoff Workflow

```
[Product Manager Agent] 
    │ (Defines feature/bug spec in GitHub Issue or task list)
    ▼
[Dev Engineer Agent]
    │ (Implements changes, writes Jest unit tests, creates PR/commit)
    ▼
[QA Engineer Agent]
    │ (Reviews changes, runs Jest + Playwright E2E tests, writes manual checklist)
    ▼
[Product Manager Agent]
    │ (Merges code after QA approval)
    ▼
[Marketing/Content Agent]
    │ (Updates README.md and creates RELEASE_NOTES_vX.Y.Z.md)
```

---

## Security Rules

All development (human or AI) must conform to these strict security policies:

1. **Zero External Communication**:
   - The extension must NEVER make network calls (no tracking, telemetry, external API integrations, or analytics).
   - All processing (parsing headings, saving settings, generating files) must be local-only.
2. **Anti-Patterns Enforced**:
   - **No eval() or Function()**: Dynamic code execution is strictly banned.
   - **No innerHTML on User Input**: Text content from host pages (page titles, heading labels) must be set using `.textContent` or sanitized completely to prevent XSS.
   - **Safe DOM Queries**: Wrap queries in try/catch or validate CSS selectors before querying to avoid CSS injection crashes.
3. **Storage Security**:
   - Use `chrome.storage.local` or `browser.storage.local` exclusively.
   - Keep settings scopes minimal.

---

## Testing Requirements

We maintain a strict **>80% test coverage gate** for core extension logic.

- **Unit Tests**:
  - Located in `tests/unit/test.js`
  - Focus: Logic-only tests (view mode detection, inheritance resolution, heading ID slugification).
  - Executed via: `npm run test` (Jest)
- **E2E Tests**:
  - Located in `tests/e2e.spec.js`
  - Focus: Real-browser MV3 extension loading, Shadow DOM injection, position updates, and storage persistence.
  - Executed via: `npm run test:e2e` (Playwright)
- **Quality Gates**:
  - All tests must pass before code is merged.
  - Manual verification must be performed in both Chrome and Firefox.

---

## Release Process

For every release, the following steps must be followed:
1. **Verify**: Ensure Jest and Playwright tests pass (`npm run test` and `npm run test:e2e`).
2. **Version Bump**: Bump version in `package.json` and manifests.
3. **Build**:
   - Run `npm run build` to build and package both extensions.
   - Outputs: `chrome-extension/web-ext-artifacts/dtoc-chrome-vX.Y.Z.zip` and `firefox-extension/web-ext-artifacts/dtoc-firefox-vX.Y.Z.zip`.
4. **Tag**: Create and push git tag (`git tag vX.Y.Z` && `git push origin vX.Y.Z`).
5. **Publish**: Upload files to Chrome Web Store Developer Console and Mozilla Add-ons Developer Hub.
6. **Announce**: Update `README.md` and create `docs/RELEASE_NOTES_vX.Y.Z.md`.
