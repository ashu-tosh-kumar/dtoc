# DTOC

Dynamic Table of Content.

This extension automatically generates a non-intrusive, sticky Table of Contents, allowing you to quickly navigate long documents without losing your reading context.

<https://github.com/user-attachments/assets/f4e10d5f-0266-49f4-9800-8eeea60df0a9>

Supported Websites:

- Confluence Cloud (`https://*.atlassian.net/wiki/*`)

Supported Browsers:

- Chrome and all Chromium-based browsers (Edge, Brave, Arc, etc.)
- Mozilla Firefox and Firefox based browsers like Zen browser

## Features

- **Automatic Parsing**: Detects headings (`H1-H6`) and builds a nested TOC.
- **Floating UI**: Stays pinned to the side of your screen while you scroll.
- "Minimize and Close": Easily minimize the TOC to save space or close it entirely when not needed.
- **Atlassian Theming**: Automatically adapts to Confluence's Light and Dark modes.
- **Reactivity**: Rebuilds the TOC on the fly as Confluence SPA pages update.
- **Privacy First**: Zero external network calls. All preferences are saved locally.

## Getting Started

### Chrome Web Store

NOTE: Not yet available on the Chrome Web Store. Stay tuned for updates!

Download and install from the Chrome Web Store: [Dynamic Table of Content]()

### Mozilla Firefox Add-ons

NOTE: Not yet available on the Mozilla Firefox Add-ons. Stay tuned for updates!

### Manual Installation

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

## Changelog

`v1.0.0`

- Initial release with core features.
- Supports Confluence Cloud and adapts to Light/Dark themes.

---
*Developed by Jules.*
