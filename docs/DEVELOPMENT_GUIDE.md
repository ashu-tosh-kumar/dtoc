# DTOC Development Guide

Complete workflow for local setup, development, testing, and deployment.

---

## Prerequisites

- **Node.js**: v16+ (check with `node --version`)
- **npm**: v7+ (check with `npm --version`)
- **Chrome or Firefox**: Latest stable versions for manual/automated testing.

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
This installs Jest (unit test runner), Playwright (E2E browser testing), and `web-ext` (Firefox build utility).

### 3. Verify Installation
```bash
npm run test -- --help     # Jest options
npm run test:e2e -- --help # Playwright options
```

---

## Development Workflow

### Step 1: Create Feature Branch
```bash
git checkout -b feature/my-feature
# or for bug fix
git checkout -b fix/my-bug
```
Branch naming convention: `<type>/<kebab-case-description>` (types: `feature`, `fix`, `refactor`, `docs`, `spike`).

### Step 2: Write Failing Tests (TDD)
- **For logic changes**: Open [tests/unit/test.js](file:///Users/ashutosh/projects/My/dtoc/tests/unit/test.js) and add a test case under the relevant block.
- **For integration/UI changes**: Open [tests/e2e.spec.js](file:///Users/ashutosh/projects/My/dtoc/tests/e2e.spec.js) and append a Playwright test.

### Step 3: Run Tests (Verify Failure)
```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e
```
Verify that your newly added tests fail (TDD red phase).

### Step 4: Implement Logic
Modify the extension source code:
- [chrome-extension/content.js](file:///Users/ashutosh/projects/My/dtoc/chrome-extension/content.js)
- [chrome-extension/popup.js](file:///Users/ashutosh/projects/My/dtoc/chrome-extension/popup.js)
- Reflect identical changes in [firefox-extension/content.js](file:///Users/ashutosh/projects/My/dtoc/firefox-extension/content.js) and [firefox-extension/popup.js](file:///Users/ashutosh/projects/My/dtoc/firefox-extension/popup.js) (or copy the logic code as needed).

> [!IMPORTANT]
> Keep code clean, avoid dynamic code execution (`eval`), and use `.textContent` to safely inject page content to prevent XSS.

### Step 5: Verify Tests (Green Phase)
Run the test suites again to confirm they pass:
```bash
npm run test
npm run test:e2e
```

---

## Manual Testing in Browsers

### Google Chrome
1. Open Google Chrome and navigate to `chrome://extensions`.
2. Toggle **Developer mode** in the top-right corner.
3. Click **Load unpacked** in the top-left.
4. Select the [chrome-extension](file:///Users/ashutosh/projects/My/dtoc/chrome-extension) folder.
5. Open any Confluence, Dev.to, or Medium article to test the floating TOC.
6. When you modify files under `chrome-extension/`, reload the extension by clicking the refresh (↻) icon in `chrome://extensions`.

### Mozilla Firefox
1. Open Firefox and navigate to `about:debugging`.
2. Click **This Firefox** in the sidebar.
3. Click **Load Temporary Add-on...**
4. Navigate to the [firefox-extension](file:///Users/ashutosh/projects/My/dtoc/firefox-extension) folder and select [manifest.json](file:///Users/ashutosh/projects/My/dtoc/firefox-extension/manifest.json).
5. Open any supported site to test.
6. When you modify files under `firefox-extension/`, click **Reload** in `about:debugging`.

---

## Commit & PR Checklist

- Commit messages must follow **Conventional Commits**:
  - `feat(ui): add Beta badge for experimental support`
  - `fix(view): resolve Medium new-story edit mode bypass`
- Before creating a PR, check:
  - [ ] All Jest unit tests pass (`npm run test`).
  - [ ] All Playwright E2E tests pass (`npm run test:e2e`).
  - [ ] Code conventions followed (no `eval`, safe storage queries, `textContent` used).
  - [ ] PR mentions the GitHub issue number (e.g. `Closes #42`).

---

## Release Process

When preparing a release:
1. Verify all tests pass.
2. Bump version in `package.json` and both `chrome-extension/manifest.json` and `firefox-extension/manifest.json` (e.g. `npm version patch|minor|major`).
3. Build distribution packages:
   ```bash
   npm run build
   ```
   This creates:
   - Chrome ZIP: `chrome-extension/web-ext-artifacts/dtoc-chrome-v<version>.zip`
   - Firefox ZIP: `firefox-extension/web-ext-artifacts/dtoc-firefox-v<version>.zip`
4. Update documentation to reflect changes introduced in this release:
   - **`CHANGELOG.md`**: Add a `## [vX.Y.Z] - YYYY-MM-DD` section summarising all changes.
   - **`SUPPORTED_SITES.md`**: Add or update entries for any newly supported sites.
   - **`docs/ARCHITECTURE.md`**: Update "View Mode Detection", "Main Content Container Target", and "Heading Normalization" if parsing logic changed for any site; update "Security Model" if new security helpers were introduced.
   - **`docs/CODEBASE_MAP.md`**: Reflect any new files, renamed files, or structural changes in the directory tree.
   - **`README.md`**: Update the Features list if user-facing behaviour changed.
   - **`docs/RELEASE_NOTES_v<version>.md`**: Create a new release notes file summarising what was shipped (see existing CHANGELOG entries for style).
5. Create release tag and push it:
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
6. Submit files to Chrome Developer Dashboard and Mozilla Add-ons Hub.
