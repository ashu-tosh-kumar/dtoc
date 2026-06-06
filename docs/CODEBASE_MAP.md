# DTOC Codebase Map

Quick navigation guide and file reference for developers and AI agents.

---

## Directory Structure

```
dtoc/
├── chrome-extension/           # Chrome MV3 extension source
│   ├── manifest.json          # Extension configuration
│   ├── background.js          # Service worker (persistent context)
│   ├── content.js             # Content script (runs on web pages)
│   ├── popup.html/js/css      # Popup UI (template list)
│   ├── options.html/js/css    # Options page (template editor)
│   ├── lib/
│   │   ├── templateValidator.js
│   │   ├── extractorEngine.js
│   │   ├── messageHandler.js
│   │   └── storageManager.js
│   └── assets/
│       ├── icons/
│       └── fonts/
│
├── firefox-extension/         # Firefox specific config (minimal, reuses chrome-extension)
│   ├── manifest.json          # Firefox-specific manifest.json
│   └── (reuses chrome-extension sources via build)
│
├── tests/
│   ├── specs/                 # Unit tests
│   │   ├── templateValidator.spec.js
│   │   ├── extractorEngine.spec.js
│   │   └── messageHandler.spec.js
│   ├── e2e/                   # End-to-end tests
│   │   ├── extraction.spec.js
│   │   └── template-management.spec.js
│   └── fixtures/              # Test data
│       ├── sample-pages.html
│       └── test-templates.json
│
├── docs/
│   ├── ARCHITECTURE.md        # System design and data flows
│   ├── DEVELOPMENT_GUIDE.md   # Local setup and workflow
│   ├── PROJECT_BRIEF.md       # Team handbook (this folder)
│   ├── CODEBASE_MAP.md        # This file
│   └── sprint-N/              # Sprint artifacts
│       ├── plan.md
│       ├── progress.md
│       └── done.md
│
├── .github/
│   ├── copilot-instructions.md  # AI agent code conventions
│   ├── AGENTS.md               # Team role definitions
│   └── agents/
│       ├── dev-engineer.agent.md
│       ├── qa-engineer.agent.md
│       ├── product-manager.agent.md
│       └── marketing.agent.md
│
├── package.json               # Dependencies and build scripts
├── playwright.config.js       # Test configuration
├── README.md                  # User-facing intro
├── SECURITY.md                # Security policy
└── LICENSE

```

---

## Key Files Quick Reference

### Configuration

| File | Purpose | Owner | Update Frequency |
|------|---------|-------|------------------|
| `chrome-extension/manifest.json` | Chrome MV3 extension config | Nova (Dev) | Per version bump |
| `firefox-extension/manifest.json` | Firefox config | Nova (Dev) | Per version bump |
| `package.json` | Dependencies, scripts | Nova (Dev) | As needed |
| `playwright.config.js` | Test configuration | Ivy (QA) | Per testing changes |

### Extension Core

| File | Purpose | Entrypoint | Loads |
|------|---------|-----------|-------|
| `chrome-extension/background.js` | Service worker, template management, message routing | Service Worker | content.js, popup.js |
| `chrome-extension/content.js` | Runs on pages, DOM interaction, data extraction | Page context | background.js via messaging |
| `chrome-extension/popup.html/js/css` | Popup UI (quick access) | User clicks extension icon | background.js via messaging |
| `chrome-extension/options.html/js/css` | Settings, template editor | chrome-extension://xxxx/options.html | background.js via messaging |

### Business Logic

| File | Purpose | Key Exports |
|------|---------|-------------|
| `chrome-extension/lib/templateValidator.js` | Template schema validation | `validateTemplate(t)`, `validateField(f)` |
| `chrome-extension/lib/extractorEngine.js` | Core extraction logic (DOM querying, data formatting) | `extractData(template)`, `formatOutput(data, format)` |
| `chrome-extension/lib/messageHandler.js` | Message protocol implementation | `registerHandlers()`, message type handlers |
| `chrome-extension/lib/storageManager.js` | chrome.storage wrapper, error handling | `getConfig()`, `saveTemplate(t)`, `deleteTemplate(id)` |

### Testing

| File | Purpose | Coverage |
|------|---------|----------|
| `tests/specs/*.spec.js` | Unit tests (validation, extraction, formatting) | Core business logic |
| `tests/e2e/*.spec.js` | E2E tests (real browser, real pages) | User workflows |
| `playwright.config.js` | Playwright configuration (Chrome + Firefox) | Browser setup, timeouts |

### Documentation

| File | Audience | Scope |
|------|----------|-------|
| `README.md` | Users (GitHub) | Feature intro, installation, usage |
| `SECURITY.md` | Security researchers | Vulnerability disclosure process |
| `docs/ARCHITECTURE.md` | Developers + AI agents | System design, protocols, data flows |
| `docs/DEVELOPMENT_GUIDE.md` | Developers | Local setup, build/test/deploy workflow |
| `.github/copilot-instructions.md` | AI Dev agents | Code conventions, anti-patterns |
| `.github/AGENTS.md` | Everyone | Team roles, handoff protocols |

---

## Common Tasks

### "I need to understand how data extraction works"

1. Read: `docs/ARCHITECTURE.md` → "Data Flow" section
2. Read: `chrome-extension/lib/extractorEngine.js` → `extractData()` function
3. Read: `tests/specs/extractorEngine.spec.js` → test cases show usage
4. Search: Look for where `extractFromDOM()` is called (in `content.js`)

### "I need to add a new storage field"

1. Read: `docs/ARCHITECTURE.md` → "Storage Schema" section
2. Edit: `chrome-extension/lib/storageManager.js` → add getter/setter
3. Read: `.github/copilot-instructions.md` → "Async/Storage Pattern"
4. Add test: `tests/specs/storageManager.spec.js`
5. Test: `npm test`

### "I need to implement a new message type"

1. Read: `.github/copilot-instructions.md` → "Message Protocol" section
2. Read: `docs/ARCHITECTURE.md` → "Message Protocol" table
3. Add handler: `chrome-extension/lib/messageHandler.js`
4. Add to manifest.json permissions if needed
5. Add test: `tests/specs/messageHandler.spec.js`
6. Test both sender and receiver

### "I need to fix a bug in template extraction"

1. File issue: Include reproduction steps, expected vs actual
2. Add test: Write failing test case in `tests/specs/extractorEngine.spec.js`
3. Fix: Update `chrome-extension/lib/extractorEngine.js`
4. Verify: Run `npm test`, ensure all pass
5. Submit PR: Include test + fix + description

### "I need to test in Firefox"

1. Read: `.github/copilot-instructions.md` → "Cross-Browser Support"
2. Read: `docs/DEVELOPMENT_GUIDE.md` → "Testing in Firefox"
3. Load extension: `about:debugging` in Firefox
4. Run E2E tests: `npm test` (Playwright tests both browsers)

### "I need to update documentation"

1. Identify file: Use this map to find relevant doc
2. Edit: Use `edit` tool or local editor
3. Commit: Use `git commit -m "docs: update <section>"`
4. Push: Include in PR with related code changes

---

## Build & Run Commands

### Development Setup

```bash
# Install dependencies
npm install

# Build extension
npm run build

# Run tests
npm test

# Run tests in watch mode (for development)
npm test -- --watch

# Run tests for specific browser
npm test -- --project=chromium
npm test -- --project=firefox

# Local development (load unpacked extension)
npm run dev
```

### Deployment

```bash
# Bump version (updates manifest.json + package.json)
npm version minor

# Build for distribution
npm run build:chrome   # Chrome Web Store
npm run build:firefox  # Firefox Add-ons

# Create release tag
git tag v1.2.3
git push origin v1.2.3
```

---

## Branch Naming Convention

- Feature: `feature/short-description` (e.g., `feature/template-preview`)
- Bug fix: `fix/short-description` (e.g., `fix/storage-quota-error`)
- Refactor: `refactor/short-description` (e.g., `refactor/message-handling`)
- Spike: `spike/short-description` (e.g., `spike/firefox-compatibility`)
- Docs: `docs/short-description` (e.g., `docs/architecture-update`)

---

## Testing Matrix

| Browser | Environment | Config | Run |
|---------|-------------|--------|-----|
| Chrome | Local dev | chromium | `npm test -- --project=chromium` |
| Firefox | Local dev | firefox | `npm test -- --project=firefox` |
| Both | CI/CD | chromium + firefox | `npm test` |

### Coverage Requirements

- **Overall**: >80%
- **Core logic** (extractorEngine, templateValidator): >90%
- **UI code**: >50% (acceptable lower for UI)
- **New code**: 100% (all new features must have tests)

---

## How AI Agents Navigate This Codebase

### Nova/Sage (Dev Engineers)

1. Start with `.github/copilot-instructions.md` to understand conventions
2. Reference `docs/ARCHITECTURE.md` for system context
3. Find specific file in this map, read source code
4. Run `npm test` to understand current state
5. Write failing test first (TDD)
6. Implement fix/feature
7. Verify tests pass: `npm test`
8. Submit PR with tests + description

### Ivy (QA Engineer)

1. Read `docs/ARCHITECTURE.md` for system overview
2. Review PR code and tests
3. Add additional test cases as needed
4. Run full test suite: `npm test`
5. Test manually in both Chrome and Firefox
6. Verify >80% coverage maintained
7. Approve or request changes

### Remy (Product Manager)

1. File GitHub Issue with feature spec
2. Reference `docs/PROJECT_BRIEF.md` for team roles
3. Wait for Dev implementation and QA approval
4. Merge PR when ready
5. Coordinate with Content on release notes

### Content (Marketing)

1. After merge, review shipped features
2. Update `README.md` if user-facing changes
3. Create release notes based on merged PRs
4. Update `docs/` if architecture/setup changed

---

## Performance Benchmarks

- **Extraction latency**: <1 second for typical pages
- **Template validation**: <100ms
- **Storage operations**: <500ms (async)
- **Message round-trip**: <100ms

Monitor these metrics in E2E tests.

---

## Known Limitations

- Chrome quota: ~100MB per user
- Firefox quota: 10MB-unlimited (varies by config)
- Max selectors per template: ~100 (performance)
- Template size: ~10KB per template typical
- Storage roundtrips: Use batching to minimize

---

## Related Documentation

- **For detailed architecture**: See `docs/ARCHITECTURE.md`
- **For development workflow**: See `docs/DEVELOPMENT_GUIDE.md`
- **For code conventions**: See `.github/copilot-instructions.md`
- **For team structure**: See `.github/AGENTS.md`
