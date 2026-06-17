# Changelog

All notable changes to this project will be documented in this file.

## [v3.0.0] - 2026-06-17

- **UI Overhaul**: Redesigned the Table of Contents layout from a solid sidebar block into a modern, non-intrusive Glassmorphism "Peek" Drawer (Hover-to-Expand Sidebar) layout.
- **Minimized Notch Indicator**: Added minimized state notches that act as a passive visual indicator of heading levels and document density, flushed perfectly to the viewport edge (left or right).
- **Dynamic Vertical Alignment**: Centers the first notch / first heading link with the page title (floating dynamically as you scroll) with no vertical jump during expansion.
- **Smart Auto Theme Detection**: Added preference-based "Smart Auto" theme detection that dynamically infers dark/light mode based on page background/text color analysis and direct detection of Dark Reader forced dark themes, in addition to manual light and dark theme toggles.
- **Compact Maximum Height**: Constrained the maximum TOC height to a compact 480px with vertical scroll support inside both the notches strip and the expanded TOC panel for long documents.
- **Active Heading Auto-Centering**: Active heading notches now auto-scroll to the center of the minimized notch stack as you scroll through the page.
- **Scoped States**: Scoped minimized/pinned/closed states to site-specific configs when "Only for" site-specific override is active.
- **Security Hardening**: Hardened extension security against DOM-based Denial of Service (DoS) and Regular Expression Denial of Service (ReDoS) by enforcing a 500-character length limit on extracted page titles and heading texts.

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
