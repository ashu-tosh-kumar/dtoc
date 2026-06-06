We used Microsoft CoPilot to build a PRD based on initial requirements that we shared with it. And then used the PRD with Jules to build the extension. Documenting the PRD here for reference and learning.

----

# PRD — Confluence Smart TOC Overlay Extension

## 1) Document Metadata

**Product Name:** Confluence Smart TOC Overlay  
**Document Type:** Product Requirements Document (PRD)  
**Version:** v1  
**Target Delivery:** MVP browser extension  
**Primary Platform:** Chrome Extension (Manifest V3) for Chromium-based browsers. Manifest V3 is the current Chrome extension platform model. [\[developer.chrome.com\]](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3), [\[developer.chrome.com\]](https://developer.chrome.com/docs/extensions/develop/migrate)

***

## 2) Important Notes / Assumptions

### 2.1 Chosen implementation path

**Assumption:** v1 will be built as a **browser extension**, not as an Atlassian Forge/Connect app.

**Why this is the right v1 choice**

* fastest to build and iterate,
* full control over page-side overlay UI,
* easiest way to inject a floating TOC sidebar into existing Confluence pages,
* avoids Atlassian app/module constraints for initial rollout.

### 2.2 Browser support

**In-scope for v1**

* Google Chrome
* Chromium
* Microsoft Edge
* Vivaldi
* Arc Browser

Chrome-compatible extensions are generally portable to Edge with minimal changes, and both Vivaldi and Arc support browser extensions compatible with the Chrome ecosystem. [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/port-chrome-extension), [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/microsoft-edge/extensions/), [\[help.vivaldi.com\]](https://help.vivaldi.com/desktop/appearance-customization/extensions/), [\[resources.arc.net\]](https://resources.arc.net/hc/en-us/articles/19434259167767-Extensions-in-Arc-How-to-Import-Add-Open)

### 2.3 Important correction on Zen Browser

You mentioned **Zen Browser** as a Chromium spin-off, but **Zen is Firefox-based**, not Chromium-based, per Zen’s docs. That means Zen support should be treated as a **separate Firefox-extension compatibility track**, not part of the same Chrome/Chromium extension package. [\[docs.zen-browser.app\]](https://docs.zen-browser.app/user-manual/extensions)

***

## 3) Product Summary

Build a browser extension for Confluence that automatically generates and displays a **live Table of Contents (TOC)** for the currently opened page.

The extension should:

* automatically detect and parse page headings in the background,
* generate a hierarchical TOC,
* show the TOC as a **non-intrusive overlay on the left side**,
* allow users to:
  * click items to navigate to sections,
  * minimize the overlay into a small transparent floating button,
  * close the overlay entirely,
  * manually restore the overlay after closing,
  * turn the extension on/off easily,
* automatically update the TOC when:
  * the page is refreshed,
  * the page content changes,
  * the page is updated in-place.

***

## 4) Problem Statement

Long Confluence pages are difficult to navigate because users often:

* lose awareness of where they are in the document,
* cannot quickly see the page structure,
* need to scroll extensively to jump between distant sections,
* have no persistent overview while reading or editing.

This is especially painful for:

* architecture docs,
* engineering specs,
* RFCs,
* runbooks,
* onboarding docs,
* incident retrospectives,
* product requirement docs,
* operational playbooks.

***

## 5) Product Objective

Improve navigation and orientation on long Confluence pages by adding a lightweight, persistent, dynamic TOC experience without modifying stored Confluence content.

***

## 6) Goals

### 6.1 Primary goals

* Show page structure immediately on page open.
* Make long Confluence pages easier to navigate.
* Reduce time spent scrolling or searching for sections.
* Keep the TOC UI minimal and non-intrusive.

### 6.2 Secondary goals

* Keep the TOC synchronized with content changes.
* Persist user-level UI preferences across sessions.
* Provide easy controls for open, minimize, close, restore, and global enable/disable.

***

## 7) Non-Goals (MVP)

The MVP will **not** include:

* AI-generated summaries,
* content rewriting,
* document quality suggestions,
* page editing capabilities,
* exporting TOC elsewhere,
* cross-page navigation,
* support for every exotic/custom macro layout,
* mobile browser support,
* Zen Browser support in the same build (separate Firefox-compatible version required). [\[docs.zen-browser.app\]](https://docs.zen-browser.app/user-manual/extensions)

***

## 8) Target Users

### Primary users

* software engineers,
* architects,
* tech leads,
* product managers,
* QA leads,
* SRE / operations teams,
* documentation-heavy teams.

### Typical scenarios

* reading large technical design docs,
* reviewing specs,
* navigating long postmortems,
* jumping between sections during edits,
* understanding document structure before reading deeply.

***

## 9) User Stories

### Core user stories

1. **As a user**, when I open a Confluence page, I want the extension to generate a TOC automatically so I can immediately understand the page structure.
2. **As a user**, I want the TOC displayed in a left-side overlay so I can navigate without losing context.
3. **As a user**, I want to click a TOC item to jump directly to that section.
4. **As a user**, I want the TOC to update automatically if the page is refreshed or content changes.
5. **As a user**, I want a minimize button so the overlay can shrink into a small transparent floating control.
6. **As a user**, I want a close `x` button to remove the overlay from the page.
7. **As a user**, I want a manual way to restore the overlay after I close it.
8. **As a user**, I want a simple on/off toggle so I can disable the extension without uninstalling it.

### Nice-to-have user stories

1. **As a user**, I want the current section highlighted while I scroll.
2. **As a user**, I want nested headings displayed hierarchically.
3. **As a user**, I want my preferred UI state remembered.

***

## 10) Scope

## 10.1 In scope for MVP

* Chrome extension using Manifest V3. [\[developer.chrome.com\]](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3), [\[developer.chrome.com\]](https://developer.chrome.com/docs/extensions/develop/migrate)
* Works on Confluence pages in Chromium-based browsers.
* Parses page headings (`h1` to `h6` or equivalent rendered heading structure).
* Builds hierarchical TOC.
* Left-side overlay UI.
* Click-to-scroll navigation.
* Auto-refresh TOC on:
  * page load,
  * full page refresh,
  * DOM/content changes detected after page load.
* On/off toggle.
* Minimize to transparent button.
* Close overlay.
* Manual restore control.
* Preference persistence in browser storage.
* Accessibility basics:
  * keyboard reachable controls,
  * visible focus states,
  * semantic labels.

## 10.2 Out of scope for MVP

* Firefox/Zen build
* Forge app
* AI summaries
* synced team preferences
* admin controls
* section search within TOC (optional v1.1)

***

## 11) Functional Requirements

## 11.1 Extension activation

* The extension should activate automatically on supported Confluence page URLs.
* The extension should inject its logic only on relevant page types.
* The extension should not visibly interfere with page load.

### Acceptance criteria

* Opening a supported Confluence page initializes TOC generation automatically.
* Non-Confluence pages are ignored.

***

## 11.2 Background page analysis

* On page load/open, the extension should inspect the page DOM in the background.
* It should identify headings and their order.
* It should assign anchors/IDs to headings if needed for navigation.
* It should build a hierarchical TOC model using heading level.

### Acceptance criteria

* TOC is generated without user action.
* Headings appear in correct order.
* Nested heading levels are represented correctly.

***

## 11.3 TOC overlay UI

* The UI should appear as a **left-side overlay/panel**.
* It should be visually lightweight and **non-intrusive**.
* It should not block core page interactions unnecessarily.
* It should be scrollable independently if the TOC is long.

### Acceptance criteria

* Overlay appears consistently on supported pages.
* Overlay does not cover essential browser or site controls.
* User can still interact with the Confluence page normally.

***

## 11.4 Overlay controls

The overlay must support:

### a) Minimize

* A minimize button collapses the overlay into a **small transparent floating button**.
* The minimized state should remain visible enough to restore.
* Clicking the minimized floating button expands the full TOC again.

### b) Close

* A close `x` button removes the overlay from view on the current page.

### c) Restore after close

* The extension must provide a manual mechanism to restore the overlay after closing it.
* This can be via:
  * extension popup action,
  * a floating restore button,
  * browser action button,
  * or a dedicated restore control.

### Acceptance criteria

* Minimize hides the sidebar but leaves a visible restore affordance.
* Close removes the overlay.
* Restore brings the overlay back without requiring page reload.

***

## 11.5 Global on/off control

* The extension must provide an **easy on/off switch**.
* When OFF:
  * overlay should not show,
  * page parsing should not run on new page visits,
  * existing overlay should disappear.
* When ON:
  * extension resumes normal behavior.

### Acceptance criteria

* User can toggle extension state from a clear control.
* OFF state persists across browser sessions.
* Re-enabling the extension restores normal operation.

***

## 11.6 TOC navigation

* Clicking any TOC item should scroll to the corresponding page section.
* Navigation should be smooth if possible, but functional behavior is more important than animation.
* If the page already contains anchor links, reuse them where possible.
* If anchors do not exist, create stable runtime anchors.

### Acceptance criteria

* Clicking a TOC item reliably navigates to the correct section.
* Navigation works for deeply nested sections too.

***

## 11.7 Automatic TOC updates

The TOC must update automatically when:

* user refreshes the page,
* Confluence re-renders page content,
* content changes in the DOM after initial load,
* headings are added/removed/renamed in the rendered page.

Implementation may use DOM observation mechanisms to detect relevant content changes.

### Acceptance criteria

* After refresh, TOC matches current content.
* If page content updates in-place and headings change, TOC refreshes automatically.
* Duplicate/redundant recomputation should be throttled/debounced to avoid performance problems.

***

## 11.8 Current section awareness (recommended MVP if easy, otherwise v1.1)

* As the user scrolls, the currently visible section should be highlighted in the TOC.
* Highlight should move as the active reading position changes.

### Acceptance criteria

* While scrolling, one TOC item is visibly marked as active when applicable.

***

## 11.9 Preference persistence

The extension should persist user preferences such as:

* extension ON/OFF state,
* overlay expanded/minimized,
* last overlay visibility preference,
* optionally overlay width/position if customizable later.

### Acceptance criteria

* Preferences survive browser restart.
* Preferences apply consistently on future supported pages.

***

## 12) UX / Interaction Requirements

## 12.1 Visual principles

* Clean, minimal, lightweight.
* Non-intrusive.
* Good readability.
* Respect page content over chrome.
* Avoid heavy animations.

## 12.2 Default behavior

* Overlay appears expanded by default when extension is ON.
* Overlay is docked/floating on the left.
* Overlay width should be narrow-to-moderate so it aids navigation without dominating the page.

## 12.3 Minimized state

* Becomes a small transparent or semi-transparent floating button/tab.
* Must remain easy to discover.
* Must not obstruct important Confluence controls.

## 12.4 Closed state

* Overlay not visible.
* Restore path must be obvious and quick.

## 12.5 Responsive behavior

* If viewport is too narrow, overlay should either:
  * collapse automatically,
  * use smaller width,
  * or switch to minimized mode.

***

## 13) User Flows

## 13.1 Default happy path

1. User opens a Confluence page.
2. Extension detects supported page.
3. Extension reads headings in background.
4. TOC overlay appears on left.
5. User clicks a TOC item.
6. Page scrolls to selected section.
7. As user scrolls, active section updates.

## 13.2 Minimize flow

1. User clicks minimize.
2. Overlay collapses to transparent floating restore button.
3. User clicks floating button.
4. Overlay expands.

## 13.3 Close flow

1. User clicks `x`.
2. Overlay disappears.
3. User restores via manual restore control (extension action or restore button).

## 13.4 Disable flow

1. User toggles extension OFF.
2. Overlay disappears.
3. No TOC generation occurs on subsequent page opens until turned ON again.

## 13.5 Page update flow

1. User refreshes page OR page content updates dynamically.
2. Extension detects change.
3. TOC is recomputed.
4. Overlay updates to latest headings.

***

## 14) Edge Cases / Failure Cases

The extension should handle:

* pages with no headings,
* pages with repeated heading text,
* pages with very deep heading nesting,
* pages with collapsed sections/macros,
* lazy-rendered content,
* dynamic DOM updates,
* very large pages,
* pages where headings appear after async rendering,
* headings without stable IDs,
* special characters in heading text,
* edited page content that changes while already open.

### Expected fallback behavior

* If no headings exist, show a friendly “No headings found” state.
* If duplicate heading text exists, generate unique runtime anchors.
* If content changes frequently, debounce TOC rebuilds.

***

## 15) Non-Functional Requirements

## 15.1 Performance

* TOC generation should be fast enough to feel near-instant on normal pages.
* DOM observers should be efficient and debounced.
* The overlay should not noticeably lag page interaction.

## 15.2 Reliability

* Must work consistently across common Confluence page structures.
* Must recover gracefully if the DOM changes unexpectedly.

## 15.3 Security / Permissions

* Request the smallest possible browser permissions.
* Restrict host permissions to user-approved Confluence domains if feasible.
* Avoid collecting page content externally unless explicitly designed later.

## 15.4 Privacy

* By default, no page content should be sent to external servers.
* TOC generation should happen locally in-browser for MVP.

## 15.5 Accessibility

* Buttons must be keyboard accessible.
* Controls should include accessible labels.
* Contrast should be acceptable.
* Active and focused states should be visible.

***

## 16) Technical Design Guidance for WindSurf

## 16.1 Suggested architecture

### Extension components

* **Manifest V3**
* **Content script**
  * runs on matching Confluence pages,
  * parses headings,
  * injects overlay UI,
  * listens for DOM changes,
  * handles scrolling/navigation.
* **Service worker/background**
  * manages persistent extension state if needed,
  * handles storage and extension-level commands.
* **Extension popup/options**
  * provides global ON/OFF toggle,
  * optional restore controls/preferences.

Manifest V3 uses a service worker model instead of old long-lived background pages. [\[developer.chrome.com\]](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3), [\[developer.chrome.com\]](https://developer.chrome.com/docs/extensions/develop/migrate)

## 16.2 DOM strategy

WindSurf should:

* identify heading elements from rendered Confluence content,
* normalize heading text,
* assign stable runtime IDs if absent,
* build TOC tree from heading levels,
* inject a shadow-DOM or isolated UI container if needed to avoid CSS conflicts.

## 16.3 Update detection strategy

Use a combination of:

* initial page load parsing,
* URL change detection for SPA-like navigation,
* `MutationObserver` for relevant DOM subtree changes,
* debounce/throttle for regeneration.

## 16.4 Navigation behavior

Use:

* anchor navigation where possible,
* otherwise `scrollIntoView()` or equivalent smooth scroll handling,
* offset handling if sticky headers hide headings.

## 16.5 State model

Suggested persisted states:

* `extensionEnabled: boolean`
* `overlayVisible: boolean`
* `overlayMinimized: boolean`
* `overlayClosed: boolean`
* `lastKnownConfluenceHost: string` (optional)
* `uiPreferences` object (optional future extensibility)

***

## 17) Browser Support Matrix

| Browser        |       MVP Support | Notes                                                                                                                                                                                                                                                                                               |
| -------------- | ----------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google Chrome  |               Yes | Primary target on Manifest V3. [\[developer.chrome.com\]](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3), [\[developer.chrome.com\]](https://developer.chrome.com/docs/extensions/develop/migrate)                                                          |
| Chromium       |               Yes | Expected via Chrome-compatible extension model. [\[developer.chrome.com\]](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3), [\[developer.chrome.com\]](https://developer.chrome.com/docs/extensions/develop/migrate)                                         |
| Microsoft Edge |               Yes | Chrome extensions are generally portable with minimal changes. [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/port-chrome-extension), [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/microsoft-edge/extensions/) |
| Vivaldi        |               Yes | Supports Chrome Web Store extensions. [\[help.vivaldi.com\]](https://help.vivaldi.com/desktop/appearance-customization/extensions/)                                                                                                                                         |
| Arc Browser    |               Yes | Supports extensions compatible with Chrome ecosystem. [\[resources.arc.net\]](https://resources.arc.net/hc/en-us/articles/19434259167767-Extensions-in-Arc-How-to-Import-Add-Open)                                                                                           |
| Zen Browser    | No for same build | Zen is Firefox-based; separate compatibility track. [\[docs.zen-browser.app\]](https://docs.zen-browser.app/user-manual/extensions)                                                                                                                                             |

***

## 18) Success Metrics

### Primary success metrics

* % of supported page opens where TOC is generated successfully
* median TOC generation time
* % of TOC item clicks resulting in correct navigation
* minimize / restore / close interaction success rate
* % of page updates correctly reflected in TOC

### UX metrics

* daily active users
* average number of TOC interactions per session
* % users who keep extension enabled
* complaint rate about intrusiveness
* restore rate after close/minimize

***

## 19) Acceptance Criteria (MVP Exit Criteria)

The MVP is complete when all of the following are true:

1. On supported Confluence pages, the extension automatically generates a TOC.
2. TOC is displayed as a left-side overlay.
3. Clicking TOC items navigates to the correct sections.
4. Refreshing the page regenerates correct TOC.
5. In-page content updates trigger TOC refresh.
6. Overlay has:
   * minimize,
   * close,
   * restore.
7. Extension has a clear ON/OFF control.
8. User preferences persist across sessions.
9. Extension works on Chrome, Edge, Vivaldi, Arc, and Chromium-family targets listed above. Support expectations for Edge/Vivaldi/Arc follow their documented extension compatibility. [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/port-chrome-extension), [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/microsoft-edge/extensions/), [\[help.vivaldi.com\]](https://help.vivaldi.com/desktop/appearance-customization/extensions/), [\[resources.arc.net\]](https://resources.arc.net/hc/en-us/articles/19434259167767-Extensions-in-Arc-How-to-Import-Add-Open)
10. The experience is non-intrusive and does not significantly degrade page performance.

***

## 20) Suggested MVP Prioritization

## Phase 1 — Must have

* content script injection
* heading parsing
* TOC tree generation
* left overlay
* click navigation
* minimize
* close
* restore
* ON/OFF toggle
* persistence
* refresh + DOM update handling

## Phase 2 — Should have

* active section highlight
* sticky-header offset handling improvements
* performance tuning for very large pages
* better duplicate-heading anchor strategy

## Phase 3 — Nice to have

* section search within TOC
* right-side docking option
* width customization
* theme adaptation (light/dark)
* remember per-site/per-space preferences
* Firefox/Zen-compatible build. Zen would need a Firefox-style extension path, not the same Chromium package. [\[docs.zen-browser.app\]](https://docs.zen-browser.app/user-manual/extensions)

***

## 21) Risks / Implementation Considerations

### Technical risks

* Confluence DOM may vary by page type and editor mode.
* Dynamic rendering may cause headings to appear late.
* Sticky headers may affect precise scroll positioning.
* Some macros may insert content outside expected heading flow.
* SPA-like navigation may require URL and DOM change handling beyond simple page-load events.

### Mitigations

* use robust selectors with fallback strategies,
* debounce mutation handling,
* implement anchor normalization,
* add telemetry/logging in development mode,
* test against several real long-form Confluence pages.

***

## 22) Explicit Build Brief for WindSurf

You can paste this section directly into WindSurf if you want a tighter implementation prompt:

### Build brief

Create a **Manifest V3 Chrome extension** for Confluence that:

* activates automatically on supported Confluence page URLs,
* parses rendered page headings in the background,
* generates a hierarchical TOC,
* injects a **non-intrusive left-side overlay**,
* allows click navigation to sections,
* automatically updates TOC on page refresh and DOM/content changes,
* includes:
  * global ON/OFF toggle,
  * minimize button,
  * close `x` button,
  * minimized transparent floating restore button,
  * manual restore path after close,
* persists user preferences via extension storage,
* works on Chrome and Chromium-based browsers such as Edge, Vivaldi, and Arc. Edge/Vivaldi/Arc all document extension compatibility paths around Chrome-style extensions. [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/port-chrome-extension), [\[learn.microsoft.com\]](https://learn.microsoft.com/en-us/microsoft-edge/extensions/), [\[help.vivaldi.com\]](https://help.vivaldi.com/desktop/appearance-customization/extensions/), [\[resources.arc.net\]](https://resources.arc.net/hc/en-us/articles/19434259167767-Extensions-in-Arc-How-to-Import-Add-Open)

Important:

* design for low intrusion,
* keep everything client-side for MVP,
* debounce DOM update handling,
* generate unique runtime anchors for duplicate headings,
* avoid breaking page layout,
* keep permissions minimal.

***

# Final confirmation

## Is the updated PRD correct?

**Mostly yes conceptually**, but **the earlier response was not complete** and had one important correction:

* **Zen Browser should not be grouped with Chromium browsers**; it needs a separate Firefox-style extension track. [\[docs.zen-browser.app\]](https://docs.zen-browser.app/user-manual/extensions)

## Is the PRD now complete?

**Yes — this is a complete MVP PRD** suitable to take to WindSurf.

***

# Questions I still have for you

These are not blockers for building v1, but answering them will make implementation tighter:

1. **Confluence Cloud only, or also Confluence Data Center / Server?**
2. Should the TOC appear on:
   * **view pages only**
   * or also **edit mode**?
3. Do you want the overlay to be:
   * **always left**
   * or user-configurable left/right?
4. Should the TOC include only:
   * `h1-h6`
   * or also special Confluence section titles generated by macros if detected?
5. Do you want **active-section highlighting** in MVP, or keep it for v1.1?

If you want, Ashu, next I can turn this into either:

1. a **WindSurf-ready implementation prompt**,
2. a **technical design doc / architecture spec**, or
3. a **task breakdown with milestones and acceptance tests**.
