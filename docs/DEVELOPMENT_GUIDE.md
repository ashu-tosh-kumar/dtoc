# DTOC Development Guide

Complete workflow for local development, testing, and deployment.

---

## Prerequisites

- **Node.js**: v16+ (check with `node --version`)
- **npm**: v7+ (check with `npm --version`)
- **Git**: Latest stable (check with `git --version`)
- **Chrome or Firefox**: Latest stable for testing
- **Text Editor/IDE**: VS Code recommended

### Setup Verification

```bash
node --version     # Should be v16+
npm --version      # Should be v7+
git --version      # Any recent version
which chrome       # (on macOS) should find Chrome
which firefox      # should find Firefox
```

---

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/ashu-tosh-kumar/dtoc.git
cd dtoc
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `playwright`: Browser automation for testing
- `webpack`: Module bundler for extension packaging
- Development tools (linters, test runners)

### 3. Verify Installation

```bash
npm test --help    # Should show Playwright options
npm run build --help  # Should show build options
```

---

## Development Workflow

### Step 1: Create Feature Branch

```bash
git checkout -b feature/my-feature

# or for bug fix
git checkout -b fix/my-bug

# or for spike/research
git checkout -b spike/my-investigation
```

Branch naming: `<type>/<kebab-case-description>`

### Step 2: Write Failing Test (TDD)

Create a test file (or add to existing) in `tests/specs/`:

```bash
# tests/specs/myFeature.spec.js
import { test, expect } from '@playwright/test';

test('should do what the feature requires', async ({ page }) => {
  // Arrange: set up test data
  const template = createTestTemplate();

  // Act: perform the action
  const result = await myFunction(template);

  // Assert: verify behavior
  expect(result).toEqual(expectedValue);
});
```

### Step 3: Run Tests (Verify Failure)

```bash
npm test

# or run specific test file
npm test tests/specs/myFeature.spec.js

# or run in watch mode (reruns on file change)
npm test -- --watch
```

Tests should FAIL at this point (TDD red phase).

### Step 4: Implement Feature

Edit source files in `chrome-extension/lib/`:

```javascript
// chrome-extension/lib/myFeature.js
export async function myFunction(template) {
  // Implementation here
  // Follow .github/copilot-instructions.md conventions
  // Handle errors with try/catch
  // Use async/await for async operations
}
```

### Step 5: Run Tests (Verify Pass)

```bash
npm test

# Should now PASS (TDD green phase)
# Verify coverage: should be >80% for new code
```

### Step 6: Refactor if Needed (TDD)

```bash
# Code review and improve
# Re-run tests to ensure still passing
npm test
```

### Step 7: Test in Both Browsers

```bash
# Test in Chrome
npm test -- --project=chromium

# Test in Firefox
npm test -- --project=firefox

# Or run all in one command
npm test
```

### Step 8: Manual Testing (Optional)

Load extension locally to test manually:

**Chrome**:
1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `chrome-extension/` folder
5. Test manually on web pages

**Firefox**:
1. Open `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select `firefox-extension/manifest.json`
5. Test manually on web pages

### Step 9: Commit Changes

Follow Conventional Commits format:

```bash
# Stage changes
git add -A

# Commit with message
git commit -m "feat(extraction): add support for transform functions"

# Format: feat|fix|refactor|test|docs|chore(<scope>): <message>
```

### Step 10: Create Pull Request

```bash
git push origin feature/my-feature
```

Then create PR on GitHub with:
- Title: Clear, concise description
- Description: What changed and why
- References: Closes #123 (if fixing an issue)
- Checklist: Tests pass, >80% coverage, both browsers tested

### Step 11: QA Review

Ivy (QA) will:
- Review code and tests
- Add additional test cases if needed
- Approve or request changes

### Step 12: Merge and Deploy

After approval:
- Merge PR (via GitHub UI)
- Delete feature branch
- Prepare release (if shipping)

---

## Common Tasks

### Running Tests

```bash
# Run all tests
npm test

# Run specific file
npm test tests/specs/extractorEngine.spec.js

# Run with coverage report
npm test -- --coverage

# Run only failing tests (useful for TDD)
npm test -- --grep "my test name"

# Run in watch mode (reruns on change)
npm test -- --watch

# Run specific browser
npm test -- --project=chromium
npm test -- --project=firefox
```

### Building Extension

```bash
# Build for development
npm run build

# Build for Chrome Web Store
npm run build:chrome

# Build for Firefox Add-ons
npm run build:firefox

# Output: dist/ folder contains packaged extension
```

### Loading Extension in Browser

**Chrome** (for manual testing):
```bash
# 1. Open chrome://extensions
# 2. Toggle "Developer mode" in top-right
# 3. Click "Load unpacked"
# 4. Browse to dist/ folder (after npm run build)
# 5. Extension now loaded, test on web pages
# 6. Make code change, run npm run build again
# 7. Refresh extension in chrome://extensions (↻ icon)
```

**Firefox** (for manual testing):
```bash
# 1. Open about:debugging
# 2. Click "This Firefox" tab
# 3. Click "Load Temporary Add-on"
# 4. Navigate to dist/ folder
# 5. Select manifest.json file
# 6. Extension now loaded, test on web pages
```

### Debugging

**In Chrome DevTools**:
1. Open DevTools (F12 or Cmd+Option+I)
2. Go to "Extensions" panel
3. Click extension name → "service worker"
4. Inspect, set breakpoints, view console

**In Firefox Developer Edition**:
1. Open Developer Tools (F12 or Cmd+Option+I)
2. Go to "Console" tab
3. Check for errors/logs
4. Use Firefox Debugger for breakpoints

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update specific package
npm install package@^1.2.3

# Update all packages (be cautious!)
npm update

# Verify tests still pass
npm test
```

### Version Bumping

```bash
# Bump patch version (1.2.3 → 1.2.4)
npm version patch

# Bump minor version (1.2.3 → 1.3.0)
npm version minor

# Bump major version (1.2.3 → 2.0.0)
npm version major

# This updates manifest.json, package.json, and creates git tag
# Don't forget to push: git push origin main && git push origin v1.2.4
```

---

## Troubleshooting

### Tests Failing

```bash
# 1. Verify dependencies installed
npm install

# 2. Check for syntax errors
npm run lint (if linter available)

# 3. Run tests in verbose mode
npm test -- --verbose

# 4. Check that Node.js version is correct
node --version  # Should be v16+

# 5. Clear test cache
rm -rf .playwright-cache
npm test
```

### Browser Not Found

```bash
# Firefox not installed:
npm install --save-dev @playwright/test
npx playwright install firefox

# Chrome not installed:
# Download from https://www.google.com/chrome/
# Or: npx playwright install chromium

# Both:
npx playwright install
```

### Extension Not Loading

**Chrome**:
- [ ] Did you run `npm run build`?
- [ ] Are you loading from `dist/` folder?
- [ ] Is "Developer mode" enabled?
- [ ] Try clicking refresh (↻) on extension

**Firefox**:
- [ ] Did you run `npm run build`?
- [ ] Is `manifest.json` in dist/ folder?
- [ ] Try unloading and reloading add-on
- [ ] Check browser console for errors (F12)

### Storage Errors

```javascript
// ❌ If you see "chrome.storage is undefined":
// Cause: Not running in extension context
// Fix: Load extension in browser, don't just open HTML file

// ❌ If you see "QuotaExceededError":
// Cause: Storage limit exceeded
// Fix: Delete unused templates, compress data

// ✓ Check current storage usage:
// In DevTools console:
chrome.storage.local.get(null, (items) => {
  const bytes = JSON.stringify(items).length;
  console.log(`Storage used: ${(bytes / 1024 / 1024).toFixed(2)} MB`);
});
```

### Permission Errors

If tests fail with permission errors:
```bash
# Check manifest.json permissions
# Ensure manifest.json includes required permissions:
# - "storage"
# - "scripting" (Chrome MV3)
# - "activeTab" (Firefox)
# - "content_scripts" (both)

# Rebuild and test
npm run build
npm test
```

### Flaky Tests

Tests that pass sometimes and fail sometimes:
```bash
# 1. Check for timing issues (use await)
test('should work', async ({ page }) => {
  await page.goto(url); // Don't forget await!
  await page.waitForSelector('.element');
});

# 2. Increase timeout for slow machines
npm test -- --timeout=60000  # 60 seconds

# 3. Run test multiple times to check consistency
npm test tests/specs/flaky.spec.js
npm test tests/specs/flaky.spec.js
npm test tests/specs/flaky.spec.js
```

---

## Release Process

### 1. Prepare

```bash
# Ensure all tests pass
npm test

# Update version
npm version minor   # or patch / major

# Build for distribution
npm run build:chrome
npm run build:firefox
```

### 2. Chrome Web Store

```bash
# 1. Visit: https://chrome.google.com/webstore/devconsole
# 2. Upload updated .zip file from dist/chrome/
# 3. Update store listing if needed
# 4. Submit for review (typically 1-2 days)
# 5. Publish after approval
```

### 3. Firefox Add-ons

```bash
# 1. Visit: https://addons.mozilla.org/developers/
# 2. Upload updated .xpi file from dist/firefox/
# 3. Update store listing if needed
# 4. Submit for review (typically 3-5 days)
# 5. Publish after approval
```

### 4. GitHub Release

```bash
# Create git tag
git tag v1.2.3 -m "Release version 1.2.3"

# Push tag
git push origin v1.2.3

# Create release on GitHub
# - Copy release notes
# - Attach distribution files (optional)
```

### 5. Release Notes

Content team creates `RELEASE_NOTES.md`:
- New features
- Bug fixes
- Known issues
- Breaking changes (if any)

---

## Checklist: Before Every PR

- [ ] Feature branch created: `git checkout -b ...`
- [ ] Tests written (TDD): `tests/specs/...`
- [ ] Tests passing: `npm test` (both browsers)
- [ ] Code follows conventions: `.github/copilot-instructions.md`
- [ ] >80% coverage maintained: `npm test -- --coverage`
- [ ] Manual testing done: Loaded in Chrome + Firefox
- [ ] Commit message follows format: `feat(scope): message`
- [ ] Ready for QA review: No known issues

---

## Checklist: Before Release

- [ ] All tests passing: `npm test`
- [ ] Coverage >80%: `npm test -- --coverage`
- [ ] Version bumped: `npm version minor`
- [ ] Built for distribution: `npm run build:chrome && npm run build:firefox`
- [ ] Release notes written: `RELEASE_NOTES.md`
- [ ] Git tag created: `git tag v1.2.3`
- [ ] Uploaded to stores: Chrome + Firefox
- [ ] Submitted for review
- [ ] GitHub release created

---

## Quick Reference

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Run tests | `npm test` |
| Build extension | `npm run build` |
| Format code | `npm run format` (if available) |
| Check lint | `npm run lint` (if available) |
| Bump version | `npm version patch\|minor\|major` |
| Create branch | `git checkout -b feature/name` |
| Commit | `git commit -m "feat(scope): message"` |
| Push branch | `git push origin feature/name` |
| View commits | `git log --oneline` |

---

## Resources

- **Node.js Docs**: https://nodejs.org/docs/
- **npm Docs**: https://docs.npmjs.com/
- **Playwright Docs**: https://playwright.dev/docs/intro
- **Chrome Extensions**: https://developer.chrome.com/docs/extensions/
- **Firefox WebExtensions**: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
- **Git Guide**: https://git-scm.com/doc
- **Conventional Commits**: https://www.conventionalcommits.org/

---

## Getting Help

1. **For API questions**: Refer to `docs/ARCHITECTURE.md`
2. **For code conventions**: Refer to `.github/copilot-instructions.md`
3. **For file navigation**: Refer to `docs/CODEBASE_MAP.md`
4. **For GitHub workflow**: Refer to `.github/AGENTS.md`
5. **For system design**: Refer to `docs/ARCHITECTURE.md`
