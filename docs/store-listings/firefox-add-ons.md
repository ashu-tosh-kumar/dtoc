# Mozilla Firefox Add-ons Listing Metadata (v3.0.0)

This file contains the centralized metadata for the Mozilla Firefox Add-ons (AMO) Store listing of `dtoc`. Use this content to update the store listing when publishing version 3.0.0.

---

## 1. Summary

* **Field Limit**: 250 characters (Plain text)
* **Proposed Value**:

```text
Generate a floating, interactive Table of Contents outline on Confluence Cloud, Medium, Dev.to, and any website. Effortlessly navigate long articles, wikis, and documentation with smart theme detection, glassmorphism UI, and zero tracking.
```

* **Character Count**: 240 characters

---

## 2. Detailed Description

* **Field Limit**: 10,000 characters (Supports Markdown formatting: bold, italic, code blocks, lists, and links. HTML is not supported.)
* **Proposed Value**:

```markdown
### **dtoc** — Dynamic Table of Contents & Outline Sidebar
Effortlessly navigate long articles, wikis, technical blogs, and documentation on any website.

Tired of scrolling back and forth on long Confluence pages, DEV.to guides, or Medium articles? **dtoc** is a lightweight, privacy-first browser extension that automatically parses page headings (`H1`–`H6`) to build a beautiful, floating Table of Contents outline sidebar.

Whether you are a developer reviewing technical documentation, a researcher reading deep-dive articles, or a project manager navigating Confluence wiki spaces, **dtoc** keeps you oriented and saves you hours of scroll fatigue.

---

### 🚀 **What's New in v3.0.0**
*   **Modern Glassmorphism Drawer**: Overhauled the layout into a sleek, non-intrusive hover-to-expand drawer that peek-slides when you hover near the screen edge.
*   **Passive Notch Indicator**: Flushed perfectly to the edge of the viewport, minimized notch markers act as a visual heatmap of heading levels and document density.
*   **Smart Auto-Theme Detection**: Intelligently analyzes page background/text colors and detects Dark Reader overrides to seamlessly match the website's theme (Light, Dark, or Auto).
*   **Dynamic Vertical Centering**: Aligns the notches stack dynamically to the first heading or page title, preventing layout jumps during panel expansion.
*   **Compact Scrollable Layout**: Constrained height to a compact 480px, enabling independent vertical scrolling for both the notch-strip and the expanded panel.
*   **Active Heading Autocentering**: The active heading notch automatically centers in the minimized notch stack as you scroll through the page.

---

### ✨ **Key Features**
*   **Zero-Setup Automatic Outlines**: Automatically detects document structures and compiles a nested, interactive sidebar on Confluence, DEV Community, and Medium (including custom-domain publications).
*   **Universal Site Toggle (Beta)**: Use the quick-toggle in the extension popup to instantly enable **dtoc** on *any* website or blog.
*   **Sticky & Floating Sidebar**: Remains fixed to the side of your viewport, giving you instant navigation access with a single click.
*   **Left/Right Position Control**: Customize your preferred dock position (left or right side of the screen) globally or per-hostname.
*   **Article Title Navigation**: Click the top article header in the TOC to immediately return to the absolute top of the page.
*   **SPA Compatibility**: Fully supports Single Page Applications (like Confluence and Medium) by automatically rebuilding the heading tree on dynamic content updates without a reload.
*   **Minimizable and Closable**: Hide the panel or collapse it into passive notches for a completely distraction-free reading experience.

---

### 🛠️ **Technical Specifications (For AI Agents & Developers)**
*   **Architecture**: Strict Manifest V3 implementation with zero background script/service worker memory overhead.
*   **Style Isolation**: Uses Shadow DOM encapsulation to prevent target page CSS styles from breaking the TOC UI.
*   **Performance**: Lightweight parsing engine finishes DOM indexing in under 1 second.
*   **Safety Hardened**: Built-in DOM DoS and ReDoS mitigations (500-character constraints on extracted nodes).

---

### 🛡️ **Privacy & Security**
We take your privacy seriously. **dtoc** is 100% local-only and offline-first:
*   **Zero external network calls** (no analytics, no telemetry, no tracking).
*   Extension data and preferences are saved exclusively in your local browser storage.
*   Strict Content Security Policy (CSP).

---

### ℹ️ **Permissions Explained**
*   `Read and change your data on all websites`: Required to run the content script that parses heading tags and renders the floating outline overlay on supported and user-enabled pages.
*   `storage`: Required to persist user preferences (TOC position, closed/minimized state, per-site overrides) locally.
*   `activeTab`: Used to safely check the current tab's hostname in the settings popup, allowing you to customize settings for the active site or request support.

---

### 🔗 **Links & Support**
*   [GitHub Repository](https://github.com/ashu-tosh-kumar/dtoc)
*   [YouTube Video Showcase](https://www.youtube.com/watch?v=fk5zKwXVzYk)
```

---

## 3. Whiteboard (Notes for Reviewers)

```text
The add-on is entirely local, offline-first, contains no remote data gathering or third-party integrations, and works on any website.

Links and references:
- GitHub Repository: https://github.com/ashu-tosh-kumar/dtoc
- Showcase/Walkthrough Video: https://www.youtube.com/watch?v=fk5zKwXVzYk
- Public Testing Page (Confluence - no login required):
  https://chauhanshilpa602.atlassian.net/wiki/external/ZTUwMWMzZDYxMjk5NDcxYTgxMWQzMTdlNzc1NTFmMTc

Testing Steps:
1. Load the extension in Firefox.
2. Navigate to any website containing headings (e.g. Wikipedia, a blog, or our pre-configured public Confluence test page above).
3. If the website is not natively supported (like Wikipedia), open the settings popup and toggle the "Enable on this site" option.
4. Verify the minimized notch strip appears on the edge of the viewport and hover over it to expand the glassmorphism Table of Contents drawer.
5. Click links inside the drawer to verify smooth scrolling.
6. Open the settings popup to test position toggling (Left vs. Right) and theme selections.
```
