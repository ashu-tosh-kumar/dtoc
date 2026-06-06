# DTOC Codebase Map

Quick navigation guide and file reference for developers and AI agents.

---

## Directory Structure

```
dtoc/
├── chrome-extension/           # Chrome MV3 Extension
│   ├── manifest.json           # Chrome MV3 metadata & permissions
│   ├── content.js              # Main content script (DOM parsing, UI overlay injection)
│   ├── content.css             # CSS injected inside Shadow DOM
│   ├── popup.html              # Popup UI layout
│   ├── popup.js                # Popup settings page controller
│   ├── popup.css               # Popup styling
│   └── icons/                  # Extension icons (16, 48, 128)
│
├── firefox-extension/          # Firefox MV3 Extension (standalone build)
│   ├── manifest.json           # Firefox-specific MV3 metadata
│   ├── content.js              # Main content script (uses browser.* namespace)
│   ├── content.css             # CSS injected inside Shadow DOM
│   ├── popup.html              # Popup UI layout
│   ├── popup.js                # Popup controller (uses browser.* namespace)
│   ├── popup.css               # Popup styling
│   └── icons/                  # Extension icons
│
├── tests/                      # Testing Framework
│   ├── e2e.spec.js             # Playwright E2E tests (real extension loads in Chrome/Firefox)
│   ├── global-setup.js         # Playwright E2E test setup
│   └── unit/
│       └── test.js             # Jest unit tests (pure logic validation, mocks DOM/storage)
│
├── docs/                       # Technical Documentation
│   ├── ARCHITECTURE.md         # System design, state flows, logic detail
│   ├── PROJECT_BRIEF.md        # Team handbook, stacks, security rules
│   ├── DEVELOPMENT_GUIDE.md    # Local setup, build, and deploy guide
│   └── CODEBASE_MAP.md         # This file
│
├── .github/                    # AI Agent and GitHub configuration
│   ├── copilot-instructions.md # Generic AI instruction file
│   ├── AGENTS.md               # AI roles and handoff protocols
│   └── agents/                 # Agent persona system prompts
│       ├── dev-engineer.agent.md
│       ├── qa-engineer.agent.md
│       ├── product-manager.agent.md
│       └── marketing.agent.md
│
├── .cursorrules                # Cursor/Windsurf system rules (copied from copilot-instructions)
├── package.json                # npm script definitions & dependency versions
├── package-lock.json           # Node lockfile
├── playwright.config.js        # Playwright runner configuration
├── README.md                   # User-facing project guide
├── SECURITY.md                 # Vulnerability disclosures
└── LICENSE                     # Open source license
```

---

## Key Files Reference

### Configuration & Tooling

| File | Purpose | Primary Editor |
|------|---------|----------------|
| [chrome-extension/manifest.json](file:///Users/ashutosh/projects/My/dtoc/chrome-extension/manifest.json) | Chrome extension configuration and permissions | Dev |
| [firefox-extension/manifest.json](file:///Users/ashutosh/projects/My/dtoc/firefox-extension/manifest.json) | Firefox extension configuration and permissions | Dev |
| [package.json](file:///Users/ashutosh/projects/My/dtoc/package.json) | Script shortcuts, test runner config, dependencies | Dev |
| [playwright.config.js](file:///Users/ashutosh/projects/My/dtoc/playwright.config.js) | E2E cross-browser browser profiles and settings | QA |

### Execution Logic

| File | Context | Responsibility |
|------|---------|----------------|
| [chrome-extension/content.js](file:///Users/ashutosh/projects/My/dtoc/chrome-extension/content.js) | Page Context (Chrome) | Performs heading parsing, DOM tracking, view mode checks, and UI overlay injection. |
| [chrome-extension/popup.js](file:///Users/ashutosh/projects/My/dtoc/chrome-extension/popup.js) | Popup Context (Chrome) | Updates global positions, toggles enabled status, manages siteSettings overrides in local storage. |
| [firefox-extension/content.js](file:///Users/ashutosh/projects/My/dtoc/firefox-extension/content.js) | Page Context (Firefox) | Same logic as Chrome but targets Firefox APIs (`browser.storage.local`). |
| [firefox-extension/popup.js](file:///Users/ashutosh/projects/My/dtoc/firefox-extension/popup.js) | Popup Context (Firefox) | Same logic as Chrome but targets Firefox APIs (`browser.storage.local`). |

### Testing Specs

| File | Scope | Framework |
|------|-------|-----------|
| [tests/unit/test.js](file:///Users/ashutosh/projects/My/dtoc/tests/unit/test.js) | Unit logic (view mode checks, normalizations, inheritance resolves) | Jest + JSDOM |
| [tests/e2e.spec.js](file:///Users/ashutosh/projects/My/dtoc/tests/e2e.spec.js) | End-to-end user journeys (UI injects, settings toggle, position updates) | Playwright |

---

## Common AI Navigation Tasks

### "I need to understand how TOC generation works"
1. Read: [docs/ARCHITECTURE.md](file:///Users/ashutosh/projects/My/dtoc/docs/ARCHITECTURE.md) -> "Content Parsing and Normalization" section.
2. Read: [chrome-extension/content.js](file:///Users/ashutosh/projects/My/dtoc/chrome-extension/content.js) -> `parseHeadingsAndRender()` function.
3. Read: [tests/unit/test.js](file:///Users/ashutosh/projects/My/dtoc/tests/unit/test.js) -> "heading normalization logic" tests.

### "I need to add a new site override / setting"
1. Read: [docs/ARCHITECTURE.md](file:///Users/ashutosh/projects/My/dtoc/docs/ARCHITECTURE.md) -> "Data Structures & Storage Schema" section.
2. Edit: [chrome-extension/popup.js](file:///Users/ashutosh/projects/My/dtoc/chrome-extension/popup.js) & [chrome-extension/content.js](file:///Users/ashutosh/projects/My/dtoc/chrome-extension/content.js) to retrieve/modify storage.
3. Edit: `firefox-extension/` counterparts.
4. Add unit test: [tests/unit/test.js](file:///Users/ashutosh/projects/My/dtoc/tests/unit/test.js) under "settings inheritance resolution logic".

### "I need to debug test failures"
1. Run Jest tests: `npm run test`.
2. Run Playwright E2E tests: `npm run test:e2e`.
3. Check the config overrides in [playwright.config.js](file:///Users/ashutosh/projects/My/dtoc/playwright.config.js) and [tests/global-setup.js](file:///Users/ashutosh/projects/My/dtoc/tests/global-setup.js).
