# Security Policy

## Supported Versions

`dtoc` only supports the latest active release version. Security updates are published directly to the latest release branch (e.g., if the current version is `3.0.0`, security updates will be rolled out as `3.0.1`, `3.0.2`, etc.; if the current version is `3.1.0`, updates will be rolled out as `3.1.1`, `3.1.2`, etc.). Older major or minor versions are not actively maintained for security patches.

| Version | Supported          |
| ------- | ------------------ |
| 3.x.x   | :white_check_mark: |
| 2.x.x   | :x:                |
| 1.x.x   | :x:                |

## Security Hardening

This extension follows strict security and privacy standards:

- **Manifest V3**: Both Chrome and Firefox extensions use Manifest V3, the latest security standard for web extensions.
- **Content Security Policy (CSP)**: We employ a restrictive CSP (`script-src 'self'; object-src 'none';`) to prevent Cross-Site Scripting (XSS) and other injection attacks. This ensures only local scripts are executed.
- **Zero External Calls**: `dtoc` does not communicate with any external servers. All processing (parsing headings, generating TOC) happens entirely within your browser on the local machine.
- **Privacy First**: No user data, document content, or tracking information is ever collected or transmitted. Preferences are stored locally using `chrome.storage.local` (or `browser.storage.local`).
- **Surgical DOM Observation**: The extension uses optimized `MutationObserver` logic to target only relevant content areas, minimizing interference with page performance and other site scripts.

## Reporting a Vulnerability

Please create a new issue detailing the security vulnerability.
