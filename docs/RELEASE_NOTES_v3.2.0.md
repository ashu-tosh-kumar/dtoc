# Release Notes — v3.2.0

**Release date**: 2026-11-07  
**Previous release**: [v3.1.0](RELEASE_NOTES_v3.1.0.md)

---

## Highlights

### 📏 Adjustable TOC Dimensions & Typography
Users can now dynamically resize the open Table of Contents overlay and fine-tune typography to match their reading preferences and display scales:
- **Interactive Drag Resize Handles**: Added horizontal, vertical, and corner resize handles on the open TOC drawer with real-time responsive edge tracking.
- **Double-Click Reset**: Double-clicking any resize handle instantly resets the dimension back to its default value (300px width, 480px height).
- **Popup Settings Controls**: Added interactive range sliders and inline reset buttons in the popup menu for:
  - **TOC Width**: 200px – 600px (default: 300px)
  - **TOC Height**: 200px – 800px (default: 480px)
  - **Text Size**: 11px – 20px (default: 14px)
- **Global & Per-Site Overrides**: Adjust dimensions globally or customize them for specific domains (with automatic fallback to global settings).

### 🔤 Dynamic Text Wrap & Responsive Header Title
- **Clean Text Wrapping**: Headings wrap dynamically within their outline containers (`white-space: normal`, `overflow-wrap: break-word`, `word-break: break-word`), ensuring full readability even on narrow drawer configurations.
- **Responsive Header**: The outline header title automatically displays an abbreviated title ("TOC" / "TOC (Beta)") when dialog width is compact, and expands to "Table of Contents" / "Table of Contents (Beta)" on wider layouts.

### 📌 Pinning & Live Resize Coexistence
- The pinned state is fully preserved during live drag-resizing, allowing users to dock the outline and adjust dimensions simultaneously without losing position or focus.

### 🛡️ Extension Context Invalidation Resilience
- Content script listeners and storage updates are guarded against browser extension context invalidation errors during background reloads and updates.

### 📖 Customer-Led Documentation & Store Listings
- Rewrote `README.md` and store listings across Chrome Web Store, Mozilla Firefox Add-ons, and Microsoft Edge Add-ons around the reader's problem ("Never get lost in a long web page again"), addressing scroll fatigue and specific workflows for engineers, students, and writers.

### 🌐 Official Showcase Integration
- Added official showcase badge and direct homepage link to [`uncommonlydone.com/tools/dtoc`](https://uncommonlydone.com/tools/dtoc) with interactive walkthroughs and guides.

### 🤖 Standards & Relative Link Compliance
- Standardized AI, CI/CD, and badges compliance with `ai-docs`.
- Replaced all absolute documentation links with portable relative markdown links across docs and agent persona definitions.

---

## Upgrade Notes

- **Storage Schema**: Added `width`, `height`, and `fontSize` to root settings and `siteSettings[domain]` entries in `chrome.storage.local` / `browser.storage.local`.
- **Backward Compatibility**: Fully backward-compatible. Existing settings remain intact; missing dimension values automatically fall back to standard defaults (300px width, 480px height, 14px font size).
- **No Breaking Changes**: Upgrading from v3.1.0 is seamless and requires no migration steps.

---

## Files Changed

| Area | Files |
|------|-------|
| Core logic & overlay | `chrome-extension/content.js`, `chrome-extension/content.css`, `firefox-extension/content.js`, `firefox-extension/content.css` |
| Popup settings & controls | `chrome-extension/popup.html`, `chrome-extension/popup.js`, `chrome-extension/popup.css`, `firefox-extension/popup.html`, `firefox-extension/popup.js`, `firefox-extension/popup.css` |
| Manifests | `chrome-extension/manifest.json`, `firefox-extension/manifest.json` |
| Package & dependencies | `package.json`, `package-lock.json` |
| Architecture & Docs | `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_GUIDE.md`, `docs/CODEBASE_MAP.md`, `README.md`, `CHANGELOG.md`, `SECURITY.md` |
| Store listings | `docs/store-listings/chrome-web-store.md`, `docs/store-listings/edge-add-ons.md`, `docs/store-listings/firefox-add-ons.md`, `docs/store-listings/youtube-showcase.md` |
| Automated tests | `tests/unit/test.js` |
