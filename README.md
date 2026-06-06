# DTOC

Dynamic Table of Content.

This extension automatically generates a non-intrusive, sticky Table of Contents, allowing you to quickly navigate long documents without losing your reading context.

<https://github.com/user-attachments/assets/958a6e77-acb1-443f-86c2-ed6ab4300a0b>

Watch on YouTube: <https://www.youtube.com/watch?v=fk5zKwXVzYk>

For a full list of natively supported websites (including Confluence, DEV Community, Medium, and various popular custom-domain Medium publications), please see [SUPPORTED_SITES.md](SUPPORTED_SITES.md).

Supported Browsers:

- Chrome and all Chromium-based browsers (Edge, Brave, Arc, etc.)
- Mozilla Firefox and Firefox based browsers like Zen browser

## Features

- **Automatic Parsing**: Detects headings (`H1-H6`) and builds a nested TOC.
- **Page Title Navigation**: Prepends the page or article title at the top of the TOC for quick navigation back to the top of the document.
- **Floating UI**: Stays pinned to the side of your screen while you scroll.
- "Minimize and Close": Easily minimize the TOC to save space or close it entirely when not needed.
- **Atlassian Theming**: Automatically adapts to Confluence's Light and Dark modes.
- **Reactivity**: Rebuilds the TOC on the fly as Confluence SPA pages update.
- **Privacy First**: Zero external network calls. All preferences are saved locally.
- **Request Website Support**: A built-in Google form link to request support for websites, pre-filled with the hostname (the extension still doesn't make any external API calls by itself).

## Privacy & Security

We take your data seriously. For detailed information, please see our:

- [Privacy Policy](PRIVACY.md)
- [Security Policy](SECURITY.md)

## Getting Started

### Chrome Web Store

Download and install from Chrome Web Store: [Dynamic Table of Content](https://chromewebstore.google.com/detail/dtoc/iikddlbkfdmlbhlfhgdkoebpimljflfl?authuser=0&hl=en)

### Microsoft Edge Add-ons

Download and install from Microsoft Edge Add-ons: [Dynamic Table of Content](https://microsoftedge.microsoft.com/addons/detail/dtoc/kibljloiohjclbilhjmlfmahhdionhgc)

### Mozilla Firefox Add-ons

Download and install from Mozilla Firefox Add-ons: [Dynamic Table of Content](https://addons.mozilla.org/en-US/firefox/addon/dtoc/)

### Manual Installation

To install the extension manually from source:

1. Clone or download this repository.
2. Open Chrome (or any Chromium-based browser like Edge, Brave, Arc) and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the folder containing this repository.
5. The extension will now automatically run on supported websites.

## Development & Testing

This project is built using Vanilla JavaScript, HTML, and CSS. No build step is required to run the extension.

To run the unit tests:

1. Install dependencies: `npm install`
2. Run tests: `npm test`

## Changelog

`v2.0.0`

- Added experimental support (Beta) for all websites using generic HTML semantic selectors.
- Overhauled the extension popup UI with split settings (Global vs. Site-Specific status toggles and TOC position settings).
- Added "Reset Site Settings" and "Reset All Settings" buttons in the popup, with the "Reset Site Settings" button dynamically disabled when no site-specific settings are configured.
- Added native support for DEV Community (`dev.to`).
- Added native support for Medium (`medium.com` and subdomains) as well as common custom-domain Medium publications (e.g., `levelup.gitconnected.com`, `python.plainenglish.io`).
- Added a dynamic page/article title heading at the top of the Table of Contents for quick navigation back to the top of the page.

`v1.1.0`

- Added ability to request support for new websites directly from the extension popup (links to a Google Form).
- Extracted hostname is passed to the Form to maintain user privacy.
- Displays Open Source text in the extension popup footer.

`v1.0.0`

- Initial release with core features.
- Supports Confluence Cloud and adapts to Light/Dark themes.

## Credits

Icons are provided by [FontAwesome](https://fontawesome.com/) and are licensed under the FontAwesome Free License ([https://fontawesome.com/license/free](https://fontawesome.com/license/free)). The specific icon used is the "folder-tree" solid icon.

---

- *Developed by Jules using `prd.md`.*
- *Security hardening reviewed by Qodo and implemented by Gemini CLI.*
- *Split settings architecture, generic cross-website support, and E2E automation
  developed by Google Antigravity 2.0.*
- Agentic workflow files added by GitHub Copilot with thorough review and grounding done
  by Google Antigravity 2.0.
