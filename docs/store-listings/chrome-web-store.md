# Chrome Web Store Listing Metadata (v3.1.0)

This file contains the centralized metadata for the Chrome Web Store listing of `dtoc`. Use this content to update the store listing when publishing version 3.1.0.

---

## 1. Extension Title / Name

* **Field Limit**: 45 characters
* **Proposed Value**: `dtoc - Dynamic Table of Contents` (32 characters)
* **Official Homepage / Website**: `https://uncommonlydone.com/tools/dtoc`

---

## 2. Single Purpose Description (Summary)

* **Field Limit**: 132 characters (Plain text, no markdown)
* **Proposed Value**:

```text
Add a floating table of contents to Confluence, Wikipedia, Medium, DEV and any long page. Free, open source, private.
```

* **Character Count**: 117 characters

---

## 3. Detailed Description

* **Field Limit**: 16,000 characters (Plain text, carriage returns, and emojis/special characters allowed. No Markdown formatting or HTML links.)
* **Proposed Value**:

```text
Never get lost in a long web page again.

dtoc adds a clean, clickable table of contents to Confluence, Wikipedia, Medium, DEV and any long article, so you always know where you are and can jump to any section in one click. Free, open source, and nothing leaves your browser.

Picture a long Confluence design doc and you need the section on rollout risks. You scroll, overshoot, scroll back, and lose your place. dtoc gives every long page the outline that Confluence, Medium and much of the web are missing.

*** WHAT YOU GET ***
• Jump anywhere in one click: a clickable outline built from the page's own headings.
• Always know where you are: the section you are reading is highlighted as you scroll.
• Stays out of your way: a slim drawer tucks to the edge of the page and opens when you hover.
• Matches the page: automatic light or dark theme, with a manual override.
• Always up to date: the outline refreshes as dynamic pages change, with no reload.
• Your layout, your way: dock it left or right, globally or per site. Hide or minimize it any time.

*** WORKS WHERE YOU READ ***
• Confluence Cloud: review long docs and wiki pages without losing your place.
• Wikipedia (all languages): navigate long articles, no setup needed.
• Medium and custom-domain publications: skim a long read, then dive into the part you care about.
• DEV Community: move through long guides and tutorials in one click.
• Any other website (Beta): works on pages with standard headings. Turn it on for a site from the extension menu.

*** WHO IT'S FOR ***
• Engineers and product managers reviewing long Confluence docs, specs and runbooks.
• Students and researchers reading long Wikipedia entries and articles.
• Writers and editors checking the structure of a piece at a glance.
• Anyone on a work laptop who needs open-source, fully local software their security team can audit.

*** PRIVATE BY DESIGN ***
dtoc has no server, no account, and no analytics:
• Makes no external network requests.
• Keeps your settings only in your browser.
• Open source under the MIT license, with a public security policy.

*** WHAT'S NEW IN V3.1.0 ***
• Wikipedia now works out of the box on every language, with no Beta toggle.
• Fully local: removed the last external font request from the settings popup, so dtoc makes zero network requests.
• Safer on any page: hardened against malicious or oversized page headings.
• Cleaner look on Beta sites: a subtle solid accent border replaces the dashed one.

*** PERMISSIONS EXPLAINED ***
• "Read and change your data on all websites": Required to run the content script that parses heading tags and renders the floating outline overlay on supported and user-enabled pages.
• "storage": Required to persist user preferences (TOC position, closed/minimized state, per-site overrides) locally.
• "activeTab": Used to safely check the current tab's hostname in the settings popup, allowing you to customize settings for the active site or request support.

*** QUICK ANSWERS ***
• Does it work on Confluence? Yes. Confluence Cloud has dedicated support.
• Is it free? Yes, free and open source.
• Does it collect data? No.
• Why is the outline empty on a page? Some pages have no real heading tags. Request support for a site from the extension menu.

For developers: Manifest V3, no background script, Shadow DOM style isolation, MIT licensed.
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
Required to run the content script on websites where the Table of Contents outline is generated. This allows native support for Confluence, Wikipedia, Medium, and DEV.to, as well as universal support allowing users to manually enable the sidebar on any webpage they visit.
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
