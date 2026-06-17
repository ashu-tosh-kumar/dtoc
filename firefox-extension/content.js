// Immediately invoked function expression to avoid polluting the global namespace
(() => {
  // --- Constants & State ---
  const SETTINGS_KEY = {
    ENABLED: 'enabled',
    POSITION: 'position',
    CLOSED: 'closed',
    MINIMIZED: 'minimized',
    PINNED: 'pinned'
  };

  // Map storage keys to internal state property names to decouple them
  const STATE_KEY_MAP = {
    [SETTINGS_KEY.ENABLED]: 'enabled',
    [SETTINGS_KEY.POSITION]: 'position',
    [SETTINGS_KEY.CLOSED]: 'closed',
    [SETTINGS_KEY.MINIMIZED]: 'minimized',
    [SETTINGS_KEY.PINNED]: 'pinned'
  };

  let state = {
    enabled: true,
    position: 'left',
    closed: false,
    minimized: true, // New default is unpinned (minimized/collapsed)
    pinned: false,
    theme: 'auto'
  };

  let shadowRoot = null;
  let container = null;
  let contentArea = null;

  // Icons
  const ICON_PIN = 'pin';
  const ICON_CLOSE = 'close';

  function createIconElement(iconType) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");

    if (iconType === 'pin') {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M12 17v5M5 17h14v-1.76a2 2 0 0 0-.44-1.24l-2.78-3.48A2 2 0 0 1 15 9.28V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v4.28c0 .43-.14.85-.4 1.2l-2.8 3.5a2 2 0 0 0-.4 1.22V17z");
      svg.appendChild(path);
    } else if (iconType === 'close') {
      const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line1.setAttribute("x1", "18");
      line1.setAttribute("y1", "6");
      line1.setAttribute("x2", "6");
      line1.setAttribute("y2", "18");
      svg.appendChild(line1);

      const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line2.setAttribute("x1", "6");
      line2.setAttribute("y1", "6");
      line2.setAttribute("x2", "18");
      line2.setAttribute("y2", "18");
      svg.appendChild(line2);
    }

    return svg;
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
      if (state.enabled && isViewMode()) {
        injectUI();
        applyStateToUI();
        parseHeadingsAndRender();
        alignContainerWithTitle();
        setupMutationObserver();
      }
    });

    listenForSettingsChanges();

    // Add prefers-color-scheme listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (state.theme === 'auto') {
        applyStateToUI();
      }
    });

    // Observer for body/html theme changes (e.g. classes or attributes like data-theme)
    const pageThemeObserver = new MutationObserver(() => {
      if (isViewMode() && container) {
        applyStateToUI();
      }
    });
    
    pageThemeObserver.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'style', 'data-theme', 'data-color-mode'] 
    });
    
    if (document.body) {
      pageThemeObserver.observe(document.body, { 
        attributes: true, 
        attributeFilter: ['class', 'style'] 
      });
    }

    // Observer for Dark Reader extension toggling (injects/removes <style class="darkreader"> in <head>)
    if (document.head) {
      const darkReaderObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of [...mutation.addedNodes, ...mutation.removedNodes]) {
            if ((node.nodeName === 'STYLE' && node.classList?.contains('darkreader')) ||
                (node.nodeName === 'META' && node.getAttribute?.('name') === 'darkreader')) {
              if (isViewMode() && container) {
                applyStateToUI();
              }
              return;
            }
          }
        }
      });
      darkReaderObserver.observe(document.head, { childList: true });
    }

    window.addEventListener('resize', () => {
      if (isViewMode()) {
        alignContainerWithTitle();
      }
    });
  }

  // Constant list of Medium publication domains (excluding medium.com itself)
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
    const cleanHost = hostname.replace(/^www\./i, '');
    return cleanHost === 'medium.com' ||
           cleanHost.endsWith('.medium.com') ||
           MEDIUM_DOMAINS.some(domain => 
             cleanHost === domain || cleanHost.endsWith('.' + domain)
           );
  }

  function isSupportedSite() {
    const hostname = window.location.hostname;
    const cleanHost = hostname.replace(/^www\./i, '');
    const otherSupported = ['.atlassian.net', 'dev.to'];
    return otherSupported.some(site => cleanHost.endsWith(site)) || isMediumSite(cleanHost);
  }

  function isViewMode() {
    const path = window.location.pathname;
    const hostname = window.location.hostname;

    if (hostname === 'dev.to' || hostname.endsWith('.dev.to')) {
      // Dev.to edit paths: /new, or ending in /edit
      if (path === '/new' || path.endsWith('/edit') || path.includes('/edit/')) return false;
      // Exclude home page
      if (path === '/' || path === '') return false;
    } else if (isMediumSite(hostname)) {
      // Medium edit paths: /new-story, or ending in /edit
      if (path === '/new-story' || path.endsWith('/edit') || path.includes('/edit/')) return false;
      // Exclude home page
      if (path === '/' || path === '') return false;
    } else if (hostname === 'atlassian.net' || hostname.endsWith('.atlassian.net')) {
      // Confluence typically has '/edit' in the URL or 'editMode' in the body class when editing
      if (path.includes('/edit') || path.includes('/edit-v2')) return false;

      // Some pages append ?mode=edit or similar
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'edit') return false;
    } else {
      // Generic site exclusions: check for edit/new paths as distinct segments or ends
      const segments = path.toLowerCase().split('/');
      const isEditKeyword = (seg) => {
        if (seg === 'edit' || seg.startsWith('edit-') || seg === 'editor' || seg === 'write' || seg === 'compose' || seg === 'draft') return true;
        if (seg.startsWith('new') && !seg.startsWith('news')) return true;
        return false;
      };
      if (segments.some(isEditKeyword) || 
          path.endsWith('/edit') || 
          path.includes('/edit/') ||
          path.includes('/editor/')) {
        return false;
      }
      if (path === '/' || path === '' || path === '/index.html') return false;
    }

    return true;
  }

  // --- Settings Management ---

  function loadSettings(callback) {
    const keys = ['enabled', 'position', 'closed', 'minimized', 'pinned', 'siteSettings', 'theme'];
    browser.storage.local.get(keys, (result) => {
      const currentDomain = window.location.hostname.replace(/^www\./i, '');
      const siteSettings = result.siteSettings || {};
      const siteConfig = siteSettings[currentDomain] || {};

      const globalEnabled = result.enabled !== undefined ? result.enabled : true;
      const defaultSiteEnabled = isSupportedSite();
      const siteEnabled = siteConfig.enabled !== undefined ? siteConfig.enabled : defaultSiteEnabled;
      state.enabled = globalEnabled && siteEnabled;

      const globalPosition = result.position || 'left';
      state.position = siteConfig.position !== undefined ? siteConfig.position : globalPosition;

      state.theme = result.theme || 'auto';

      const hasSiteOverride = siteConfig.position !== undefined;
      const defaultClosed = false;
      const closedVal = hasSiteOverride && siteConfig.closed !== undefined ? siteConfig.closed : (result.closed !== undefined ? result.closed : defaultClosed);
      state.closed = closedVal;

      // Pin/minimize dual state resolution
      let pinnedVal = undefined;
      let minimizedVal = undefined;

      if (hasSiteOverride) {
        pinnedVal = siteConfig.pinned;
        minimizedVal = siteConfig.minimized;
      } else {
        pinnedVal = result.pinned;
        minimizedVal = result.minimized;
      }

      if (pinnedVal !== undefined) {
        state.pinned = pinnedVal;
        state.minimized = !pinnedVal;
      } else if (minimizedVal !== undefined) {
        state.minimized = minimizedVal;
        state.pinned = !minimizedVal;
      } else {
        state.pinned = false;
        state.minimized = true; // Default unpinned/minimized (peek strip collapsed)
      }

      if (callback) callback();
    });
  }

  function updateSetting(storageKey, value) {
    browser.storage.local.get(['siteSettings'], (result) => {
      const currentDomain = window.location.hostname.replace(/^www\./i, '');
      const siteSettings = result.siteSettings || {};
      const siteConfig = siteSettings[currentDomain] || {};
      const hasSiteOverride = siteConfig.position !== undefined;

      // Update local state first
      if (storageKey === 'pinned') {
        state.pinned = value;
        state.minimized = !value;
      } else if (storageKey === 'minimized') {
        state.minimized = value;
        state.pinned = !value;
      } else {
        const stateKey = STATE_KEY_MAP[storageKey];
        if (stateKey) {
          state[stateKey] = value;
        }
      }

      if (hasSiteOverride && (storageKey === 'pinned' || storageKey === 'minimized' || storageKey === SETTINGS_KEY.CLOSED)) {
        if (!siteSettings[currentDomain]) {
          siteSettings[currentDomain] = {};
        }
        if (storageKey === 'pinned') {
          siteSettings[currentDomain].pinned = value;
          siteSettings[currentDomain].minimized = !value;
        } else if (storageKey === 'minimized') {
          siteSettings[currentDomain].minimized = value;
          siteSettings[currentDomain].pinned = !value;
        } else {
          siteSettings[currentDomain][storageKey] = value;
        }
        browser.storage.local.set({ siteSettings }, () => {
          applyStateToUI();
        });
      } else {
        if (storageKey === 'pinned') {
          browser.storage.local.set({ pinned: value, minimized: !value }, () => {
            applyStateToUI();
          });
        } else if (storageKey === 'minimized') {
          browser.storage.local.set({ minimized: value, pinned: !value }, () => {
            applyStateToUI();
          });
        } else {
          browser.storage.local.set({ [storageKey]: value }, () => {
            applyStateToUI();
          });
        }
      }
    });
  }

  function listenForSettingsChanges() {
    browser.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        loadSettings(() => {
          if (state.enabled && isViewMode()) {
            if (!document.getElementById('dtoc-host')) {
              injectUI();
              applyStateToUI();
              parseHeadingsAndRender();
              alignContainerWithTitle();
              setupMutationObserver();
            } else {
              applyStateToUI();
            }
          } else {
            applyStateToUI();
          }
        });
      }
    });
  }

  // --- UI Injection ---

  function injectUI() {
    // Don't inject multiple times
    if (document.getElementById('dtoc-host')) return;

    const host = document.createElement('div');
    host.id = 'dtoc-host';
    // Protect host from Dark Reader: it lives in the light DOM and Dark Reader
    // will try to set a dark background on it, which breaks our transparent notches.
    host.style.setProperty('background', 'transparent', 'important');
    host.style.setProperty('border', 'none', 'important');
    host.style.setProperty('box-shadow', 'none', 'important');
    host.style.setProperty('display', 'block', 'important');
    host.style.setProperty('position', 'static', 'important');
    host.style.setProperty('padding', '0', 'important');
    host.style.setProperty('margin', '0', 'important');
    document.body.appendChild(host);

    shadowRoot = host.attachShadow({ mode: 'closed' });

    // Fetch CSS file
    const cssUrl = browser.runtime.getURL('content.css');
    const linkEl = document.createElement('link');
    linkEl.rel = 'stylesheet';
    linkEl.href = cssUrl;
    shadowRoot.appendChild(linkEl);

    // Semantic Navigation Landmark
    container = document.createElement('nav');
    container.id = 'dtoc-container';
    container.setAttribute('aria-label', 'Table of Contents');
    container.setAttribute('aria-expanded', 'false');
    if (!isSupportedSite()) {
      container.classList.add('experimental');
    }

    // Toggle aria-expanded on hover
    container.addEventListener('mouseenter', () => {
      container.setAttribute('aria-expanded', 'true');
    });
    container.addEventListener('mouseleave', () => {
      if (!state.pinned) {
        container.setAttribute('aria-expanded', 'false');
      }
    });

    // 1. Expanded Panel (Header + List)
    const expandedPanel = document.createElement('div');
    expandedPanel.className = 'dtoc-expanded-panel';

    // Header
    const header = document.createElement('div');
    header.className = 'dtoc-header';

    const title = document.createElement('h2');
    title.className = 'dtoc-title';
    title.textContent = isSupportedSite() ? 'Table of Contents' : 'Table of Contents (Beta)';

    const controls = document.createElement('div');
    controls.className = 'dtoc-controls';

    const pinBtn = document.createElement('button');
    pinBtn.className = 'icon-btn pin-btn';
    pinBtn.title = state.pinned ? 'Unpin TOC' : 'Pin TOC';
    if (state.pinned) pinBtn.classList.add('active');
    pinBtn.appendChild(createIconElement(ICON_PIN));
    pinBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSetting('pinned', !state.pinned);
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'icon-btn close-btn';
    closeBtn.title = 'Close';
    closeBtn.appendChild(createIconElement(ICON_CLOSE));
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSetting(SETTINGS_KEY.CLOSED, true);
    });

    controls.appendChild(pinBtn);
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

    expandedPanel.appendChild(header);
    expandedPanel.appendChild(contentArea);
    container.appendChild(expandedPanel);

    // 2. Collapsed Peek Strip
    const collapsedStrip = document.createElement('div');
    collapsedStrip.className = 'dtoc-collapsed-strip';

    const notchesContainer = document.createElement('div');
    notchesContainer.className = 'dtoc-notches-container';
    collapsedStrip.appendChild(notchesContainer);

    // Clicking the collapsed strip expands it permanently by pinning
    collapsedStrip.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSetting('pinned', true);
    });

    container.appendChild(collapsedStrip);
    shadowRoot.appendChild(container);

    // Keyboard accessibility listener (Alt+T)
    window.addEventListener('keydown', handleKeyDown);
  }

  function handleKeyDown(e) {
    if (e.altKey && e.code === 'KeyT') {
      e.preventDefault();
      toggleKeyboardExpansion();
    }
  }

  function toggleKeyboardExpansion() {
    if (!container) return;
    const isCurrentlyExpanded = container.classList.contains('keyboard-expanded') || container.classList.contains('pinned');
    if (isCurrentlyExpanded) {
      container.classList.remove('keyboard-expanded');
      container.setAttribute('aria-expanded', 'false');
      container.blur();
    } else {
      container.classList.add('keyboard-expanded');
      container.setAttribute('aria-expanded', 'true');
      const firstLink = shadowRoot.querySelector('.toc-link');
      if (firstLink) {
        firstLink.focus();
      }
    }
  }

  function isPageDark() {
    if (!document.body || !document.documentElement) return false;

    // 0. Direct Dark Reader detection — Dark Reader in Dynamic mode doesn't
    //    change body/html backgroundColor; it uses CSS variables and granular
    //    style overrides, so background-color sampling misses it entirely.
    if (document.querySelector('meta[name="darkreader"]') ||
        document.documentElement.hasAttribute('data-darkreader-mode') ||
        document.querySelector('style.darkreader, style.darkreader--sync')) {
      return true;
    }

    // Helper to parse rgb/rgba color string
    function parseColor(colorStr) {
      if (!colorStr || colorStr === 'transparent') return null;
      const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!match) return null;
      return {
        r: parseInt(match[1], 10),
        g: parseInt(match[2], 10),
        b: parseInt(match[3], 10),
        a: match[4] !== undefined ? parseFloat(match[4]) : 1
      };
    }

    // Helper to calculate brightness (0-255)
    function getBrightness(color) {
      if (!color || color.a === 0) return null;
      return (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
    }

    // 1. Check content container background first (it's the reading area)
    const contentContainer = getContentContainer();
    if (contentContainer) {
      const contentStyle = window.getComputedStyle(contentContainer);
      const contentBg = parseColor(contentStyle.backgroundColor);
      if (contentBg && contentBg.a > 0.1) {
        const bgBrightness = getBrightness(contentBg);
        if (bgBrightness !== null) {
          return bgBrightness < 128;
        }
      }
    }

    // 2. Fallback to body and documentElement background colors
    const bodyStyle = window.getComputedStyle(document.body);
    const htmlStyle = window.getComputedStyle(document.documentElement);

    const bodyBg = parseColor(bodyStyle.backgroundColor);
    const htmlBg = parseColor(htmlStyle.backgroundColor);

    let bgBrightness = null;
    if (bodyBg && bodyBg.a > 0.1) {
      bgBrightness = getBrightness(bodyBg);
    } else if (htmlBg && htmlBg.a > 0.1) {
      bgBrightness = getBrightness(htmlBg);
    }

    if (bgBrightness !== null) {
      return bgBrightness < 128;
    }

    // 3. Fallback: check text color of content container (light text means dark page)
    if (contentContainer) {
      const contentStyle = window.getComputedStyle(contentContainer);
      const contentColor = parseColor(contentStyle.color);
      if (contentColor && contentColor.a > 0.1) {
        const textBrightness = getBrightness(contentColor);
        if (textBrightness !== null) {
          return textBrightness > 150;
        }
      }
    }

    // 4. Fallback: check text color of body
    const bodyColor = parseColor(bodyStyle.color);
    if (bodyColor && bodyColor.a > 0.1) {
      const textBrightness = getBrightness(bodyColor);
      if (textBrightness !== null) {
        return textBrightness > 150;
      }
    }

    // 5. Secondary fallback: prefers-color-scheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyStateToUI() {
    if (!container) return;

    if (!state.enabled || state.closed) {
      container.classList.add('hidden');
    } else {
      container.classList.remove('hidden');
    }

    if (state.pinned) {
      container.classList.add('pinned');
      container.setAttribute('aria-expanded', 'true');
    } else {
      container.classList.remove('pinned');
      if (!container.classList.contains('keyboard-expanded') && !container.matches(':hover')) {
        container.setAttribute('aria-expanded', 'false');
      }
    }

    // Keep minimized key in sync for legacy storage support
    if (state.minimized) {
      container.classList.add('minimized');
    } else {
      container.classList.remove('minimized');
    }

    // Update pin button state
    const pinBtn = shadowRoot.querySelector('.pin-btn');
    if (pinBtn) {
      if (state.pinned) {
        pinBtn.classList.add('active');
        pinBtn.title = 'Unpin TOC';
      } else {
        pinBtn.classList.remove('active');
        pinBtn.title = 'Pin TOC';
      }
    }

    // Position
    container.classList.remove('position-left', 'position-right');
    container.classList.add(`position-${state.position}`);

    // Theme
    let isDark = false;
    if (state.theme === 'dark') {
      isDark = true;
    } else if (state.theme === 'light') {
      isDark = false;
    } else {
      isDark = isPageDark();
    }

    if (isDark) {
      container.classList.add('theme-dark');
    } else {
      container.classList.remove('theme-dark');
    }

    // Set page-dark/page-light for notches contrast (independent of container theme)
    if (isPageDark()) {
      container.classList.add('page-dark');
      container.classList.remove('page-light');
    } else {
      container.classList.add('page-light');
      container.classList.remove('page-dark');
    }
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

      // If UI is supposed to be present but was removed from DOM, re-inject it
      const hostExists = document.getElementById('dtoc-host');
      if (!hostExists && isViewMode() && state.enabled && !state.closed) {
        injectUI();
        applyStateToUI();
        parseHeadingsAndRender();
      }

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
    if (
      window.location.hostname === 'dev.to' ||
      window.location.hostname.endsWith('.dev.to')
    ) {
      selectors = [
        '#article-body',
        '.crayons-article__body',
        '.crayons-article__main'
      ];
    } else if (isMediumSite(window.location.hostname)) {
      selectors = [
        'article'
      ];
    } else if (
      window.location.hostname === 'atlassian.net' ||
      window.location.hostname.endsWith('.atlassian.net')
    ) {
      // Attempt to find the main content container in Confluence View Mode
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
      .replace(/\s*\|\s*by\s+[^|]*\|\s*[^|]+\s*$/i, '')
      .replace(/\s*\|\s*Medium\s*$/i, '')
      .replace(/\s*-\s*Medium\s*$/i, '')
      .trim();

    return {
      text: titleText || 'Top',
      element: null
    };
  }

  // Active Heading Scrollspy Tracker
  let scrollspyListener = null;

  function setupScrollspy() {
    if (scrollspyListener) {
      window.removeEventListener('scroll', scrollspyListener);
    }

    const contentContainer = getContentContainer();
    if (!contentContainer) return;

    const headings = Array.from(contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .filter(h => h.offsetParent !== null && h.textContent.trim());

    scrollspyListener = () => {
      // Align container dynamically
      alignContainerWithTitle();

      let activeId = null;
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;

      // Find heading closest to top of viewport but not past it
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        const headingTop = heading.getBoundingClientRect().top + scrollPosition;
        if (scrollPosition >= headingTop - 120) {
          activeId = heading.id;
        } else {
          break;
        }
      }

      // If at very top, highlight page title
      if (!activeId && headings.length > 0 && scrollPosition < 100) {
        activeId = '';
      }

      setActiveHeading(activeId);
    };

    window.addEventListener('scroll', scrollspyListener, { passive: true });
    scrollspyListener(); // Initialize once immediately
  }

  function setActiveHeading(activeId) {
    if (!shadowRoot) return;

    // Remove active styles from links and notches
    const links = shadowRoot.querySelectorAll('.toc-link');
    links.forEach(link => link.classList.remove('active'));

    const notches = shadowRoot.querySelectorAll('.dtoc-notch');
    notches.forEach(notch => notch.classList.remove('active'));

    if (activeId === '' || activeId === null) {
      const titleLink = shadowRoot.querySelector('.toc-title-item .toc-link');
      if (titleLink) titleLink.classList.add('active');
      const firstNotch = shadowRoot.querySelector('.dtoc-notch[data-id=""]');
      if (firstNotch) {
        firstNotch.classList.add('active');
        firstNotch.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    } else {
      const activeLink = shadowRoot.querySelector(`.toc-link[href="#${activeId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        activeLink.scrollIntoView({ behavior: 'auto', block: 'nearest' });
      }

      const activeNotch = shadowRoot.querySelector(`.dtoc-notch[data-id="${activeId}"]`);
      if (activeNotch) {
        activeNotch.classList.add('active');
        activeNotch.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }
  }

  function alignContainerWithTitle() {
    if (!container) return;

    const titleInfo = getPageTitle();
    let titleEl = titleInfo.element;

    if (!titleEl) {
      const contentContainer = getContentContainer();
      if (contentContainer) {
        titleEl = contentContainer.querySelector('h1, h2, h3, h4, h5, h6');
      }
    }

    let targetCenterViewport = 120; // fallback if no title element found

    if (titleEl) {
      const rect = titleEl.getBoundingClientRect();
      targetCenterViewport = rect.top + rect.height / 2;
    }

    const containerTop = Math.max(64, targetCenterViewport - 56);
    container.style.top = `${containerTop}px`;

    // Max height to prevent overflow, capped at 480px for a more compact Notion-like layout
    const maxContainerHeight = Math.min(480, window.innerHeight - containerTop - 24);
    container.style.maxHeight = `${Math.max(150, maxContainerHeight)}px`;
  }

  function parseHeadingsAndRender() {
    if (!contentArea) return;

    const contentContainer = getContentContainer();
    if (!contentContainer) {
      contentArea.textContent = '';
      return;
    }

    const headings = contentContainer.querySelectorAll('h1, h2, h3, h4, h5, h6');

    const ul = document.createElement('ul');
    ul.className = 'toc-list';

    const titleInfo = getPageTitle();

    const firstHeading = headings[0];
    const hasTitlePrepend = titleInfo.element !== firstHeading;

    const notchesContainer = shadowRoot.querySelector('.dtoc-notches-container');
    if (notchesContainer) {
      notchesContainer.textContent = '';
    }

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

      // Add notch for title
      if (notchesContainer) {
        const titleNotch = document.createElement('div');
        titleNotch.className = 'dtoc-notch dtoc-notch-level-1';
        titleNotch.setAttribute('data-id', '');
        titleNotch.title = titleInfo.text;
        titleNotch.addEventListener('click', (e) => {
          e.stopPropagation();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        notchesContainer.appendChild(titleNotch);
      }
    }

    const idCounts = {};

    headings.forEach((heading, index) => {
      if (heading.offsetParent === null) return;

      const text = heading.textContent.trim();
      if (!text) return;

      const level = parseInt(heading.tagName.substring(1), 10);

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

      a.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState(null, null, `#${id}`);
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const originalScrollMargin = heading.style.scrollMarginTop;
        heading.style.scrollMarginTop = '70px';

        setTimeout(() => {
          heading.style.scrollMarginTop = originalScrollMargin;
        }, 1000);
      });

      li.appendChild(a);
      ul.appendChild(li);

      // Add notch for heading
      if (notchesContainer) {
        const notch = document.createElement('div');
        notch.className = `dtoc-notch dtoc-notch-level-${level}`;
        notch.setAttribute('data-id', id);
        notch.title = text;
        notch.addEventListener('click', (e) => {
          e.stopPropagation();
          heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const originalScrollMargin = heading.style.scrollMarginTop;
          heading.style.scrollMarginTop = '70px';
          setTimeout(() => {
            heading.style.scrollMarginTop = originalScrollMargin;
          }, 1000);
        });
        notchesContainer.appendChild(notch);
      }
    });

    contentArea.textContent = '';
    contentArea.appendChild(ul);

    // Initial Scrollspy attachment
    setupScrollspy();

    // Align container
    alignContainerWithTitle();
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
  } else {
    setTimeout(init, 500);
  }

})();