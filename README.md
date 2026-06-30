<p align="center">
  <a href="https://github.com/ashu-tosh-kumar/dtoc" target="_blank" rel="noreferrer noopener">
    <img width="160" alt="dtoc logo" src="images/icon512.png">
  </a>
</p>
<p align="center">dtoc <strong>automatically parses</strong> web pages and generates a <strong>modern, interactive Table of Contents</strong> to navigate long documents effortlessly.</p>
<br/>
<p align="center">
  <a rel="noreferrer noopener" href="https://chromewebstore.google.com/detail/dtoc/iikddlbkfdmlbhlfhgdkoebpimljflfl"><img alt="Chrome Web Store" src="https://img.shields.io/badge/Chrome-141e24.svg?&style=for-the-badge&logo=google-chrome&logoColor=white"></a>
  <a rel="noreferrer noopener" href="https://addons.mozilla.org/firefox/addon/dtoc/"><img alt="Firefox Add-ons" src="https://img.shields.io/badge/Firefox-141e24.svg?&style=for-the-badge&logo=firefox-browser&logoColor=white"></a>
  <a rel="noreferrer noopener" href="https://microsoftedge.microsoft.com/addons/detail/dtoc/kibljloiohjclbilhjmlfmahhdionhgc"><img alt="Edge Addons" src="https://img.shields.io/badge/Edge-141e24.svg?&style=for-the-badge"></a>
</p>

<p align="center">
  <a href="https://chromewebstore.google.com/detail/dtoc/iikddlbkfdmlbhlfhgdkoebpimljflfl"><img alt="Chrome Web Store Version" src="https://img.shields.io/chrome-web-store/v/iikddlbkfdmlbhlfhgdkoebpimljflfl?style=flat-square&label=chrome"></a>
  <a href="https://chromewebstore.google.com/detail/dtoc/iikddlbkfdmlbhlfhgdkoebpimljflfl"><img alt="Chrome Web Store Users" src="https://img.shields.io/chrome-web-store/users/iikddlbkfdmlbhlfhgdkoebpimljflfl?style=flat-square&label=users"></a>
  <a href="https://chromewebstore.google.com/detail/dtoc/iikddlbkfdmlbhlfhgdkoebpimljflfl"><img alt="Chrome Web Store Rating" src="https://img.shields.io/chrome-web-store/rating/iikddlbkfdmlbhlfhgdkoebpimljflfl?style=flat-square&label=rating"></a>
  <a href="https://addons.mozilla.org/firefox/addon/dtoc/"><img alt="Firefox Add-on Version" src="https://img.shields.io/amo/v/dtoc?style=flat-square&label=firefox"></a>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/github/license/ashu-tosh-kumar/dtoc?style=flat-square&color=blue"></a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/ashu-tosh-kumar/dtoc"><img alt="OpenSSF Scorecard" src="https://img.shields.io/ossf-scorecard/github.com/ashu-tosh-kumar/dtoc?style=flat-square&label=openssf%20scorecard"></a>
</p>
<!-- OpenSSF Best Practices: register this repo at https://www.bestpractices.dev/en/projects/new then add: <a href="https://www.bestpractices.dev/projects/PROJECT_ID"><img alt="OpenSSF Best Practices" src="https://www.bestpractices.dev/projects/PROJECT_ID/badge"></a> -->

<h2 align="center">Dynamic Table of Content</h2>
<br/>
<p align="center">dtoc is an <strong>open-source</strong> MIT-licensed <strong>browser extension</strong> designed to automatically parse web pages and generate a sticky, interactive Table of Contents. Adaptively rendering on top of your reading material, dtoc features a modern hover-to-expand glassmorphic drawer layout, minimized state notch indicators for visual document density, preference-based smart light/dark theme detection, and site-specific overrides to deliver an exceptional reading and navigation experience.</p>
<br/>
<br/>

## Demo


https://github.com/user-attachments/assets/3bc4657b-85db-49a9-8c17-e88ca9299e76


*Watch the walkthrough on [YouTube](https://youtu.be/-vvvjiyMUjQ).*

## Features

- **Hover-to-Expand "Peek" Drawer**: Overhauled in `v3.0.0` from a solid block sidebar into a modern, non-intrusive Glassmorphism Drawer that expands when hovered and tucks away cleanly to save viewport space.
- **Minimized Notch Indicator**: Flushed to the viewport edge (left or right), these interactive state notches serve as a passive visual indicator of heading levels and document density.
- **Dynamic Vertical Alignment**: Centers the first notch / first heading link dynamically with the page title as you scroll, avoiding vertical jumps during expansion.
- **Smart Auto Theme Detection**: Automatically infers light or dark mode based on actual page background/text color analysis and direct detection of Dark Reader forced dark themes, with options to toggle light/dark manually.
- **Broad Compatibility & Site-Specific Scopes**: Built-in native optimization for **Confluence Cloud**, **DEV Community**, **Medium**, and custom Medium publications, plus a generic HTML semantic parser (Beta) to support any website. Position settings (left/right) and pinned/minimized/closed states can be configured globally or per-site.
- **Max Height & Internal Scrolling**: Constrained to a compact 480px maximum height with scroll support within both the notches strip and the expanded TOC panel for longer documents.
- **Security & Privacy First**: Zero external network requests. Hardened against DOM-based Denial of Service (DoS) and ReDoS by enforcing a 500-character length limit on extracted heading texts. All preferences are saved locally in browser storage.
- **Support Request Form**: A privacy-friendly link to request native support for new hostnames, pre-filled with the hostname (the extension itself does not make any external API calls).

## Documentation & Policies

We take security and user privacy seriously:

- [Privacy Policy](PRIVACY.md)
- [Security Policy](SECURITY.md)
- [Natively Supported Sites](SUPPORTED_SITES.md)
- [Changelog](CHANGELOG.md)
- [Credits & Design Inspiration](CREDITS.md)

## Manual Installation

To install the extension manually from source for development:

1. Clone or download this repository.
2. Open Chrome (or any Chromium-based browser like Edge, Brave, Arc) and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the `chrome-extension` directory of this repository.
5. (Optional) For Firefox, navigate to `about:debugging`, click **This Firefox**, select **Load Temporary Add-on...**, and select the `firefox-extension/manifest.json` file.

## Development & Testing

This project is built using Vanilla JavaScript, HTML, and CSS. No build step is required to run the extension.

### Setup

Install development dependencies (Jest, Playwright, web-ext):

```bash
npm install
```

### Run Unit Tests

We use Jest to run unit tests:

```bash
npm test
```

### Run End-to-End Tests

We use Playwright to run E2E browser tests:

```bash
# Install required browser binaries if not already installed
npx playwright install chromium

# Run the E2E tests
npm run test:e2e
```

### Build Distribution Packages

To build the distribution ZIP files for release:

```bash
npm run build
```

This script packages Chrome and Firefox extensions separately into their respective `web-ext-artifacts/` subdirectories. For more details on the codebase and release process, see the [Development Guide](docs/DEVELOPMENT_GUIDE.md).
