## 2025-02-14 - Prevent DOM-based DoS via Text Truncation
**Vulnerability:** The extension extracted unconstrained `textContent` from headings and document titles and fed these directly into multiple regular expression operations (like `slugify`) and DOM manipulations without limits.
**Learning:** In a browser extension context, unconstrained user-controlled DOM strings passed into regex replacements expose the extension to Regular Expression Denial of Service (ReDoS) and general DOM-based CPU exhaustion (DoS) from malicious or extremely malformed pages.
**Prevention:** Always enforce strict length limits (e.g., truncating to 200-500 characters) on any text extracted from the DOM before performing CPU-intensive regex string parsing or re-injecting them into the extension UI.
## 2025-06-26 - Prevent CSS Selector Injection
**Vulnerability:** The extension extracted heading IDs and interpolated them directly into CSS attribute selectors (`[href="#${activeId}"]`) inside `querySelector`.
**Learning:** If a page contains a heading with an ID that includes an unescaped double quote (e.g. `id='my"id'`), this directly escapes the CSS attribute selector context, causing a syntax error which will prevent the extension from functioning (Denial of Service) and may potentially be leveraged for further logic injection.
**Prevention:** Always escape CSS selector strings using a pattern that replaces double quotes and backslashes with their escaped equivalents (e.g. `.replace(/["\\]/g, '\\$&')`) or use `CSS.escape()` before interpolating them into a `querySelector`.
