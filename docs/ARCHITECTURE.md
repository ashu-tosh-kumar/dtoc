# DTOC System Architecture

## System Overview

DTOC is a browser extension for Chrome MV3 and Firefox that extracts and transforms data using custom templates. The extension architecture follows an async message-passing model between content scripts and background workers.

### Core Components

- **Content Script** (`chrome-extension/content.js`): Runs on web pages, intercepts DOM, executes CSS selectors, extracts data, communicates with background worker
- **Background Service Worker** (`chrome-extension/background.js`): Persistent context, manages templates, storage operations, cross-script coordination
- **Storage Layer** (`chrome.storage.local`): Persistent template configs, user preferences (100MB+ quota per browser)
- **UI Components** (Popup, Options): Configuration management, template CRUD

### Cross-Browser Support

- **Chrome MV3**: Native support for Service Workers, chrome namespace
- **Firefox MV2/MV3**: API compatibility via `browser` namespace or polyfills

Detection pattern:
```javascript
const API = typeof chrome !== 'undefined' ? chrome : browser;
```

---

## Data Structures

### Template Object (Core Entity)

```javascript
{
  id: "template-uuid-v4",
  name: "Product Listing Extractor",
  pattern: ".product-item", // CSS selector
  format: "json", // text | json | csv
  fields: [
    {
      name: "title",
      selector: "h2.title",
      attribute: "textContent", // textContent | innerText | innerHTML | data-*
      type: "string"
    },
    {
      name: "price",
      selector: ".price",
      attribute: "textContent",
      type: "number",
      transform: "parseFloat" // optional: parseFloat, parseInt, trim
    }
  ],
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
  enabled: true
}
```

### Storage Schema

```javascript
{
  "config": {
    templates: [], // Array of Template objects
    settings: {
      autoExtract: false,
      exportFormat: "json",
      theme: "light"
    }
  }
}
```

---

## Message Protocol

All communication between content script and background uses async message passing.

### Message Format

```javascript
{
  type: "ACTION_NAME",
  payload: { /* action-specific data */ },
  requestId: "uuid" // for request/response tracking
}
```

### Standard Message Types

| Type | Direction | Payload | Response |
|------|-----------|---------|----------|
| `EXTRACT_DATA` | Content → Background | `{ pattern: string }` | `{ data: [], format: string }` |
| `GET_TEMPLATES` | Content → Background | `{}` | `{ templates: [] }` |
| `SAVE_TEMPLATE` | UI → Background | `{ template: Template }` | `{ success: bool, id: string }` |
| `DELETE_TEMPLATE` | UI → Background | `{ id: string }` | `{ success: bool }` |
| `UPDATE_SETTINGS` | UI → Background | `{ settings: {} }` | `{ success: bool }` |

### Error Response Format

```javascript
{
  type: "ERROR",
  payload: {
    code: "INVALID_SELECTOR", // INVALID_SELECTOR | STORAGE_ERROR | AUTH_ERROR
    message: "CSS selector failed: ...",
    requestId: "uuid"
  }
}
```

---

## Data Flow

### Extraction Flow (Primary Use Case)

```
1. User visits web page
2. Content script loads
   ↓
3. Content script requests templates: sendMessage({ type: 'GET_TEMPLATES' })
   ↓
4. Background retrieves from chrome.storage.local
   ↓
5. Content script iterates templates, executes CSS selectors on DOM
   ↓
6. For matching elements, extracts data using field definitions
   ↓
7. Formats output (JSON/CSV/Text)
   ↓
8. Displays extracted data to user via UI overlay or console
```

Latency target: < 1 second for DOM extraction (excludes user interaction time)

### Configuration Flow

```
1. User opens Options page
2. UI loads templates from storage: chrome.storage.local.get('config')
3. User creates/edits template
4. UI sends: sendMessage({ type: 'SAVE_TEMPLATE', payload: { template } })
5. Background validates template, writes to storage
6. Returns { success: true, id: newId }
7. UI refreshes template list
```

---

## Security Model

### No External Communication
- Zero external API calls
- No data transmission outside user's browser
- All operations are local-only

### Storage Security
- Uses chrome.storage.local (isolated per user, per browser, per profile)
- No sync to cloud (user can manually export/import if desired)
- User's templates are never shared or indexed

### Input Validation
- All CSS selectors validated before execution (prevent injection)
- Field names must be alphanumeric + underscore
- Message types validated against allowed list

### Anti-Patterns (NEVER DO)
```javascript
// ❌ NEVER: eval() or innerHTML with user input
eval(userTemplate.transform);
element.innerHTML = userData; // XSS risk

// ❌ NEVER: sync storage (blocking)
const data = chrome.storage.local.get('config'); // doesn't work

// ❌ NEVER: assume message source
onMessage((msg, sender, sendResponse) => {
  if (msg.type === 'DELETE') deleteAllData(); // any page can send this!
});

// ❌ NEVER: unvalidated document.querySelector()
const el = document.querySelector(userProvidedSelector); // CSS injection

// ❌ NEVER: trust sender === undefined (could be any script)
```

---

## Testing Strategy

### Unit Tests
- Location: `tests/specs/*.spec.js`
- Focus: Template validation, field extraction, formatting logic
- Framework: Playwright (real browser automation)
- Coverage target: >80% of extraction logic

### E2E Tests

**Chrome Testing**
- Real Chrome browser (Puppeteer or Playwright)
- Test actual MV3 extension load
- Verify message passing between scripts
- Test DOM extraction on real pages

**Firefox Testing**
- Real Firefox browser (Playwright WebDriver)
- Test API namespace detection (chrome vs browser)
- Verify message passing compatibility
- Test DOM extraction with Firefox quirks

### Test Structure
```javascript
// Template validation
test('should extract text from single element', async () => {
  const selector = '.title';
  const result = extractFromDOM(selector, 'textContent');
  expect(result).toBe('Expected Title');
});

// Happy path extraction
test('should extract multiple products from listing', async () => {
  const template = createTemplateWithFields(...);
  const results = await extractData(template);
  expect(results.length).toBeGreaterThan(0);
});

// Edge cases
test('should handle missing CSS selector gracefully', async () => {
  const results = await extractData(invalidTemplate);
  expect(results).toEqual([]);
});

test('should handle malformed field definitions', async () => {
  expect(() => validateTemplate(badTemplate)).toThrow();
});

// Cross-browser compatibility
test('should work in Chrome and Firefox', async ({ browserName }) => {
  expect(['chromium', 'firefox']).toContain(browserName);
  // run extraction, verify same results
});
```

### Approval Criteria
- All tests pass
- Both Chrome and Firefox have >80% coverage
- Happy path AND edge cases tested
- No flaky tests (pass consistently 3+ runs)

---

## Error Handling

All async operations (storage, messaging, DOM operations) must handle errors:

```javascript
// Good: Proper error handling
async function getTemplates() {
  try {
    const { config } = await chrome.storage.local.get('config');
    return config?.templates || [];
  } catch (err) {
    console.error('Storage read failed:', err);
    return [];
  }
}

// Messaging with error response
function onExtractRequest(message, sender, sendResponse) {
  try {
    const data = extractFromDOM(message.payload.pattern);
    sendResponse({ type: 'SUCCESS', data });
  } catch (err) {
    sendResponse({
      type: 'ERROR',
      code: 'INVALID_SELECTOR',
      message: err.message
    });
  }
}
```

---

## Deployment

### Local Development
1. Clone repo: `git clone ...`
2. Run dev server: `npm run dev` (if present)
3. Load extension in browser (Chrome: chrome://extensions, Firefox: about:debugging)
4. Make changes, reload extension

### Chrome Web Store
- Package as .zip
- Submit to Chrome Web Store review
- Review typically 1-2 days

### Firefox Add-ons
- Package as .xpi
- Submit to Mozilla review
- Review typically 3-5 days

### Version Bumping
- Update manifest.json version
- Update package.json version
- Create git tag: `git tag v1.2.3`
- Push tag: `git push origin v1.2.3`

---

## Known Constraints

- **Storage quota**: ~100MB per browser (can store 1000+ templates)
- **Message size**: <100MB per message (practical limit ~10MB)
- **Selector complexity**: Avoid deeply nested selectors (performance)
- **Transform functions**: Limited to string methods (no eval)
- **Cross-origin**: Content script can only access page DOM (no cross-site requests)
