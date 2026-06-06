# AI Development Instructions for DTOC

This file provides AI assistants and agents (such as Google Antigravity, Jules, Kiro, Claude, Gemini, and GitHub Copilot) with guidance on code conventions, data structures, test setups, and security rules to maintain correctness and consistency.

---

## Project Context

- **Project**: DTOC Browser Extension (Chrome MV3 + Firefox MV3)
- **Purpose**: Generates a floating, interactive Table of Contents (TOC) overlay on supported and unsupported web pages.
- **Architecture**: **Storage-driven state synchronization**. There is no background script/service worker. The content script (`content.js`) and popup UI (`popup.js`) read and write states directly to `chrome.storage.local` or `browser.storage.local`.
- **Latency Target**: < 1 second DOM heading extraction and TOC rendering.
- **Dependency Scope**: Vanilla HTML/CSS/JS in content/popup; zero external dependencies, no Webpack/Rollup bundlers.

---

## Code Conventions

### File Naming
- **JavaScript**: `camelCase.js` (e.g. `content.js`, `popup.js`, `test.js`)
- **JSON**: `snake_case.json` (e.g. `manifest.json`)
- **CSS**: `kebab-case.css` (e.g. `content.css`, `popup.css`)
- **Docs**: `UPPER_CASE.md` (e.g. `ARCHITECTURE.md`)

### JavaScript Code Style
```javascript
// ✓ Use const for immutable references (preferred)
const supportedSites = ['.atlassian.net', 'dev.to', 'medium.com'];

// ✓ Use let for mutable local states
let shadowRoot = null;

// ✓ Use async/await for storage / promise operations
async function getStorageData(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, resolve);
  });
}

// ✓ Destructuring for configuration extraction
const { enabled, position, siteSettings } = result;

// ✓ Template literals for string formatting
const elementId = `dtoc-${slug}`;
```

### Naming Conventions

| Pattern | Usage | Example |
|---------|-------|---------|
| `camelCase` | Functions, local variables, methods | `isViewMode()`, `siteToggleBtn`, `init()` |
| `PascalCase` | Classes, constructors | `URLSearchParams` |
| `UPPER_SNAKE_CASE` | Constants | `SETTINGS_KEY`, `ICON_MINIMIZE` |
| `$prefix` | DOM elements (optional) | `$container`, `$closeBtn` |

---

## Storage & Mappings

All states are stored in the root of `chrome.storage.local` (Chrome) or `browser.storage.local` (Firefox):

- `enabled` (boolean): Global active state of the TOC overlay.
- `position` (string: `'left'` | `'right'`): Global TOC overlay position.
- `closed` (boolean): Current page override to hide the TOC.
- `minimized` (boolean): Whether the TOC panel is currently minimized.
- `siteSettings` (object): Map of domain names to site-specific configs:
  ```javascript
  {
    "medium.com": { "enabled": true, "position": "right" },
    "levelup.gitconnected.com": { "enabled": true }
  }
  ```

---

## Security Model & Anti-Patterns

### 1. No eval() or dynamic code construction
```javascript
// ❌ NEVER: Dynamic function parsing
const fn = new Function('x', userProvidedValue);

// ✓ ALWAYS: Use a map of predefined transformations
const TRANSFORMS = {
  trim: (s) => s.trim(),
  parseFloat: (s) => parseFloat(s)
};
```

### 2. No innerHTML with page content (XSS Protection)
```javascript
// ❌ NEVER: Injecting raw HTML text from page elements
element.innerHTML = heading.textContent; // XSS vulnerability

// ✓ ALWAYS: Use textContent for text injections
element.textContent = heading.textContent; // Escaped safely
```

### 3. Safe DOM Querying
```javascript
// ❌ NEVER: Unvalidated query selector execution
document.querySelectorAll(userProvidedSelector); // Can crash on bad selectors

// ✓ ALWAYS: Validate or wrap selector lookups in try/catch
function querySelectorSafe(parent, selector) {
  try {
    return parent.querySelectorAll(selector);
  } catch (err) {
    console.error(`Invalid CSS selector: "${selector}"`, err);
    return [];
  }
}
```

### 4. Zero Network Requests
No analytics, remote fetching, CDN scripts, or external API calls are allowed in the extension code. All processing must happen locally inside the browser.

---

## Testing Guidelines

We have two main test configurations:

### 1. Unit Tests (Jest)
- File: `tests/unit/test.js`
- Executed via: `npm run test`
- Mocks DOM APIs and storage methods using Jest/JSDOM. Used for verifying pure logical functions.

```javascript
describe("settings inheritance resolution logic", () => {
  test("inherits global settings when siteSettings are empty", () => {
    const mockStorage = {
      enabled: true,
      position: 'right',
      siteSettings: {}
    };
    const resolved = resolveSettings(mockStorage, 'medium.com');
    expect(resolved.enabled).toBe(true);
    expect(resolved.position).toBe('right');
  });
});
```

### 2. E2E Tests (Playwright)
- File: `tests/e2e.spec.js`
- Executed via: `npm run test:e2e`
- Loads actual browser profiles with the unpacked extension. Used for testing Shadow DOM, positioning, and popup interactions.

```javascript
test('should inject the table of contents', async ({ page }) => {
  await page.goto('https://dev.to/some-article');
  const host = page.locator('#dtoc-host');
  await expect(host).toBeAttached();
});
```

---

## Cross-Browser Compatibility

Always support both Chrome and Firefox MV3 configurations.
- **Chrome**: Uses the `chrome` namespace (e.g. `chrome.storage.local`).
- **Firefox**: Uses the `browser` namespace (e.g. `browser.storage.local`).
- **Namespace abstraction**: Use target namespace detection:
  ```javascript
  const API = typeof chrome !== 'undefined' && chrome.runtime ? chrome : window.browser;
  ```
- Make sure that `chrome-extension/` files use `chrome.*` and `firefox-extension/` files use `browser.*` to satisfy automated file check tests.
