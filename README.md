# dtoc

Dynamic Table of Content for Confluence.

This extension automatically generates a non-intrusive, sticky Table of Contents for Confluence pages, allowing you to quickly navigate long documents without losing your reading context.

## Features

- **Automatic Parsing**: Detects headings (H1-H6) and builds a nested TOC.
- **Floating UI**: Stays pinned to the side of your screen while you scroll.
- **Atlassian Theming**: Automatically adapts to Confluence's Light and Dark modes.
- **Reactivity**: Rebuilds the TOC on the fly as Confluence SPA pages update.
- **Privacy First**: Zero external network calls. All preferences are saved locally.

## Getting Started

To install the extension manually from source:

1. Clone or download this repository.
2. Open Chrome (or any Chromium-based browser like Edge, Brave, Arc) and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the folder containing this repository.
5. The extension will now automatically run on any Confluence Cloud (`https://*.atlassian.net/wiki/*`) page.

## Development & Testing

This project is built using Vanilla JavaScript, HTML, and CSS. No build step is required to run the extension.

To run the unit tests:

1. Install dependencies: `npm install`
2. Run tests: `npm test`

---
*Developed by Jules.*
