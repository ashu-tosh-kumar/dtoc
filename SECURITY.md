# Security Policy

## Supported Versions

`dtoc` will receive security updates for each of 1 minor versions within 1 major versions.

| Version | Supported          |
| ------- | ------------------ |
| 1.3.x   | :white_check_mark: |
| 1.2.x   | :x:                |
| 1.1.x   | :x:                |

## Security Hardening

This extension follows strict security and privacy standards:

- **Manifest V3**: Both Chrome and Firefox extensions use Manifest V3, the latest security standard for web extensions.
- **Content Security Policy (CSP)**: We employ a restrictive CSP (`script-src 'self'; object-src 'none';`) to prevent Cross-Site Scripting (XSS) and other injection attacks. This ensures only local scripts are executed.
- **Zero External Calls**: `dtoc` does not communicate with any external servers. All processing (parsing headings, generating TOC) happens entirely within your browser on the local machine.
- **Privacy First**: No user data, document content, or tracking information is ever collected or transmitted. Preferences are stored locally using `chrome.storage.local` (or `browser.storage.local`).
- **Surgical DOM Observation**: The extension uses optimized `MutationObserver` logic to target only relevant content areas, minimizing interference with page performance and other site scripts.

## Reporting a Vulnerability

Please create a new issue detailing the security vulnerability.
