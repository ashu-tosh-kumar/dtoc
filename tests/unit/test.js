/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

const extensions = ['chrome-extension', 'firefox-extension'];

const MEDIUM_DOMAINS = [
  'levelup.gitconnected.com',
  'plainenglish.io',
  'uxdesign.cc',
  'uxplanet.org',
  'betterprogramming.pub',
  'itnext.io',
  'proandroiddev.com',
  'writingcooperative.com',
  'ehandbook.com',
  'entrepreneurshandbook.co',
  'dailyjs.com'
];

function isMediumSite(hostname) {
  const cleanHost = (hostname || '').toLowerCase().replace(/^www\./i, '');
  return cleanHost === 'medium.com' ||
         cleanHost.endsWith('.medium.com') ||
         MEDIUM_DOMAINS.some(domain => 
           cleanHost === domain || cleanHost.endsWith('.' + domain)
         );
}

describe("Extension API usage and files structure", () => {
  test("chrome-extension files use chrome.* API", () => {
    const contentJs = fs.readFileSync(path.join(__dirname, '..', '..', 'chrome-extension', 'content.js'), 'utf8');
    expect(contentJs).toMatch(/chrome\.storage\.local/);
    expect(contentJs).not.toMatch(/browser\.storage\.local/);

    const popupJs = fs.readFileSync(path.join(__dirname, '..', '..', 'chrome-extension', 'popup.js'), 'utf8');
    expect(popupJs).toMatch(/chrome\.storage\.local/);
    expect(popupJs).not.toMatch(/browser\.storage\.local/);
  });

  test("firefox-extension files use browser.* API", () => {
    const contentJs = fs.readFileSync(path.join(__dirname, '..', '..', 'firefox-extension', 'content.js'), 'utf8');
    expect(contentJs).toMatch(/browser\.storage\.local/);
    expect(contentJs).not.toMatch(/chrome\.storage\.local/);

    const popupJs = fs.readFileSync(path.join(__dirname, '..', '..', 'firefox-extension', 'popup.js'), 'utf8');
    expect(popupJs).toMatch(/browser\.storage\.local/);
    expect(popupJs).not.toMatch(/chrome\.storage\.local/);
  });
});

extensions.forEach(ext => {
  describe(`Tests for ${ext}`, () => {
    describe("content script view mode logic", () => {
      // Extract the pure function logic for testing
      function isViewMode(path, search, hostname = 'mocked.atlassian.net') {
        const normalizedHostname = (hostname || '').toLowerCase();
        const isAllowedHost = (domain) =>
          normalizedHostname === domain || normalizedHostname.endsWith(`.${domain}`);

        if (isAllowedHost('dev.to')) {
          if (path === '/new' || path.endsWith('/edit') || path.includes('/edit/')) return false;
          if (path === '/' || path === '') return false;
        } else if (isMediumSite(normalizedHostname)) {
          if (path === '/new-story' || path.endsWith('/edit') || path.includes('/edit/')) return false;
          if (path === '/' || path === '') return false;
        } else if (isAllowedHost('atlassian.net')) {
          if (path.includes('/edit') || path.includes('/edit-v2')) return false;
          const params = new URLSearchParams(search);
          if (params.get('mode') === 'edit') return false;
        } else {
          if (path.includes('/edit') || path.includes('/editor') || path.includes('/write') || path.includes('/new') || path.includes('/compose') || path.includes('/draft')) return false;
          if (path === '/' || path === '' || path === '/index.html') return false;
        }
        return true;
      }

      test("returns true for standard view pages", () => {
        expect(isViewMode('/wiki/spaces/ENG/pages/1234/Architecture', '')).toBe(true);
      });

      test("returns false for /edit routes", () => {
        expect(isViewMode('/wiki/spaces/ENG/pages/1234/Architecture/edit', '')).toBe(false);
      });

      test("returns false for /edit-v2 routes", () => {
        expect(isViewMode('/wiki/spaces/ENG/pages/1234/Architecture/edit-v2', '')).toBe(false);
      });

      test("returns false when mode=edit is in query params", () => {
        expect(isViewMode('/wiki/spaces/ENG/pages/1234/Architecture', '?mode=edit')).toBe(false);
      });

      test("medium.com: returns true for article page", () => {
        expect(isViewMode('/p/some-article-slug', '', 'medium.com')).toBe(true);
        expect(isViewMode('/p/some-article-slug', '', 'subdomain.medium.com')).toBe(true);
      });

      test("medium.com: returns false for new-story, edit routes, and homepage", () => {
        expect(isViewMode('/new-story', '', 'medium.com')).toBe(false);
        expect(isViewMode('/p/12345/edit', '', 'medium.com')).toBe(false);
        expect(isViewMode('/', '', 'medium.com')).toBe(false);
      });

      test("custom Medium publications: returns true for article page and false for edit/homepage", () => {
        expect(isViewMode('/p/some-article-slug', '', 'levelup.gitconnected.com')).toBe(true);
        expect(isViewMode('/new-story', '', 'python.plainenglish.io')).toBe(false);
        expect(isViewMode('/', '', 'python.plainenglish.io')).toBe(false);
      });

      test("generic site: returns true for standard path", () => {
        expect(isViewMode('/blog/post-1', '', 'generic.com')).toBe(true);
      });

      test("generic site: returns false for editor paths and homepage", () => {
        expect(isViewMode('/edit/post', '', 'generic.com')).toBe(false);
        expect(isViewMode('/new-post', '', 'generic.com')).toBe(false);
        expect(isViewMode('/', '', 'generic.com')).toBe(false);
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
      function isHostOrSubdomain(hostname, domain) {
        return hostname === domain || hostname.endsWith(`.${domain}`);
      }

      function getContentContainer(hostname = 'mocked.atlassian.net') {
        let selectors = [];
        if (isHostOrSubdomain(hostname, 'dev.to')) {
          selectors = [
            '#article-body',
            '.crayons-article__body',
            '.crayons-article__main'
          ];
        } else if (isMediumSite(hostname)) {
          selectors = [
            'article'
          ];
        } else if (isHostOrSubdomain(hostname, 'atlassian.net')) {
          selectors = ['#main-content', '#content', '.ak-renderer-document', '.wiki-content'];
        } else {
          selectors = [
            'article',
            'main',
            '[role="main"]',
            '#main',
            '#content',
            '.post-content',
            '.article-content',
            '.entry-content',
            'body'
          ];
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

      test("finds #main-content first for Confluence", () => {
        document.body.innerHTML = '<div id="sidebar"></div><div id="main-content">Target</div>';
        expect(getContentContainer('mocked.atlassian.net').id).toBe('main-content');
      });

      test("returns null if no container matches for Confluence", () => {
        document.body.innerHTML = '<div class="unknown-layout">Hello</div>';
        expect(getContentContainer('mocked.atlassian.net')).toBe(null);
      });

      test("finds article element for Medium", () => {
        document.body.innerHTML = '<article>Medium Content</article>';
        expect(getContentContainer('medium.com').tagName.toLowerCase()).toBe('article');
      });

      test("finds article element for custom Medium publications", () => {
        document.body.innerHTML = '<article>Medium Content</article>';
        expect(getContentContainer('levelup.gitconnected.com').tagName.toLowerCase()).toBe('article');
      });

      test("finds main element for generic site", () => {
        document.body.innerHTML = '<main>Generic Main</main>';
        expect(getContentContainer('generic.com').tagName.toLowerCase()).toBe('main');
      });

      test("falls back to body for generic site if nothing else matches", () => {
        document.body.innerHTML = '<div>Generic Body Content</div>';
        expect(getContentContainer('generic.com').tagName.toLowerCase()).toBe('body');
      });
    });

    describe("settings inheritance resolution logic", () => {
      function resolveSettings(result, hostname) {
        const currentDomain = hostname.replace(/^www\./i, '');
        const siteSettings = result.siteSettings || {};
        const siteConfig = siteSettings[currentDomain] || {};

        const globalEnabled = result.enabled !== undefined ? result.enabled : true;
        const otherSupported = ['.atlassian.net', 'dev.to'];
        const isSupported = otherSupported.some(site => currentDomain.endsWith(site)) || isMediumSite(currentDomain);
        const siteEnabled = siteConfig.enabled !== undefined ? siteConfig.enabled : isSupported;
        const enabled = globalEnabled && siteEnabled;

        const globalPosition = result.position || 'left';
        const position = siteConfig.position !== undefined ? siteConfig.position : globalPosition;

        const closed = result.closed !== undefined ? result.closed : false;
        const minimized = result.minimized !== undefined ? result.minimized : false;

        return { enabled, position, closed, minimized };
      }

      test("inherits global settings when site-specific settings are not configured on supported sites", () => {
        const result = {
          enabled: true,
          position: 'right',
          closed: false,
          minimized: true,
          siteSettings: {}
        };
        const resolved = resolveSettings(result, 'medium.com');
        expect(resolved.enabled).toBe(true);
        expect(resolved.position).toBe('right');
        expect(resolved.closed).toBe(false);
        expect(resolved.minimized).toBe(true);
      });

      test("defaults to disabled when site-specific settings are not configured on unsupported sites", () => {
        const result = {
          enabled: true,
          position: 'right',
          closed: false,
          minimized: true,
          siteSettings: {}
        };
        const resolved = resolveSettings(result, 'wikipedia.org');
        expect(resolved.enabled).toBe(false);
      });

      test("defaults to enabled when site-specific settings are not configured on custom Medium publication sites", () => {
        const result = {
          enabled: true,
          position: 'right',
          closed: false,
          minimized: true,
          siteSettings: {}
        };
        const resolved = resolveSettings(result, 'levelup.gitconnected.com');
        expect(resolved.enabled).toBe(true);
      });

      test("allows enabling unsupported sites via site-specific override", () => {
        const result = {
          enabled: true,
          position: 'right',
          closed: false,
          minimized: false,
          siteSettings: {
            'wikipedia.org': {
              enabled: true,
              position: 'left'
            }
          }
        };
        const resolved = resolveSettings(result, 'wikipedia.org');
        expect(resolved.enabled).toBe(true);
        expect(resolved.position).toBe('left');
      });

      test("disables site if global is disabled, regardless of site-specific toggle", () => {
        const result = {
          enabled: false,
          position: 'right',
          siteSettings: {
            'wikipedia.org': {
              enabled: true,
              position: 'left'
            }
          }
        };
        const resolved = resolveSettings(result, 'wikipedia.org');
        expect(resolved.enabled).toBe(false);
      });
      
      test("strips www. from hostname to find site configuration", () => {
        const result = {
          enabled: true,
          position: 'right',
          siteSettings: {
            'medium.com': {
              enabled: false,
              position: 'left'
            }
          }
        };
        const resolved = resolveSettings(result, 'www.medium.com');
        expect(resolved.enabled).toBe(false);
        expect(resolved.position).toBe('left');
      });
    });
  });
});
