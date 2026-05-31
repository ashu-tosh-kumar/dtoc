# Feasibility Analysis for Table of Contents Extension Expansion

This document outlines the feasibility of expanding our Table of Contents (TOC) extension to support additional high-traffic websites that host long-form content but lack a native, sticky TOC.

## 1. Medium
**Target User Base & Demographics:**
Massive global audience of readers, bloggers, developers, and professionals reading long-form articles. Highly engaged tech community.

**Evidence of Customer Requests/Frustration:**
Numerous articles and GitHub projects (e.g., Python scripts or Chrome extensions) exist solely to generate TOCs for Medium articles. Authors frequently complain about having to manually build HTML anchor links to simulate a TOC.

**Ease of Implementation:**
High. Medium uses relatively standard header tags (`h1`, `h2`, etc.) within their article body. Since our extension runs on the client-side DOM, we can easily parse these tags and inject our sticky TOC UI.

**Devil's Advocate View (Challenges):**
Medium periodically updates its DOM structure and obfuscates CSS class names. We would need to rely strictly on tag names (`h1`-`h6`) or the `<article>` container rather than specific classes. Furthermore, Medium often implements dynamic loading/infinite scrolling for recommended articles at the bottom, which might require Intersection Observers to prevent the TOC from parsing non-target articles.

---

## 2. Substack
**Target User Base & Demographics:**
Rapidly growing platform for independent writers, journalists, and newsletter creators. Content is heavily skewed towards long-form essays and deep dives.

**Evidence of Customer Requests/Frustration:**
Multiple Reddit threads (e.g., r/Substack) feature authors complaining about the inability to create linkable, sticky TOCs. Some users express frustration that even manual anchor links are difficult or impossible to implement cleanly within the platform's editor.

**Ease of Implementation:**
High. Similar to Medium, the content is rendered as standard HTML on the client side. The article container is usually distinct, making header extraction straightforward.

**Devil's Advocate View (Challenges):**
Substack heavily monetizes through paywalls. Our extension must gracefully handle pages where the content is truncated or hidden behind a "Subscribe to read" banner. We need to ensure we don't attempt to parse hidden content or break the paywall overlay.

---

## 3. Dev.to (DEV Community)
**Target User Base & Demographics:**
Millions of software developers and tech enthusiasts reading tutorials, guides, and opinion pieces.

**Evidence of Customer Requests/Frustration:**
Users frequently search for "how to create a table of contents to your dev.to article." The platform supports Markdown but requires manual, tedious anchor tag creation for TOCs, leading to numerous tutorial articles on how to bypass this limitation.

**Ease of Implementation:**
Very High. Dev.to has a predictable and clean DOM structure specifically designed for technical blogs. Header tags are consistently applied.

**Devil's Advocate View (Challenges):**
Many Dev.to authors *do* manually create a TOC at the beginning of their articles using Markdown. If we inject our own sticky TOC, we might be duplicating what the author already placed at the top. We'd need to consider whether to hide the author's manual TOC or just let both coexist.

---

## 4. GitHub Repositories (READMEs) & Wikis
**Target User Base & Demographics:**
Virtually every software developer. Extensive use of long-form Markdown files for project documentation.

**Evidence of Customer Requests/Frustration:**
Stack Overflow and GitHub Community discussions show users asking how to generate TOCs for wikis and READMEs. While GitHub does have a small native TOC icon in the top right of Markdown files, it is not always visible while scrolling, and many users still manually generate them using actions or pre-commit hooks.

**Ease of Implementation:**
Medium/High. GitHub renders Markdown into standard HTML within a `<article class="markdown-body">` container. Parsing this is trivial.

**Devil's Advocate View (Challenges):**
GitHub recently introduced a native, sticky TOC sidebar for README files on the repository homepage. If this feature is expanded to Wikis or becomes more robust, our extension might become redundant. We must carefully check if the native feature is active before injecting ours.

---

## 5. Reddit (Long-form Text Posts)
**Target User Base & Demographics:**
Huge general audience. Subreddits dedicated to stories, legal advice, deep dives, and technical explanations frequently feature massive walls of text.

**Evidence of Customer Requests/Frustration:**
Users on r/help frequently ask if it's possible to create functioning TOCs for text posts. Moderators of wiki-heavy subreddits also complain about changes to Reddit's UI that broke native TOC functionalities.

**Ease of Implementation:**
Medium. We would need to isolate the main post body (`div[data-test-id="post-content"]` or similar) and parse headers.

**Devil's Advocate View (Challenges):**
Reddit's DOM is highly dynamic (React-based), heavily obfuscated, and changes frequently (e.g., the transition from old.reddit to new.reddit to sh.reddit). Users also frequently use bold text instead of actual Markdown headers (`#`), which means our parser might miss sections unless we implement heuristic parsing for "pseudo-headers."
