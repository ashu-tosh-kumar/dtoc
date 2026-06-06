# AI Development Instructions for DTOC

This file provides AI agents (particularly @ai-team-dev) with precise guidance on code conventions, data structures, and anti-patterns to maintain consistency and correctness.

---

## Project Context

**Project**: DTOC Browser Extension (Chrome MV3 + Firefox)  
**Purpose**: Extract and transform web page data using CSS selectors and custom templates  
**Architecture**: Content script → Background worker → Storage (async messaging)  
**Developer**: Single developer (human) + AI agents  
**Scope**: <1 second extraction latency, zero external API calls, cross-browser compatibility

---

## Code Conventions

### File Naming
- **JavaScript files**: `camelCase.js` (e.g., `contentScript.js`, `templateValidator.js`)
- **JSON files**: `snake_case.json` (e.g., `template_schema.json`, `manifest.json`)
- **CSS files**: `kebab-case.css` (e.g., `popup-ui.css`, `overlay-styles.css`)
- **Documentation**: `UPPER_CASE.md` (e.g., `README.md`, `ARCHITECTURE.md`)

### JavaScript Code Style
```javascript
// ✓ const for immutable bindings (prefer const)
const templates = [];

// ✓ let for mutable local state
let currentTemplate = null;

// ✓ var NEVER (except if required by legacy code)

// ✓ async/await for promises (never .then/.catch chains)
async function fetchTemplates() {
  try {
    const { config } = await chrome.storage.local.get('config');
    return config?.templates || [];
  } catch (err) {
    console.error('Failed to fetch templates:', err);
    return [];
  }
}

// ✓ Destructuring for object/array unpacking
const { id, name, fields } = template;
const [first, ...rest] = items;

// ✓ Template literals for strings
const message = `Processing template: ${template.name}`;

// ✓ Arrow functions for callbacks
array.map(item => item.id);
```

### Naming Conventions

| Pattern | Use | Example |
|---------|-----|---------|
| `camelCase` | Functions, variables, methods | `extractData()`, `templateId`, `isValid` |
| `PascalCase` | Classes, constructors | `TemplateValidator`, `ExtractorEngine` |
| `UPPER_SNAKE_CASE` | Constants | `MAX_TEMPLATE_COUNT`, `ERROR_CODES` |
| `_leading` | Private methods (convention, not enforced) | `_validateSelector()` |
| `$prefix` | DOM elements (jQuery-style convention) | `$container`, `$submitBtn` |

### Async/Storage Pattern

**Critical**: All `chrome.storage` calls are async. Never assume sync behavior.

```javascript
// ✓ GOOD: Async/await pattern
async function getConfig() {
  try {
    const { config } = await chrome.storage.local.get('config');
    return config || { templates: [], settings: {} };
  } catch (err) {
    console.error('Storage error:', err);
    throw new Error('Failed to load configuration');
  }
}

// ✓ GOOD: Promise pattern (if async/await not available)
chrome.storage.local.get('config', (result) => {
  if (chrome.runtime.lastError) {
    console.error('Storage error:', chrome.runtime.lastError);
  } else {
    const config = result.config || {};
  }
});

// ❌ BAD: Assuming sync behavior (WILL BREAK)
const config = chrome.storage.local.get('config'); // undefined!

// ❌ BAD: Not handling errors
const { config } = await chrome.storage.local.get('config');
const templates = config.templates; // could be undefined
```

---

## Data Structures

### Template Object (Complete Schema)

```javascript
{
  id: "uuid-v4", // Must be unique, use crypto.randomUUID()
  name: "Product Scraper", // User-friendly name
  description: "Extract product info from ecommerce sites", // Optional
  pattern: ".product", // CSS selector for root element
  format: "json", // "json" | "csv" | "text"
  fields: [
    {
      name: "productName", // camelCase, alphanumeric + underscore only
      selector: "h2.title", // CSS selector (must be valid)
      attribute: "textContent", // "textContent" | "innerText" | "innerHTML" | "data-attr"
      type: "string", // "string" | "number" | "boolean" | "array"
      transform: "trim", // Optional: "trim" | "parseFloat" | "parseInt" | null
      required: true // Optional, default false
    },
    {
      name: "price",
      selector: ".price-value",
      attribute: "textContent",
      type: "number",
      transform: "parseFloat",
      required: false
    }
  ],
  enabled: true,
  createdAt: "2024-01-15T10:30:00Z", // ISO 8601 timestamp
  updatedAt: "2024-01-15T10:30:00Z",
  tags: ["ecommerce", "products"], // Optional array for categorization
  notes: "Used for price tracking on Amazon" // Optional user notes
}
```

### Message Protocol

All messages between content script and background follow this format:

```javascript
{
  type: "ACTION_NAME", // Required: enum value
  payload: { /* action-specific fields */ }, // Required: can be {}
  requestId: "uuid-v4" // Optional: for tracking request/response
}
```

**Standard Message Types**:

| Type | Source | Destination | Payload | Response |
|------|--------|-------------|---------|----------|
| `GET_TEMPLATES` | Content | Background | `{}` | `{ templates: Template[] }` |
| `EXTRACT_DATA` | Content | Background | `{ pattern: string, templateId?: string }` | `{ data: any[], format: string }` |
| `SAVE_TEMPLATE` | Popup | Background | `{ template: Template }` | `{ success: bool, id: string }` |
| `DELETE_TEMPLATE` | Popup | Background | `{ id: string }` | `{ success: bool }` |
| `UPDATE_TEMPLATE` | Popup | Background | `{ id: string, updates: Partial<Template> }` | `{ success: bool }` |
| `GET_SETTINGS` | Any | Background | `{}` | `{ settings: Settings }` |
| `SAVE_SETTINGS` | Popup | Background | `{ settings: Partial<Settings> }` | `{ success: bool }` |

### Error Message Format

```javascript
{
  type: "ERROR",
  code: "ERROR_CODE", // "INVALID_SELECTOR" | "STORAGE_ERROR" | "INVALID_MESSAGE" | "NOT_FOUND"
  message: "Human-readable error description",
  requestId: "uuid-v4", // Echo back original requestId if applicable
  details: {} // Optional additional context
}
```

---

## Cross-Browser Compatibility

### API Abstraction

Always use an abstraction layer to support both Chrome and Firefox:

```javascript
// ✓ GOOD: Abstraction pattern
const browser = (() => {
  return typeof chrome !== 'undefined' && chrome.runtime ? chrome : window.browser;
})();

// Usage
browser.storage.local.get('config', callback);
browser.runtime.sendMessage({ type: 'GET_TEMPLATES' });

// ✓ GOOD: Namespace detection for specific features
function isChrome() {
  return typeof chrome !== 'undefined' && chrome.runtime;
}

function isFirefox() {
  return typeof browser !== 'undefined' && browser.runtime;
}

if (isChrome()) {
  // Chrome MV3 specific code
} else if (isFirefox()) {
  // Firefox specific code
}
```

### Known Differences

| Feature | Chrome MV3 | Firefox MV3 | Workaround |
|---------|-----------|-----------|-----------|
| Namespace | `chrome` | `browser` | Detect and abstract |
| Service Worker | Native | Service Worker (Fx 109+) | Test both |
| Storage quota | 100MB | 10MB-unlimited* | Check limits |
| Content Security Policy | Strict | More lenient | Test both |

*Firefox varies by configuration; always test with limiting code

---

## Message Passing Pattern

### Sending Messages

```javascript
// ✓ GOOD: From content script to background
chrome.runtime.sendMessage(
  { type: 'GET_TEMPLATES' },
  (response) => {
    if (chrome.runtime.lastError) {
      console.error('Message failed:', chrome.runtime.lastError);
    } else {
      console.log('Received:', response);
    }
  }
);

// ✓ GOOD: Async/await wrapper (if available)
async function sendMessageAsync(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });
}
```

### Receiving Messages

```javascript
// ✓ GOOD: Handle message in background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
    return true; // Keep channel open for async response
  }
});
```

---

## Error Handling

### Try/Catch Pattern

```javascript
// ✓ GOOD: Comprehensive error handling
async function extractData(template) {
  try {
    // Validate input
    if (!template || !template.pattern) {
      throw new Error('Invalid template: missing pattern');
    }

    // Perform operation
    const elements = document.querySelectorAll(template.pattern);
    const data = Array.from(elements).map(el => extractFromElement(el, template.fields));

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

// ✓ GOOD: Specific error types
class InvalidTemplateError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidTemplateError';
    this.code = 'INVALID_TEMPLATE';
  }
}

throw new InvalidTemplateError(`Selector is not valid: ${selector}`);
```

### DOM Query Safety

```javascript
// ✓ GOOD: Safe selector execution with try/catch
function querySelectorSafe(selector) {
  try {
    return document.querySelectorAll(selector);
  } catch (err) {
    console.error(`Invalid CSS selector: "${selector}"`, err);
    return [];
  }
}

// ✓ GOOD: Validate selector before use
function isValidSelector(selector) {
  try {
    document.createDocumentFragment().querySelector(selector);
    return true;
  } catch {
    return false;
  }
}
```

---

## Anti-Patterns (NEVER DO THESE)

### 1. Never use eval() or Function() constructor

```javascript
// ❌ DANGEROUS
const transform = userProvidedString; // e.g., "alert('hacked')"
const result = eval(transform); // Code injection!

const fn = new Function('item', userProvidedString);
result = fn(item); // Same problem!

// ✓ GOOD: Use built-in methods or whitelist transforms
const ALLOWED_TRANSFORMS = {
  trim: (s) => s.trim(),
  parseFloat: (s) => parseFloat(s),
  parseInt: (s) => parseInt(s),
  toUpperCase: (s) => s.toUpperCase(),
  toLowerCase: (s) => s.toLowerCase()
};

const transform = ALLOWED_TRANSFORMS[userProvidedName];
if (transform) result = transform(value);
```

### 2. Never use innerHTML with user content

```javascript
// ❌ XSS VULNERABILITY
const userTemplate = { name: '<img src=x onerror="alert(1)">' };
document.getElementById('container').innerHTML = userTemplate.name; // XSS!

// ✓ GOOD: Use textContent for user content
element.textContent = userTemplate.name; // Safe (interpreted as text)

// ✓ GOOD: If HTML needed, sanitize first
const sanitized = DOMPurify.sanitize(userTemplate.description);
element.innerHTML = sanitized;
```

### 3. Never assume sync storage behavior

```javascript
// ❌ BROKEN
const config = chrome.storage.local.get('config'); // undefined!
console.log(config.templates); // TypeError: Cannot read property 'templates' of undefined

// ✓ GOOD: Always use callback or async/await
const { config } = await chrome.storage.local.get('config');
console.log(config?.templates || []);
```

### 4. Never trust message source without validation

```javascript
// ❌ INSECURE
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'DELETE_ALL_DATA') {
    deleteAllData(); // Any script can send this!
  }
});

// ✓ GOOD: Validate sender and message
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (sender.url.startsWith('chrome-extension://')) { // Only from extension
    if (ALLOWED_MESSAGES.includes(msg.type)) {
      handleMessage(msg);
    }
  }
});
```

### 5. Never assume field existence without checking

```javascript
// ❌ FRAGILE
const name = template.fields[0].name.toUpperCase(); // Could crash if no fields

// ✓ GOOD: Defensive programming
const name = template?.fields?.[0]?.name?.toUpperCase() ?? 'Unknown';

// ✓ GOOD: Explicit validation
function getFirstFieldName(template) {
  if (!template?.fields?.length) {
    throw new Error('Template must have at least one field');
  }
  return template.fields[0].name;
}
```

### 6. Never ignore promise rejections

```javascript
// ❌ UNHANDLED REJECTION
chrome.storage.local.get('config').catch(err => {
  // Error is silently ignored if not caught
});

// ✓ GOOD: Always handle rejections
chrome.storage.local.get('config')
  .then(result => { /* handle */ })
  .catch(err => {
    console.error('Storage read failed:', err);
    // Provide fallback
  });

// ✓ GOOD: With async/await
try {
  const { config } = await chrome.storage.local.get('config');
} catch (err) {
  console.error('Storage read failed:', err);
}
```

---

## Testing Guidelines

### Unit Test Example

```javascript
// tests/specs/templateValidator.spec.js
import { validateTemplate, validateField } from '../../chrome-extension/templateValidator';

describe('Template Validator', () => {
  it('should reject template without id', () => {
    expect(() => {
      validateTemplate({ name: 'Test', pattern: '.test' });
    }).toThrow('Template must have an id');
  });

  it('should accept valid template', () => {
    const valid = {
      id: 'test-1',
      name: 'Test',
      pattern: '.test',
      fields: [],
      format: 'json'
    };
    expect(() => validateTemplate(valid)).not.toThrow();
  });

  it('should validate CSS selector', () => {
    const field = { selector: '..invalid', name: 'test', attribute: 'textContent' };
    expect(() => validateField(field)).toThrow('Invalid CSS selector');
  });
});
```

### E2E Test Example

```javascript
// tests/specs/extraction.spec.js
import { test, expect } from '@playwright/test';

test.describe('Data Extraction', () => {
  test('should extract product data from page', async ({ page, context }) => {
    await page.goto('https://example-ecommerce.com');
    
    const template = {
      id: 'test-1',
      name: 'Products',
      pattern: '.product',
      format: 'json',
      fields: [
        { name: 'title', selector: 'h2', attribute: 'textContent' },
        { name: 'price', selector: '.price', attribute: 'textContent', transform: 'parseFloat' }
      ]
    };

    // Load extension (context setup)
    // Execute extraction
    const results = await page.evaluate((tmpl) => {
      return window.extractData(tmpl);
    }, template);

    expect(results.data.length).toBeGreaterThan(0);
    expect(results.data[0]).toHaveProperty('title');
    expect(results.data[0]).toHaveProperty('price');
  });
});
```

---

## Commit Message Convention

Follow **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `perf`, `ci`

**Examples**:
```
feat(extraction): add support for transform functions
fix(storage): handle quota exceeded error gracefully
refactor(messaging): simplify cross-script communication
test(extraction): add edge case tests for malformed selectors
docs(architecture): document message protocol
```

---

## Before Implementing

1. **Read relevant section of ARCHITECTURE.md** to understand data flows
2. **Check for existing tests** that need updating
3. **Validate all changes are in scope** for the issue
4. **Test in both Chrome and Firefox** before PR
5. **Add error handling** for all async operations
6. **Update docs** if behavior or APIs change

---

## Quick Reference: Common Tasks

### Adding a new message type
1. Add to MESSAGE_TYPES constant (if centralizing)
2. Add handler in background.js onMessage listener
3. Document in ARCHITECTURE.md Message Protocol table
4. Add test case for success and error paths
5. Update this file if new pattern emerges

### Adding storage field
1. Create migration function if changing schema
2. Update ARCHITECTURE.md Storage Schema
3. Add getter/setter with error handling
4. Add tests for get/set operations
5. Test upgrade path for existing users

### Cross-browser compatibility
1. Always test in both Chrome and Firefox
2. Use browser abstraction layer
3. Document differences in ARCHITECTURE.md
4. Add conditional tests if behavior differs
5. Note in commit message: "tested: Chrome + Firefox"

