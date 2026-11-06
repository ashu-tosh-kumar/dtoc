# Microsoft Edge Add-ons Listing Metadata (v3.1.0)

This file contains the centralized metadata for the Microsoft Edge Add-ons Store listing of `dtoc`. Use this content to update the store listing when publishing version 3.1.0.

---

## 1. Extension Title / Name

* **Field Limit**: 45 characters
* **Proposed Value**: `dtoc - Dynamic Table of Contents` (32 characters)
* **Official Homepage / Website**: `https://uncommonlydone.com/tools/dtoc`

---

## 2. Short Description

* **Field Limit**: 132 characters (Plain text, no markdown)
* **Proposed Value**:

```text
Generate a floating, sticky Table of Contents on Confluence, Wikipedia, Medium, Dev.to, and any website for seamless document navigation.
```

* **Character Count**: 130 characters

---

## 3. Detailed Description

* **Field Limit**: 10,000 characters (Plain text, carriage returns, and emojis/special characters allowed. No Markdown formatting or HTML links.)
* **Proposed Value**:

```text
dtoc: Dynamic Table of Contents & document outline sidebar.
Effortlessly navigate long articles, wikis, technical blogs, and documentation on any website.

Tired of scrolling back and forth on long Confluence pages, lengthy DEV.to guides, or detailed Medium articles? dtoc is a lightweight, privacy-first browser extension that automatically parses page headings (H1–H6) to build a beautiful, floating Table of Contents outline sidebar.

Whether you are a developer reviewing technical documentation, a researcher reading deep-dive articles, or a project manager navigating Confluence wiki spaces, dtoc keeps you oriented and saves you hours of scroll fatigue.

*** WHAT'S NEW IN V3.1.0 ***
• Native Wikipedia Support: Wikipedia (wikipedia.org and all language subdomains) is now natively supported out of the box — no Beta toggle required.
• Privacy Hardening: Removed external Google Fonts requests from the settings popup, guaranteeing 100% local-only, zero-network operation across all surfaces.
• Security Hardening: Introduced safe DOM query helpers (escapeSelector + safeQuerySelector) to prevent CSS selector injection and ReDoS from page-controlled heading IDs. GitHub Actions supply-chain fully pinned to immutable commit SHAs.
• UI Polish: Replaced dashed border on experimental sites with a subtle solid glassmorphic accent border, consistent with the v3.0.0 drawer design.

*** KEY FEATURES ***
• Zero-Setup Automatic Outlines: Automatically detects document structures and compiles a nested, interactive sidebar on Confluence, Wikipedia, DEV Community, and Medium (including custom-domain publications).
• Universal Site Toggle (Beta): Use the quick-toggle in the extension popup to instantly enable dtoc on ANY website or blog.
• Sticky & Floating Sidebar: Remains fixed to the side of your viewport, giving you instant navigation access with a single click.
• Left/Right Position Control: Customize your preferred dock position (left or right side of the screen) globally or per-hostname.
• Article Title Navigation: Click the top article header in the TOC to immediately return to the absolute top of the page.
• SPA Compatibility: Fully supports Single Page Applications (like Confluence and Medium) by automatically rebuilding the heading tree on dynamic content updates without a reload.
• Minimizable and Closable: Hide the panel or collapse it into passive notches for a completely distraction-free reading experience.

*** TECHNICAL SPECS (For AI Agents & Developers) ***
• Architecture: Strict Manifest V3 implementation with zero background script/service worker memory overhead.
• Style Isolation: Uses shadow DOM encapsulation to prevent target page CSS styles from breaking the TOC UI.
• Performance: Lightweight parsing engine finishes DOM indexing in under 1 second.
• Safety Hardened: Built-in DOM DoS and ReDoS mitigations (500-character constraints on extracted nodes).

*** PRIVACY & SECURITY ***
We take your privacy seriously. dtoc is 100% local-only and offline-first:
• Zero external network calls (no analytics, no telemetry, no tracking).
• Extension data and preferences are saved exclusively in your local browser storage.
• Strict Content Security Policy (CSP).
```

---

## 4. Search Terms (Keywords)

* **Limits**: Up to 7 search terms, maximum 30 characters each.
* **Proposed Search Terms**:
  1. `confluence toc` (14 chars)
  2. `table of contents` (17 chars)
  3. `confluence navigation` (21 chars)
  4. `dynamic table of content` (24 chars)
  5. `document navigator` (18 chars)
  6. `toc` (3 chars)
  7. `sticky toc` (10 chars)

---

## 5. Testing Instructions (Reviewer Notes)

```text
No login or registration is required. The extension is entirely local, offline-first, and supports navigation on any website.

To test the extension:
1. Navigate to any website containing headings (H1–H6), such as:
   - A public article on Wikipedia, DEV.to, or Medium (where it will generate the outline automatically).
   - Our pre-configured public Confluence test page: https://chauhanshilpa602.atlassian.net/wiki/external/ZTUwMWMzZDYxMjk5NDcxYTgxMWQzMTdlNzc1NTFmMTc
   - Literally any other blog or documentation page.
2. If testing on a non-natively supported website, open the extension settings popup and click the "Enable on this site" toggle (Beta feature) to generate the sidebar.
3. Once loaded, you will see a minimized visual notch strip on the right side of the page (or left, depending on your preferences). Hovering over it will reveal the glassmorphism Table of Contents drawer.
4. Click any heading inside the drawer to verify smooth scroll navigation.
5. Use the settings popup (by clicking the extension icon) to customize the sidebar position (Left vs. Right) or theme options (Light, Dark, or Auto).
```
