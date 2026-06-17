# Chrome Web Store Listing Metadata (v3.0.0)

This file contains the centralized metadata for the Chrome Web Store listing of `dtoc`. Use this content to update the store listing when publishing version 3.0.0.

---

## 1. Extension Title / Name

* **Field Limit**: 45 characters
* **Proposed Value**: `dtoc - Dynamic Table of Contents` (32 characters)

---

## 2. Single Purpose Description (Summary)

* **Field Limit**: 132 characters (Plain text, no markdown)
* **Proposed Value**:

```text
Generate a floating, sticky Table of Contents on Confluence, Medium, Dev.to, and any website for seamless document navigation.
```

* **Character Count**: 127 characters

---

## 3. Detailed Description

* **Field Limit**: 16,000 characters (Plain text, carriage returns, and emojis/special characters allowed. No Markdown formatting or HTML links.)
* **Proposed Value**:

```text
dtoc: Dynamic Table of Contents & document outline sidebar.
Effortlessly navigate long articles, wikis, technical blogs, and documentation on any website.

Tired of scrolling back and forth on long Confluence pages, lengthy DEV.to guides, or detailed Medium articles? dtoc is a lightweight, privacy-first browser extension that automatically parses page headings (H1–H6) to build a beautiful, floating Table of Contents outline sidebar.

Whether you are a developer reviewing technical documentation, a researcher reading deep-dive articles, or a project manager navigating Confluence wiki spaces, dtoc keeps you oriented and saves you hours of scroll fatigue.

*** WHAT'S NEW IN V3.0.0 ***
• Modern Glassmorphism Drawer: Overhauled the layout into a sleek, non-intrusive hover-to-expand drawer that peek-slides when you hover near the screen edge.
• Passive Notch Indicator: Flushed perfectly to the edge of the viewport, minimized notch markers act as a visual heatmap of heading levels and document density.
• Smart Auto-Theme Detection: Intelligently analyzes page background/text colors and detects Dark Reader overrides to seamlessly match the website's theme (Light, Dark, or Auto).
• Dynamic Vertical Centering: Aligns the notches stack dynamically to the first heading/page title, preventing layout jumps during panel expansion.
• Compact Scrollable Layout: Constrained height to a compact 480px, enabling independent vertical scrolling for both the notch-strip and the expanded panel.
• Active Heading Autocentering: The active heading notch automatically centers in the minimized notch stack as you scroll through the page.

*** KEY FEATURES ***
• Zero-Setup Automatic Outlines: Automatically detects document structures and compiles a nested, interactive sidebar on Confluence, DEV Community, and Medium (including custom-domain publications).
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

*** PERMISSIONS EXPLAINED ***
• "Read and change your data on all websites": Required to run the content script that parses heading tags and renders the floating outline overlay on supported and user-enabled pages.
• "storage": Required to persist user preferences (TOC position, closed/minimized state, per-site overrides) locally.
• "activeTab": Used to safely check the current tab's hostname in the settings popup, allowing you to customize settings for the active site or request support.
```

---

## 4. Developer Console Justifications

### Storage Justification

```text
Used to save user preferences locally on their machine — such as TOC position (left/right), minimized/closed state, and site-specific overrides. No user data or document content is ever stored or transmitted.
```

### activeTab Justification

```text
Used to retrieve the hostname of the active tab in the settings popup window. This allows users to configure per-site preferences (enable/disable TOC or position overrides) and enables the "Request Support" feature to prefill the current domain name.
```

### Host Permission (http://*/* and https://*/*) Justification

```text
Required to run the content script on websites where the Table of Contents outline is generated. This allows native support for Confluence, Medium, and DEV.to, as well as universal support allowing users to manually enable the sidebar on any webpage they visit.
```

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
