// Immediately invoked function expression to avoid polluting the global namespace
(() => {
  // --- Constants & State ---
  const SETTINGS_KEY = {
    ENABLED: 'enabled',
    POSITION: 'position',
    CLOSED: 'closed',
    MINIMIZED: 'minimized'
  };

  // Map storage keys to internal state property names to decouple them
  const STATE_KEY_MAP = {
    [SETTINGS_KEY.ENABLED]: 'enabled',
    [SETTINGS_KEY.POSITION]: 'position',
    [SETTINGS_KEY.CLOSED]: 'closed',
    [SETTINGS_KEY.MINIMIZED]: 'minimized'
  };

  let state = {
    enabled: true,
    position: 'left',
    closed: false,
    minimized: false
  };

  let shadowRoot = null;
  let container = null;
  let contentArea = null;

  // Icons (SVG strings)
  const ICON_MINIMIZE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
  const ICON_CLOSE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  const ICON_MAXIMIZE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`;

  function createIconElement(svgString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    return doc.documentElement;
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // --- Initialization ---

  function init() {
    loadSettings(() => {
      // Check if we are in view mode (exclude edit routes)
      if (isViewMode()) {
        injectUI();
        applyStateToUI();
        parseHeadingsAndRender();
      }
      setupMutationObserver();
    });

    listenForSettingsChanges();
  }

  function isSupportedSite() {
    const hostname = window.location.hostname;
    const supportedSites = ['.atlassian.net', 'dev.to', 'medium.com'];
    return supportedSites.some(site => hostname.endsWith(site));
  }

  function isViewMode() {
    const path = window.location.pathname;
    const hostname = window.location.hostname;

    if (hostname.includes('dev.to')) {
      // Dev.to edit paths: /new, or ending in /edit
      if (path === '/new' || path.endsWith('/edit') || path.includes('/edit/')) return false;
      // Exclude home page
      if (path === '/' || path === '') return false;
    } else if (hostname.includes('medium.com')) {
      // Medium edit paths: /new-story, or ending in /edit
      if (path === '/new-story' || path.endsWith('/edit') || path.includes('/edit/')) return false;
      // Exclude home page
      if (path === '/' || path === '') return false;
    } else if (hostname.includes('atlassian.net')) {
      // Confluence typically has '/edit' in the URL or 'editMode' in the body class when editing
      if (path.includes('/edit') || path.includes('/edit-v2')) return false;

      // Some pages append ?mode=edit or similar
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'edit') return false;
    } else {
      // Generic site exclusions
      if (path.includes('/edit') || path.includes('/editor') || path.includes('/write') || path.includes('/new') || path.includes('/compose') || path.includes('/draft')) return false;
      if (path === '/' || path === '' || path === '/index.html') return false;
    }

    return true;
  }

  // --- Settings Management ---

  function loadSettings(callback) {
    const keys = Object.values(SETTINGS_KEY);
    browser.storage.local.get(keys).then((result) => {
      for (const storageKey of keys) {
        const stateKey = STATE_KEY_MAP[storageKey];
        if (result[storageKey] !== undefined && stateKey) {
          state[stateKey] = result[storageKey];
        }
      }
      callback();
    });
  }

  function updateSetting(storageKey, value) {
    const stateKey = STATE_KEY_MAP[storageKey];
    if (stateKey) {
      state[stateKey] = value;
      browser.storage.local.set({ [storageKey]: value });
      applyStateToUI();
    }
  }

  function listenForSettingsChanges() {
    browser.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        let changed = false;
        for (let [storageKey, { newValue }] of Object.entries(changes)) {
          const stateKey = STATE_KEY_MAP[storageKey];
          if (stateKey && state[stateKey] !== newValue) {
            state[stateKey] = newValue;
            changed = true;
          }
        }
        if (changed) {
          applyStateToUI();
        }
      }
    });
  }

  // --- UI Injection ---

  function injectUI() {
    // Don't inject multiple times
    if (document.getElementById('dtoc-host')) return;

    const host = document.createElement('div');
    host.id = 'dtoc-host';
    document.body.appendChild(host);

    shadowRoot = host.attachShadow({ mode: 'open' });

    // Fetch CSS file
    const cssUrl = browser.runtime.getURL('content.css');
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = cssUrl;
    shadowRoot.appendChild(linkEl);

    container = document.createElement('div');
    container.id = 'dtoc-container';
    if (!isSupportedSite()) {
      container.classList.add('experimental');
    }

    // Header
    const header = document.createElement('div');
    header.className = 'dtoc-header';

    const title = document.createElement('h2');
    title.className = 'dtoc-title';
    title.textContent = isSupportedSite() ? 'Table of Contents' : 'Table of Contents (Beta)';

    const controls = document.createElement('div');
    controls.className = 'dtoc-controls';

    const minBtn = document.createElement('button');
    minBtn.className = 'icon-btn';
    minBtn.title = 'Minimize';
    minBtn.appendChild(createIconElement(ICON_MINIMIZE));
    minBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSetting(SETTINGS_KEY.MINIMIZED, true);
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'icon-btn';
    closeBtn.title = 'Close';
    closeBtn.appendChild(createIconElement(ICON_CLOSE));
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSetting(SETTINGS_KEY.CLOSED, true);
    });

    controls.appendChild(minBtn);
    controls.appendChild(closeBtn);

    header.appendChild(title);
    header.appendChild(controls);

    // Content Area
    contentArea = document.createElement('div');
    contentArea.className = 'dtoc-content';
    const loadingState = document.createElement('div');
    loadingState.className = 'empty-state';
    loadingState.textContent = 'Loading...';
    contentArea.appendChild(loadingState);

    // Maximize Icon (visible only when minimized)
    const maxIcon = document.createElement('div');
    maxIcon.className = 'maximize-icon';
    maxIcon.title = 'Expand TOC';
    maxIcon.appendChild(createIconElement(ICON_MAXIMIZE));

    container.appendChild(header);
    container.appendChild(contentArea);
    container.appendChild(maxIcon);

    // Handle click on minimized container to expand
    container.addEventListener('click', () => {
      if (state.minimized) {
        updateSetting(SETTINGS_KEY.MINIMIZED, false);
      }
    });

    shadowRoot.appendChild(container);
  }

  function applyStateToUI() {
    if (!container) return;

    if (!state.enabled || state.closed) {
      container.classList.add('hidden');
    } else {
      container.classList.remove('hidden');
    }

    if (state.minimized) {
      container.classList.add('minimized');
    } else {
      container.classList.remove('minimized');
    }

    // Position
    container.classList.remove('position-left', 'position-right');
    container.classList.add(`position-${state.position}`);
  }

  // --- Reactivity & Mutation Handling ---

  let observer = null;
  let debounceTimer = null;

  function setupMutationObserver() {
    const config = { childList: true, subtree: true, characterData: true };
    let currentTarget = null;

    const callback = function(mutationsList, observer) {
      // Debounce the parsing to avoid performance hits during rapid DOM updates
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // Re-check view mode in case SPA navigated to edit mode
        if (!isViewMode()) {
          if (container && !container.classList.contains('hidden')) {
            container.classList.add('hidden');
          }
          return;
        } else if (state.enabled && !state.closed) {
          if (!container) injectUI(); // Inject if not present
          if (container) container.classList.remove('hidden');
        }

        parseHeadingsAndRender();
      }, 500); // 500ms debounce
    };

    observer = new MutationObserver(callback);

    const rebindObserver = () => {
      const targetNode = getContentContainer();
      if (targetNode !== currentTarget) {
        if (currentTarget) observer.disconnect();
        if (targetNode) observer.observe(targetNode, config);
        currentTarget = targetNode;
        return true;
      }
      return false;
    };

    rebindObserver();

    // Use a periodic check for URL changes and container availability 
    // instead of a broad document-level MutationObserver.
    let lastUrl = location.href;
    setInterval(() => {
      const currentUrl = location.href;
      const targetNode = getContentContainer();

      if (currentUrl !== lastUrl || (targetNode && targetNode !== currentTarget)) {
        const urlChanged = currentUrl !== lastUrl;
        lastUrl = currentUrl;
        
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          if (!isViewMode()) {
            if (container) container.classList.add('hidden');
          } else {
            if (!container) injectUI();
            applyStateToUI();

            const bound = rebindObserver();
            if (state.enabled && !state.closed && container) {
              container.classList.remove('hidden');
            }
            if (bound || urlChanged) {
              parseHeadingsAndRender();
            }
          }
        }, urlChanged ? 1000 : 500);
      }
    }, 1000);
  }

  // --- Parsing & Navigation ---

  function getContentContainer() {
    let selectors = [];
    if (window.location.hostname.includes('dev.to')) {
      selectors = [
        '#article-body',
        '.crayons-article__body',
        '.crayons-article__main'
      ];
    } else if (window.location.hostname.includes('medium.com')) {
      selectors = [
        'article'
      ];
    } else if (window.location.hostname.includes('atlassian.net')) {
      // Attempt to find the main content container in Confluence View Mode
      // #main is a common Atlassian wrapper, but sometimes we need to look closer to the renderer
      selectors = [
        '#main-content',
        '#content',
        '.ak-renderer-document',
        '.wiki-content'
      ];
    } else {
      // Generic content selectors fallback
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

  function getPageTitle() {
    const selectors = [
      'h1#title-text',
      'h1[data-test-id="page-title"]',
      '.ak-page-header-title h1',
      '#main-title h1',
      '.crayons-article__header__meta h1',
      '.crayons-article__main h1',
      'h1.crayons-title',
      'h1'
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el && el.textContent.trim()) {
        return {
          text: el.textContent.trim(),
          element: el
        };
      }
    }

    let titleText = document.title;
    titleText = titleText
      .replace(/\s*-\s*Confluence\s*$/i, '')
      .replace(/\s*-\s*DEV Community\s*$/i, '')
      .replace(/\s*\|\s*by\s+.*\|\s*Medium\s*$/i, '')
      .replace(/\s*\|\s*Medium\s*$/i, '')
      .replace(/\s*-\s*Medium\s*$/i, '')
      .trim();

    return {
      text: titleText || 'Top',
      element: null
    };
  }

  function parseHeadingsAndRender() {
    if (!contentArea) return;

    const contentContainer = getContentContainer();
    if (!contentContainer) {
      contentArea.textContent = '';
      return;
    }

    // Query headings only within the main content area to avoid site nav/sidebar
    const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');

    const ul = document.createElement('ul');
    ul.className = 'toc-list';

    // Get the page title info
    const titleInfo = getPageTitle();

    // Prepend Page Title to TOC if it's not the same element as the first heading
    const firstHeading = headings[0];
    const hasTitlePrepend = titleInfo.element !== firstHeading;

    if (hasTitlePrepend) {
      const titleLi = document.createElement('li');
      titleLi.className = 'toc-item toc-level-1 toc-title-item';

      const titleA = document.createElement('a');
      titleA.className = 'toc-link';
      titleA.href = '#';
      titleA.textContent = titleInfo.text;

      titleA.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState(null, null, window.location.pathname + window.location.search);

        if (titleInfo.element) {
          titleInfo.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const originalScrollMargin = titleInfo.element.style.scrollMarginTop;
          titleInfo.element.style.scrollMarginTop = '70px';
          setTimeout(() => {
            titleInfo.element.style.scrollMarginTop = originalScrollMargin;
          }, 1000);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });

      titleLi.appendChild(titleA);
      ul.appendChild(titleLi);
    }

    const idCounts = {};

    headings.forEach((heading, index) => {
      // Skip hidden headings or headings inside specific UI widgets if necessary
      if (heading.offsetParent === null) return;

      const text = heading.textContent.trim();
      if (!text) return; // Skip empty headings

      // Normalize heading level (h1 = 1, h2 = 2, etc.)
      const level = parseInt(heading.tagName.substring(1), 10);

      // Ensure heading has an ID for navigation
      let id = heading.id;
      if (!id) {
        const slug = slugify(text) || 'heading';
        const baseId = `dtoc-${slug}`;
        
        if (idCounts[baseId]) {
          idCounts[baseId]++;
          id = `${baseId}-${idCounts[baseId]}`;
        } else {
          idCounts[baseId] = 1;
          id = baseId;
        }

        heading.id = id;
      }

      const li = document.createElement('li');
      li.className = `toc-item toc-level-${level}`;

      const a = document.createElement('a');
      a.className = 'toc-link';
      a.href = `#${id}`;
      a.textContent = text;

      // Handle click to scroll smoothly
      a.addEventListener('click', (e) => {
        e.preventDefault();

        // Push state to history so back button works, and URL updates
        history.pushState(null, null, `#${id}`);

        // Confluence might use a custom scrolling container instead of window.
        // scrollIntoView is universally supported and works within overflow:auto containers.
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Slight hack for sticky header offset since scrollIntoView doesn't support offset directly
        // We use a small timeout to let the smooth scroll finish (or partially finish),
        // then adjust slightly if needed, or better, we temporarily use scrollMarginTop.
        const originalScrollMargin = heading.style.scrollMarginTop;
        heading.style.scrollMarginTop = '70px';

        setTimeout(() => {
          heading.style.scrollMarginTop = originalScrollMargin;
        }, 1000);
      });

      li.appendChild(a);
      ul.appendChild(li);
    });

    contentArea.textContent = ''; // Clear empty/loading state
    contentArea.appendChild(ul);
  }

  // Start
  // Use a slight delay or listen to load to ensure Confluence body exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
  } else {
    setTimeout(init, 500); // Slight delay for dynamic React renders in Confluence
  }

})();