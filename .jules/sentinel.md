## 2025-02-14 - Prevent DOM-based DoS via Text Truncation
**Vulnerability:** The extension extracted unconstrained `textContent` from headings and document titles and fed these directly into multiple regular expression operations (like `slugify`) and DOM manipulations without limits.
**Learning:** In a browser extension context, unconstrained user-controlled DOM strings passed into regex replacements expose the extension to Regular Expression Denial of Service (ReDoS) and general DOM-based CPU exhaustion (DoS) from malicious or extremely malformed pages.
**Prevention:** Always enforce strict length limits (e.g., truncating to 200-500 characters) on any text extracted from the DOM before performing CPU-intensive regex string parsing or re-injecting them into the extension UI.

## 2025-02-14 - Prevent DOM-based DoS in querySelector via Escaping
**Vulnerability:** User-controlled heading IDs were interpolated directly into a DOM query string (`shadowRoot.querySelector('.toc-link[href="#${activeId}"]')`). While not an XSS vulnerability due to `querySelector` behavior, an ID containing unescaped quote marks (`"`) or backslashes (`\`) throws an uncaught DOMException, which breaks the scrollspy listener and halts execution (DoS).
**Learning:** Browser extension UI frequently synchronizes with user-generated document content (e.g., Markdown headers). When these values are passed directly into CSS selectors (like attribute selectors `[href="..."]` or `[data-id="..."]`), standard character sequences can prematurely terminate the selector string, causing exceptions.
**Prevention:** Always escape user-controlled or dynamically extracted identifiers (like `\` and `"`) before interpolating them into attribute values inside `querySelector` or `querySelectorAll`.
