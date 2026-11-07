# Changelog

All notable changes to this project will be documented in this file.

## [v3.2.0] - 2026-11-07

- **Adjustable TOC Dimensions & Typography**: Made the open TOC dialog dimensions and text size fully adjustable. Users can interactively drag horizontal, vertical, and corner resize handles on the open TOC overlay, with double-click reset to defaults.
- **Popup Dimension & Font Size Controls**: Added interactive slider controls and inline reset buttons in the extension popup for TOC Width (200px–600px, default: 300px), TOC Height (200px–800px, default: 480px), and Text Size (11px–20px, default: 14px), with global settings and per-site override support.
- **Dynamic Text Wrap & Responsive Header**: Heading links wrap cleanly across multiple lines without overflowing boundaries (`white-space: normal`, `overflow-wrap: break-word`). The TOC header title dynamically adapts, displaying compact "TOC" / "TOC (Beta)" on narrow drawer widths and full "Table of Contents" / "Table of Contents (Beta)" on wider layouts.
- **Pinning & Live Drag Interaction**: Preserved pinned state behavior during live drag-resizing, enabling responsive edge drag-resize while pinned.
- **Extension Context Invalidation Guard**: Added runtime guards to safely handle extension context invalidation errors during extension updates.
- **Customer-Led Store Listings & Documentation**: Overhauled `README.md` and store listings across Chrome, Edge, and Firefox around the reader's problem, scroll fatigue, and core user workflows.
- **Official Showcase Integration**: Added official website showcase badge and homepage link pointing to `uncommonlydone.com/tools/dtoc`.
- **Standards & Relative Link Compliance**: Standardized AI, CI/CD, and badges compliance with `ai-docs`, and replaced absolute documentation links with portable relative markdown links.

## [v3.1.0] - 2026-11-03

- **Native Wikipedia Support**: Added native support for Wikipedia (`wikipedia.org` and subdomains like `en.wikipedia.org`) out of the box, with dedicated content container parsing (`#mw-content-text .mw-parser-output`) and article title detection (`#firstHeading`).
- **Privacy Compliance Hardening**: Removed external Google Fonts requests (`fonts.googleapis.com` / `fonts.gstatic.com`) from the settings popup, guaranteeing 100% local-only operation and full adherence to the zero-network-requests privacy promise.
- **Supply-Chain & CI Security**: Pinned all GitHub Actions across CI, Scorecard, and Dependency Review workflows to immutable 40-character commit SHAs.
- **Security Policy & Disclosure**: Enhanced `SECURITY.md` with direct links to GitHub Security Advisories and issue reporting for coordinated vulnerability disclosure.
- **Store & Project Metadata**: Overhauled browser extension manifest descriptions across Chrome and Firefox with clear, search-friendly summaries; standardized `package.json` and `package-lock.json` with project name, MIT license, author attribution, and tags.
- **UI Polish**: Replaced dashed border on unsupported/experimental sites with a subtle solid glassmorphic accent border (`rgba(255, 153, 0, 0.5)`).
- **Documentation & Assets**: Consolidated and resized web store screenshots to standardized 1280x800 and 1400x560 assets, added GitHub social preview card, and linked author's Dev.to article in `README.md`.

## [v3.0.0] - 2026-06-17

- **UI Overhaul**: Redesigned the Table of Contents layout from a solid sidebar block into a modern, non-intrusive Glassmorphism "Peek" Drawer (Hover-to-Expand Sidebar) layout.
- **Minimized Notch Indicator**: Added minimized state notches that act as a passive visual indicator of heading levels and document density, flushed perfectly to the viewport edge (left or right).
- **Dynamic Vertical Alignment**: Centers the first notch / first heading link with the page title (floating dynamically as you scroll) with no vertical jump during expansion.
- **Smart Auto Theme Detection**: Added preference-based "Smart Auto" theme detection that dynamically infers dark/light mode based on page background/text color analysis and direct detection of Dark Reader forced dark themes, in addition to manual light and dark theme toggles.
- **Compact Maximum Height**: Constrained the maximum TOC height to a compact 480px with vertical scroll support inside both the notches strip and the expanded TOC panel for long documents.
- **Active Heading Auto-Centering**: Active heading notches now auto-scroll to the center of the minimized notch stack as you scroll through the page.
- **Scoped States**: Scoped minimized/pinned/closed states to site-specific configs when "Only for" site-specific override is active.
- **Security Hardening**: Hardened extension security against DOM-based Denial of Service (DoS) and Regular Expression Denial of Service (ReDoS) by enforcing a 500-character length limit on extracted page titles and heading texts.
- **Accessibility Enhancements**: Improved keyboard and screen-reader accessibility in the extension settings popup with clear focus indicator rings (`:focus-visible`), interactive `aria-pressed` states, standard ARIA roles, and semantic labels.
- **Page Jump & Auto-Scroll Fixes**: Resolved page jumps during load/reload by clearing `dtoc-` prefixed fragment hashes from the URL on init. Constrained elements auto-scrolling during scroll-spy activation to their local scroll container boundary, preventing page scroll pollution.
- **Disabled Sites Fix**: Prevented initialization of the UI and observers on disabled websites to avoid unnecessary background processing.
- **Rebranding & Fresh Iconography**: Rebranded the extension with a new logo and iconography, standardizing browser icons and cleaning up deprecated theme-specific icon resources.
- **Documentation & Assets Centralization**: Re-organized documentation by splitting the changelog and credits into dedicated files, and added central store listings (Chrome Web Store, Firefox Add-ons, Edge Add-ons) and screenshots.

## [v2.0.0] - 2026-06-17

- **Generic Selector Support**: Added experimental support (Beta) for all websites using generic HTML semantic selectors.
- **Popup Settings UI**: Overhauled the extension popup UI with split settings (Global vs. Site-Specific status toggles and TOC position settings).
- **Settings Resets**: Added "Reset Site Settings" and "Reset All Settings" buttons in the popup, with the "Reset Site Settings" button dynamically disabled when no site-specific settings are configured.
- **DEV Community Native Support**: Added native support for DEV Community (`dev.to`).
- **Medium Native Support**: Added native support for Medium (`medium.com` and subdomains) as well as common custom-domain Medium publications (e.g., `levelup.gitconnected.com`, `python.plainenglish.io`).
- **TOC Header Navigation**: Added a dynamic page/article title heading at the top of the Table of Contents for quick navigation back to the top of the page.
- **Brand Identity**: Rebranded the extension icon.

## [v1.1.0] - 2026-06-17

- **Website Support Request**: Added ability to request support for new websites directly from the extension popup (links to a Google Form).
- **Privacy Preservation**: Extracted hostname is passed to the Form to maintain user privacy.
- **Footer Attribution**: Displays Open Source text in the extension popup footer.

## [v1.0.0] - 2026-06-17

- **Initial Release**: Supports Confluence Cloud and adapts to Light/Dark themes.
