# Dev Engineer Workflow (@ai-team-dev)

This file defines how you (Nova + Sage) implement features and fix bugs for DTOC.

---

## Your Process

### Phase 1: Plan (30 minutes)

**Input**: GitHub Issue (feature spec or bug report)

**Steps**:
1. Read the GitHub issue completely
2. Understand acceptance criteria
3. Reference `docs/ARCHITECTURE.md` to understand system design
4. Identify which files need changes
5. Check for existing tests that might need updates
6. Estimate effort (1 day, 3 days, 1 week)

**Output**: Implementation plan (mental model, share if complex)

**Example**:
```
Issue: Add CSV export format (GitHub issue #42)

Plan:
- Read ARCHITECTURE.md Data Structures section
- Modify extractorEngine.js: add formatOutput(data, 'csv') branch
- Create tests/specs/exportFormats.spec.js with CSV test cases
- Update chrome-extension/lib/storageManager.js if needed
- Test in both Chrome and Firefox
- Effort: ~1 day
```

---

### Phase 2: Test (Red - Write Failing Tests)

**Input**: Implementation plan

**Steps**:
1. Create test file (or add to existing): `tests/specs/<feature>.spec.js`
2. Write failing test cases that match acceptance criteria
3. Include both happy path AND edge cases
4. Run tests: `npm test`
5. Verify tests FAIL (TDD red phase)

**Output**: Failing test suite (all tests red)

**Example**:
```javascript
// tests/specs/exportFormats.spec.js
import { test, expect } from '@playwright/test';
import { formatOutput } from '../../chrome-extension/lib/extractorEngine';

test('should format extracted data as CSV', async () => {
  const data = [
    { name: 'Product A', price: '29.99' },
    { name: 'Product B', price: '39.99' }
  ];
  
  const csv = formatOutput(data, 'csv');
  
  expect(csv).toContain('name,price');
  expect(csv).toContain('"Product A",29.99');
});

test('should escape quotes in CSV fields', async () => {
  const data = [{ name: 'Product "Premium"', price: '99' }];
  const csv = formatOutput(data, 'csv');
  
  expect(csv).toContain('"Product ""Premium"""');
});
```

---

### Phase 3: Implement (Green - Write Minimal Code)

**Input**: Failing tests

**Steps**:
1. Identify which files to modify (from phase 1 plan)
2. Implement feature with minimal code to pass tests
3. Follow `.github/copilot-instructions.md` conventions
4. Add error handling for all async operations
5. Use async/await (never .then/.catch chains)
6. Run tests: `npm test`
7. Verify tests PASS (TDD green phase)

**Output**: Passing test suite

**Example**:
```javascript
// chrome-extension/lib/extractorEngine.js
export function formatOutput(data, format) {
  try {
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        return formatAsCSV(data);
      case 'text':
        return formatAsText(data);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  } catch (err) {
    console.error('Format error:', err);
    throw new Error(`Failed to format output: ${err.message}`);
  }
}

function formatAsCSV(data) {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const headerRow = headers.map(h => `"${h}"`).join(',');
  
  const dataRows = data.map(row =>
    headers.map(h => {
      const value = row[h];
      if (value === null || value === undefined) return '';
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',')
  );
  
  return [headerRow, ...dataRows].join('\n');
}
```

---

### Phase 4: Refactor (Quality Improvements)

**Input**: Passing tests

**Steps**:
1. Review code quality (readability, maintainability)
2. Check for error handling (all try/catch blocks present)
3. Verify naming conventions (camelCase for functions/vars)
4. Check for anti-patterns (no eval, no unvalidated innerHTML)
5. Add comments only where clarity needed
6. Run tests again: `npm test`
7. Verify tests still pass

**Output**: Clean, maintainable implementation

---

### Phase 5: Verify (Both Browsers)

**Input**: Refactored code

**Steps**:
1. Run tests for Chrome: `npm test -- --project=chromium`
2. Run tests for Firefox: `npm test -- --project=firefox`
3. Check coverage: `npm test -- --coverage` (target >80%)
4. Load extension in Chrome manually
5. Load extension in Firefox manually
6. Test feature on real web pages
7. Verify no console errors
8. Verify no performance regressions

**Output**: Verified implementation, both browsers passing

---

### Phase 6: Create PR (Handoff to QA)

**Input**: Verified implementation

**Steps**:
1. Commit changes: `git commit -m "feat(format): add CSV export support"`
2. Push branch: `git push origin feature/csv-export`
3. Create PR on GitHub with:
   - Title: Conventional Commit format (feat(scope): message)
   - Description: What changed, why, how to test
   - Link issue: "Closes #42"
   - Checklist: Tests pass, coverage >80%, browsers tested
4. @mention @ai-team-qa for review

**Output**: PR ready for QA review

**PR Description Template**:
```markdown
## What changed
Added CSV export format to data extraction. Users can now save extracted data as CSV files.

## Why
Users requested CSV format for import into spreadsheet applications (GitHub issue #42).

## How to test
1. Run tests: npm test (should pass)
2. Check coverage: npm test -- --coverage (>80%)
3. Manual testing:
   - Load extension in Chrome
   - Create template with format="csv"
   - Extract data on e-commerce site
   - Verify CSV output has header row, quoted fields

## Browsers tested
- [x] Chrome MV3
- [x] Firefox

Closes #42
```

---

### Phase 7: Address Feedback

**Input**: QA review comments

**Steps**:
1. Read QA feedback
2. Address each comment:
   - If test suggestion: add test and implement fix
   - If code suggestion: refactor as suggested
   - If question: explain in comment reply
3. Push updates: `git push origin feature/csv-export`
4. Re-run tests to ensure all still pass
5. Mark conversation as resolved in GitHub
6. Reply: "Addressed feedback, ready for re-review"

**Output**: Addressed feedback, ready to merge

---

## Success Criteria

Before considering a feature "done":

- [x] **Tests pass**: `npm test` returns all green
- [x] **Coverage maintained**: >80% code coverage
- [x] **Both browsers**: Tests pass on Chrome + Firefox
- [x] **Manual testing**: Feature works on real pages
- [x] **No regressions**: Existing features still work
- [x] **Code quality**: Follows `.github/copilot-instructions.md`
- [x] **Error handling**: All try/catch blocks present
- [x] **Documentation**: Code is clear, comments where needed
- [x] **PR ready**: Description clear, issue referenced, checklist complete
- [x] **QA approval**: Ivy has reviewed and approved

---

## DON'T (Anti-Patterns)

### ❌ Never

```javascript
// DON'T: Use eval() or Function() constructor
eval(userProvidedCode); // Code injection vulnerability
new Function('x', userProvidedCode)(); // Same risk

// DON'T: Assume sync storage (doesn't work)
const config = chrome.storage.local.get('config'); // undefined!

// DON'T: Use innerHTML with user content
element.innerHTML = userData; // XSS vulnerability

// DON'T: Ignore async errors
chrome.storage.local.get('config'); // No error handling

// DON'T: Trust sender without validation
if (message.type === 'DELETE_ALL') deleteAllData(); // Any script can send!

// DON'T: Use var (use const/let instead)
var oldStyle = 'bad'; // Old JavaScript

// DON'T: Skip error handling in async
async function getConfig() {
  const { config } = await chrome.storage.local.get('config'); // Could crash
}

// DON'T: Commit without testing both browsers
git commit -m "fix: works in Chrome"
git push # Haven't tested Firefox!

// DON'T: Approve your own PR
# You write code, QA reviews it (different people)

// DON'T: Bypass tests to ship faster
git push --force-with-lease # This breaks QA verification
```

### ✓ DO

```javascript
// DO: Use whitelist for transforms
const TRANSFORMS = { trim, parseFloat, parseInt };
const fn = TRANSFORMS[userProvidedName];

// DO: Use async/await with try/catch
try {
  const { config } = await chrome.storage.local.get('config');
  return config || {};
} catch (err) {
  console.error('Storage error:', err);
  return {};
}

// DO: Use textContent for user content
element.textContent = userData; // Safe: interpreted as text

// DO: Validate sender origin
if (sender.url.startsWith('chrome-extension://')) {
  handleMessage(message);
}

// DO: Use const by default
const config = { ...defaultConfig };
let currentTemplate = null; // Use let for mutable state

// DO: Test in both browsers
npm test -- --project=chromium
npm test -- --project=firefox

// DO: Wait for QA approval before merging
# Create PR, wait for Ivy to review and approve
```

---

## Common Patterns

### Async Storage

```javascript
// ✓ GOOD: Proper async handling
async function getTemplates() {
  try {
    const { config } = await chrome.storage.local.get('config');
    return config?.templates || [];
  } catch (err) {
    console.error('Failed to load templates:', err);
    return [];
  }
}

// Usage
const templates = await getTemplates();
```

### Error Handling

```javascript
// ✓ GOOD: Comprehensive error handling
async function extractData(template) {
  try {
    if (!template?.pattern) {
      throw new Error('Template must have a pattern');
    }
    
    const elements = document.querySelectorAll(template.pattern);
    const data = Array.from(elements).map(el => extract(el));
    
    return { success: true, data };
  } catch (err) {
    console.error('Extraction failed:', err);
    return {
      success: false,
      error: err.message,
      code: err.code || 'UNKNOWN_ERROR'
    };
  }
}
```

### Message Passing

```javascript
// ✓ GOOD: Safe message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.url.startsWith('chrome-extension://')) {
    if (message.type === 'GET_TEMPLATES') {
      (async () => {
        try {
          const templates = await getTemplates();
          sendResponse({ templates });
        } catch (err) {
          sendResponse({
            type: 'ERROR',
            code: 'STORAGE_ERROR',
            message: err.message
          });
        }
      })();
      return true; // Keep channel open for async
    }
  }
});
```

---

## Workflow Commands

```bash
# Create feature branch
git checkout -b feature/my-feature

# Write failing test
# Create tests/specs/myFeature.spec.js
# Run: npm test (should fail)

# Implement feature
# Edit chrome-extension/lib/myFeature.js
# Run: npm test (should pass)

# Test in both browsers
npm test -- --project=chromium
npm test -- --project=firefox

# Check coverage
npm test -- --coverage

# Build extension (for manual testing)
npm run build

# Commit (Conventional Commits)
git commit -m "feat(scope): description"

# Push branch
git push origin feature/my-feature

# Create PR on GitHub (include checklist)
```

---

## When Blocked

**If unclear on requirements**:
- Read GitHub issue again
- @mention @ai-team-product (Remy) in comment: "Can you clarify acceptance criteria for X?"

**If unsure on implementation approach**:
- Reference `docs/ARCHITECTURE.md` for system design
- Check existing code patterns in `chrome-extension/lib/`
- Read test cases in `tests/specs/`

**If tests won't pass**:
- Review error message carefully
- Debug using `npm test -- --verbose`
- Check both Chrome and Firefox
- Ensure all async operations have await

**If performance is slow**:
- Profile extraction latency (target <1 second)
- Check for excessive DOM queries
- Review storage operations (should be batched)
- Ask @ai-team-qa (Ivy) for performance guidance

---

## Related Documentation

- **Code Conventions**: `.github/copilot-instructions.md`
- **System Architecture**: `docs/ARCHITECTURE.md`
- **Testing Guide**: `docs/DEVELOPMENT_GUIDE.md` → "Testing Matrix"
- **Codebase Map**: `docs/CODEBASE_MAP.md`
- **Agent Roles**: `.github/AGENTS.md`
