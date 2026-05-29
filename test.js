/**
 * @jest-environment jsdom
 */

describe("content script view mode logic", () => {
  // Extract the pure function logic for testing
  function isViewMode(path, search) {
    if (path.includes('/edit') || path.includes('/edit-v2')) return false;
    const params = new URLSearchParams(search);
    if (params.get('mode') === 'edit') return false;
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
});

describe("heading normalization logic", () => {
  test("generates an ID if a heading lacks one", () => {
    document.body.innerHTML = '<h1>Hello World</h1>';
    const heading = document.querySelector('h1');

    let id = heading.id;
    if (!id) {
      id = `dtoc-heading-0-${Math.random().toString(36).substr(2, 5)}`;
      heading.id = id;
    }

    expect(heading.id).toMatch(/^dtoc-heading-0-[a-z0-9]{5}$/);
  });

  test("preserves existing heading IDs", () => {
    document.body.innerHTML = '<h2 id="existing-anchor">Custom Section</h2>';
    const heading = document.querySelector('h2');

    let id = heading.id;
    if (!id) {
      id = `dtoc-heading-1-${Math.random().toString(36).substr(2, 5)}`;
      heading.id = id;
    }

    expect(heading.id).toBe('existing-anchor');
  });
});

describe("DOM container fallback logic", () => {
  function getConfluenceContentContainer() {
    const selectors = ['#main-content', '#content', '.ak-renderer-document', '.wiki-content'];
    for (let selector of selectors) {
      const el = document.querySelector(selector);
      if (el) return el;
    }
    return document.body;
  }

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test("finds #main-content first", () => {
    document.body.innerHTML = '<div id="sidebar"></div><div id="main-content">Target</div>';
    expect(getConfluenceContentContainer().id).toBe('main-content');
  });

  test("falls back to body if no container matches", () => {
    document.body.innerHTML = '<div class="unknown-layout">Hello</div>';
    expect(getConfluenceContentContainer()).toBe(document.body);
  });
});
