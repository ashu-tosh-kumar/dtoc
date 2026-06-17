## 2025-02-14 - Prevent DOM-based DoS via Text Truncation
**Vulnerability:** The extension extracted unconstrained `textContent` from headings and document titles and fed these directly into multiple regular expression operations (like `slugify`) and DOM manipulations without limits.
**Learning:** In a browser extension context, unconstrained user-controlled DOM strings passed into regex replacements expose the extension to Regular Expression Denial of Service (ReDoS) and general DOM-based CPU exhaustion (DoS) from malicious or extremely malformed pages.
**Prevention:** Always enforce strict length limits (e.g., truncating to 200-500 characters) on any text extracted from the DOM before performing CPU-intensive regex string parsing or re-injecting them into the extension UI.
