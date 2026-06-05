/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const extensions = ['chrome-extension', 'firefox-extension'];

describe("Extension API usage and files structure", () => {
  test("chrome-extension files use chrome.* API", () => {
    const contentJs = fs.readFileSync(path.join(__dirname, 'chrome-extension', 'content.js'), 'utf8');
    expect(contentJs).toMatch(/chrome\.storage\.local/);
    expect(contentJs).not.toMatch(/browser\.storage\.local/);

    const popupJs = fs.readFileSync(path.join(__dirname, 'chrome-extension', 'popup.js'), 'utf8');
    expect(popupJs).toMatch(/chrome\.storage\.local/);
    expect(popupJs).not.toMatch(/browser\.storage\.local/);
  });

  test("firefox-extension files use browser.* API", () => {
    const contentJs = fs.readFileSync(path.join(__dirname, 'firefox-extension', 'content.js'), 'utf8');
    expect(contentJs).toMatch(/browser\.storage\.local/);
    expect(contentJs).not.toMatch(/chrome\.storage\.local/);

    const popupJs = fs.readFileSync(path.join(__dirname, 'firefox-extension', 'popup.js'), 'utf8');
    expect(popupJs).toMatch(/browser\.storage\.local/);
    expect(popupJs).not.toMatch(/chrome\.storage\.local/);
  });
});

extensions.forEach(ext => {
  describe(`Tests for ${ext}`, () => {
    describe("content script view mode logic", () => {
      // Extract the pure function logic for testing
      function isViewMode(hostname, path, search) {
        const params = new URLSearchParams(search);

        if (hostname.includes('dev.to')) {
          if (path === '/new' || path.endsWith('/edit')) return false;
        } else {
          if (path.includes('/edit') || path.includes('/edit-v2')) return false;
          if (params.get('mode') === 'edit') return false;
        }
        return true;
      }

      test("Confluence: returns true for standard view pages", () => {
        expect(isViewMode('myorg.atlassian.net', '/wiki/spaces/ENG/pages/1234/Architecture', '')).toBe(true);
      });

      test("Confluence: returns false for /edit routes", () => {
        expect(isViewMode('myorg.atlassian.net', '/wiki/spaces/ENG/pages/1234/Architecture/edit', '')).toBe(false);
      });

      test("Confluence: returns false for /edit-v2 routes", () => {
        expect(isViewMode('myorg.atlassian.net', '/wiki/spaces/ENG/pages/1234/Architecture/edit-v2', '')).toBe(false);
      });

      test("Confluence: returns false when mode=edit is in query params", () => {
        expect(isViewMode('myorg.atlassian.net', '/wiki/spaces/ENG/pages/1234/Architecture', '?mode=edit')).toBe(false);
      });

      test("Dev.to: returns true for standard view pages", () => {
        expect(isViewMode('dev.to', '/user/post-title', '')).toBe(true);
      });

      test("Dev.to: returns false for /new routes", () => {
        expect(isViewMode('dev.to', '/new', '')).toBe(false);
      });

      test("Dev.to: returns false for /edit routes", () => {
        expect(isViewMode('dev.to', '/user/post-title/edit', '')).toBe(false);
      });
    });

    // Note: We use purely mocked/extracted logic in this test file
    // to avoid loading browser-specific extension APIs directly into Jest.
    describe("heading normalization logic", () => {
      function slugify(text) {
        return text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      test("generates an ID if a heading lacks one", () => {
        document.body.innerHTML = '<h1>Hello World</h1>';
        const heading = document.querySelector('h1');
        const text = heading.textContent.trim();

        let id = heading.id;
        if (!id) {
          const slug = slugify(text) || 'heading';
          id = `dtoc-${slug}`;
          heading.id = id;
        }

        expect(heading.id).toBe('dtoc-hello-world');
      });

      test("preserves existing heading IDs", () => {
        document.body.innerHTML = '<h2 id="existing-anchor">Custom Section</h2>';
        const heading = document.querySelector('h2');
        const text = heading.textContent.trim();

        let id = heading.id;
        if (!id) {
          const slug = slugify(text) || 'heading';
          id = `dtoc-${slug}`;
          heading.id = id;
        }

        expect(heading.id).toBe('existing-anchor');
      });

      test("handles empty or special character only text", () => {
        document.body.innerHTML = '<h3>!!!</h3>';
        const heading = document.querySelector('h3');
        const text = heading.textContent.trim();

        let id = heading.id;
        if (!id) {
          const slug = slugify(text) || 'heading';
          id = `dtoc-${slug}`;
          heading.id = id;
        }

        expect(heading.id).toBe('dtoc-heading');
      });
    });

    describe("DOM container fallback logic", () => {
      function getContentContainer(hostname) {
        let selectors = [];
        if (hostname.includes('dev.to')) {
          selectors = ['#article-body', '.crayons-article__body'];
        } else {
          selectors = ['#main-content', '#content', '.ak-renderer-document', '.wiki-content'];
        }
        for (let selector of selectors) {
          const el = document.querySelector(selector);
          if (el) return el;
        }
        return null;
      }

      afterEach(() => {
        document.body.innerHTML = '';
      });

      test("Confluence: finds #main-content first", () => {
        document.body.innerHTML = '<div id="sidebar"></div><div id="main-content">Target</div>';
        expect(getContentContainer('myorg.atlassian.net').id).toBe('main-content');
      });

      test("Confluence: returns null if no container matches", () => {
        document.body.innerHTML = '<div class="unknown-layout">Hello</div>';
        expect(getContentContainer('myorg.atlassian.net')).toBe(null);
      });

      test("Dev.to: finds #article-body", () => {
        document.body.innerHTML = '<div id="article-body">Target</div>';
        expect(getContentContainer('dev.to').id).toBe('article-body');
      });

      test("Dev.to: finds .crayons-article__body", () => {
        document.body.innerHTML = '<div class="crayons-article__body">Target</div>';
        expect(getContentContainer('dev.to').className).toBe('crayons-article__body');
      });
    });
  });
});
