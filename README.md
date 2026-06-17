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

`v3.0.0`

- Overhauled the Table of Contents layout from a solid sidebar block into a modern, non-intrusive Glassmorphism "Peek" Drawer (Hover-to-Expand Sidebar) layout.
- Added minimized state notches that act as a passive visual indicator of heading levels and document density, flushed perfectly to the viewport edge (left or right).
- Added dynamic vertical alignment that centers the first notch / first heading link with the page title (floating dynamically as you scroll) with no vertical jump during expansion.
- Added preference-based "Smart Auto" theme detection that dynamically infers dark/light mode based on page background/text color analysis and direct detection of Dark Reader forced dark themes, in addition to manual light and dark theme toggles.
- Constrained the maximum TOC height to a compact 480px with vertical scroll support inside both the notches strip and the expanded TOC panel for long documents.
- Active heading notches now auto-scroll to the center of the minimized notch stack as you scroll through the page.
- Scoped minimized/pinned/closed states to site-specific configs when "Only for" site-specific override is active.
- Hardened extension security against DOM-based Denial of Service (DoS) and Regular Expression Denial of Service (ReDoS) by enforcing a 500-character length limit on extracted page titles and heading texts.

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

- *Initial PRD written using [Microsoft CoPilot](https://copilot.microsoft.com/)*.
- *Initially developed by [Google Jules](https://jules.google/) using [docs/PRD.md](docs/PRD.md).*
- *Further development, testing, and maintenance by  [Google Antigravity](https://antigravity.google/).*
- *Security hardening reviewed by [Qodo](https://marketplace.visualstudio.com/items?itemName=Codium.codium) in [VS Code](https://code.visualstudio.com/) and implemented by [Gemini CLI](https://geminicli.com/).*
- *Icons are provided by [FontAwesome](https://fontawesome.com/) and are licensed under
the FontAwesome [Free License](https://fontawesome.com/license/free)). The specific
  icon used is influenced by `folder-tree` solid icon.*
- *Agentic workflow files added by [GitHub Copilot](https://github.com/features/copilot) with thorough review and grounding done
  by Google Antigravity.*
- *[From `v2.0.0`] onwards, Extension popup global vs site-specific settings UI/UX inspired by [Dark Reader](https://darkreader.org/)'s
  browser extension.*
- *[From `v3.0.0`] onwards, Extension UI inspired by [Notion](https://www.notion.com/)'s
  Dynamic TOC.*
