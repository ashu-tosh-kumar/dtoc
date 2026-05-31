# Privacy Policy

Your privacy is a top priority. This extension is designed to be as non-intrusive and transparent as possible.

## Data Accessed

`dtoc` only accesses the following data on supported pages (Confluence Cloud):

- **Headings (H1-H6)**: The extension reads the text and tag names of headings to build the Table of Contents. This data never leaves your browser.
- **IDs**: It may generate stable, deterministic IDs (based on heading text) for headings that lack them. This ensures anchor links function correctly without unnecessary data processing.
- **Surgical DOM Observation**: The extension uses optimized `MutationObserver` logic to target only relevant content areas, ensuring it doesn't observe or process sensitive page content outside of the main article area.

## Data Storage

`dtoc` stores your preferences locally on your machine using `chrome.storage.local` (or `browser.storage.local`). The following keys are used:

- `enabled`: Whether the extension is active on the current page.
- `position`: The side of the screen where the TOC is displayed (`left` or `right`).
- `closed`: Whether the TOC has been manually closed by the user.
- `minimized`: Whether the TOC is currently in its minimized state.

No user data, document content, or browsing history is ever uploaded to any server.

## No-Network Guarantee

We guarantee that `dtoc` makes **zero external network calls**.

- No telemetry or tracking.
- No analytics.
- No remote script execution.
- No data collection or transmission.

All parsing, rendering, and logic happens entirely within the context of your browser on your local machine.

## Transparency

To maintain transparency about development:

- **Security Hardening**: Initial security review and suggestions provided by **Qodo**.
- **Implementation**: Security fixes and hardening implemented by **Gemini CLI**.

## Contact

If you have any questions about this privacy policy, please open an issue in the GitHub repository.
