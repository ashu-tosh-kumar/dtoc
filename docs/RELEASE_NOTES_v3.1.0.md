# Release Notes — v3.1.0

**Release date**: 2026-11-03  
**Previous release**: [v3.0.0](../CHANGELOG.md#v300)

---

## Highlights

### 🌐 Native Wikipedia Support
Wikipedia (`wikipedia.org` and all language subdomains such as `en.wikipedia.org`) is now a natively supported site. The extension activates automatically in article view mode and uses dedicated content container selectors (`#mw-content-text .mw-parser-output`) and article title detection (`#firstHeading`). Edit mode (`?action=edit`, `?action=history`, etc.) and the Main Page are excluded automatically.

### 🔒 Privacy Compliance Hardening
External Google Fonts requests (`fonts.googleapis.com` / `fonts.gstatic.com`) have been removed from the settings popup. The extension now runs 100% locally with zero external network requests, fully honouring its privacy promise across all surfaces.

### 🛡️ Security Improvements
- **`safeQuerySelector` + `escapeSelector`**: Introduced two security helpers in `content.js`. `escapeSelector` sanitises page-controlled heading IDs before interpolation into CSS attribute selectors, preventing CSS selector injection and ReDoS. `safeQuerySelector` wraps `querySelector` to gracefully handle `DOMException` for malformed selectors while re-throwing all other errors.
- **Supply-chain hardening**: All GitHub Actions across CI, Scorecard, and Dependency Review workflows are now pinned to immutable 40-character commit SHAs.
- **ESLint in CI**: Added `eslint.config.js` and wired ESLint into the CI pipeline, enforcing `no-eval` and no-unsanitized-innerHTML rules on every pull request.

### 🎨 UI Polish
The dashed amber border shown on unsupported/experimental (Beta) sites has been replaced with a subtle solid glassmorphic accent border (`rgba(255, 153, 0, 0.5)`), consistent with the v3.0.0 glassmorphism design language.

### 📦 Store & Package Metadata
- Manifest descriptions updated across Chrome and Firefox with clear, search-friendly summaries that now mention all natively supported sites.
- `package.json` standardised with project name, MIT licence, author attribution, and keyword tags.

### 📄 Documentation & Assets
- Consolidated all AI agent instructions into a root-level `AGENTS.md` (vendor-neutral). Tool-specific adapters (`CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.continue/rules/dtoc.md`, `.github/copilot-instructions.md`) now simply point to this file.
- `docs/AGENT_TEAM.md` added, defining agent personas, the feature development cycle, and quality gate protocols.
- Web store screenshots resized to standardised 1280×800 and 1400×560 assets; GitHub social preview card added.
- Author's Dev.to article linked in `README.md`.
- `SECURITY.md` updated with direct GitHub Security Advisories link and a 48-hour response commitment.

---

## Upgrade Notes

No storage schema changes. No breaking changes to extension behaviour. Users upgrading from v3.0.0 will see:
- Wikipedia sites activate by default (same as Confluence, Dev.to, and Medium).
- The popup no longer makes external font requests (faster popup load, stricter CSP compliance).

---

## Files Changed

| Area | Files |
|------|-------|
| Core logic | `chrome-extension/content.js`, `firefox-extension/content.js` |
| Popup privacy fix | `chrome-extension/popup.html`, `firefox-extension/popup.html` |
| Manifests | `chrome-extension/manifest.json`, `firefox-extension/manifest.json` |
| CI / supply-chain | `.github/workflows/ci.yml`, `.github/workflows/scorecard.yml`, `.github/workflows/dependency-review.yml`, `eslint.config.js` |
| Security policy | `SECURITY.md` |
| Supported sites | `SUPPORTED_SITES.md` |
| AI instructions | `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.continue/rules/dtoc.md`, `.github/copilot-instructions.md` |
| Documentation | `docs/AGENT_TEAM.md` (new), `docs/ARCHITECTURE.md`, `docs/CODEBASE_MAP.md`, `docs/DEVELOPMENT_GUIDE.md`, `CHANGELOG.md`, `README.md` |
| Assets | `images/` (new screenshots, social preview) |
