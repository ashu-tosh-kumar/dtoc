# Mozilla Firefox Add-ons Listing Metadata (v3.1.0)

This file contains the centralized metadata for the Mozilla Firefox Add-ons (AMO) Store listing of `dtoc`. Use this content to update the store listing when publishing version 3.1.0.

* **Official Homepage / Website**: `https://uncommonlydone.com/tools/dtoc`

---

## 1. Summary

* **Field Limit**: 250 characters (Plain text)
* **Proposed Value**:

```text
Add a floating table of contents to Confluence, Wikipedia, Medium, DEV and any long page. Jump to any section in one click, never lose your place. Free, open source, no tracking, nothing leaves your browser.
```

* **Character Count**: 207 characters

---

## 2. Detailed Description

* **Field Limit**: 10,000 characters (Supports Markdown formatting: bold, italic, code blocks, lists, and links. HTML is not supported.)
* **Proposed Value**:

```markdown
### **dtoc**: Table of Contents for Any Web Page
**Never get lost in a long web page again.**

dtoc adds a clean, clickable table of contents to Confluence, Wikipedia, Medium, DEV and any long article, so you always know where you are and can jump to any section in one click. Free, open source, and nothing leaves your browser.

Picture a long Confluence design doc and you need the section on rollout risks. You scroll, overshoot, scroll back, and lose your place. dtoc gives every long page the outline that Confluence, Medium and much of the web are missing.

---

### **What You Get**
*   Jump anywhere in one click: a clickable outline built from the page's own headings.
*   Always know where you are: the section you are reading is highlighted as you scroll.
*   Stays out of your way: a slim drawer tucks to the edge of the page and opens when you hover.
*   Matches the page: automatic light or dark theme, with a manual override.
*   Always up to date: the outline refreshes as dynamic pages change, with no reload.
*   Your layout, your way: dock it left or right, globally or per site. Hide or minimize it any time.

---

### **Works Where You Read**
*   Confluence Cloud: review long docs and wiki pages without losing your place.
*   Wikipedia (all languages): navigate long articles, no setup needed.
*   Medium and custom-domain publications: skim a long read, then dive into the part you care about.
*   DEV Community: move through long guides and tutorials in one click.
*   Any other website (Beta): works on pages with standard headings. Turn it on for a site from the extension menu.

---

### **Who It's For**
*   Engineers and product managers reviewing long Confluence docs, specs and runbooks.
*   Students and researchers reading long Wikipedia entries and articles.
*   Writers and editors checking the structure of a piece at a glance.
*   Anyone on a work laptop who needs open-source, fully local software their security team can audit.

---

### **Private By Design**
dtoc has no server, no account, and no analytics:
*   Makes no external network requests.
*   Keeps your settings only in your browser.
*   Open source under the MIT license, with a public security policy.

---

### **What's New In v3.1.0**
*   Wikipedia now works out of the box on every language, with no Beta toggle.
*   Fully local: removed the last external font request from the settings popup, so dtoc makes zero network requests.
*   Safer on any page: hardened against malicious or oversized page headings.
*   Cleaner look on Beta sites: a subtle solid accent border replaces the dashed one.

---

### **Permissions Explained**
*   "Read and change your data on all websites": Required to run the content script that parses heading tags and renders the floating outline overlay on supported and user-enabled pages.
*   "storage": Required to persist user preferences (TOC position, closed/minimized state, per-site overrides) locally.
*   "activeTab": Used to safely check the current tab's hostname in the settings popup, allowing you to customize settings for the active site or request support.

---

### **Quick Answers**
*   **Does it work on Confluence?** Yes. Confluence Cloud has dedicated support.
*   **Is it free?** Yes, free and open source.
*   **Does it collect data?** No.
*   **Why is the outline empty on a page?** Some pages have no real heading tags. Request support for a site from the extension menu.

For developers: Manifest V3, no background script, Shadow DOM style isolation, MIT licensed.

---

### **Links & Support**
*   [Guide, screenshots & FAQ](https://uncommonlydone.com/tools/dtoc)
*   [GitHub Repository](https://github.com/ashu-tosh-kumar/dtoc)
*   [YouTube Video Showcase](https://youtu.be/-vvvjiyMUjQ)
```

---

## 3. Whiteboard (Notes for Reviewers)

```text
The add-on is entirely local, offline-first, contains no remote data gathering or third-party integrations, and works on any website.

Links and references:
- GitHub Repository: https://github.com/ashu-tosh-kumar/dtoc
- Showcase/Walkthrough Video: https://youtu.be/-vvvjiyMUjQ
- Public Testing Page (Confluence - no login required):
  https://chauhanshilpa602.atlassian.net/wiki/external/ZTUwMWMzZDYxMjk5NDcxYTgxMWQzMTdlNzc1NTFmMTc

Testing Steps:
1. Load the extension in Firefox.
2. Navigate to any natively supported website containing headings, such as our pre-configured public Confluence test page (above), a Wikipedia article (e.g. https://en.wikipedia.org/wiki/Browser_extension), or a Medium or Dev.to article.
3. If testing on a website not natively supported, open the settings popup and toggle the "Enable on this site" option (Beta feature).
4. Verify the minimized notch strip appears on the edge of the viewport and hover over it to expand the glassmorphism Table of Contents drawer.
5. Click links inside the drawer to verify smooth scrolling.
6. Open the settings popup to test position toggling (Left vs. Right) and theme selections.
```
