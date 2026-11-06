document.addEventListener('DOMContentLoaded', () => {
  const siteToggleBtn = document.getElementById('site-toggle-btn');
  const siteToggleStatus = document.getElementById('site-toggle-status');
  const siteToggleDomain = document.getElementById('site-toggle-domain');
  
  const globalOnBtn = document.getElementById('global-on-btn');
  const globalOffBtn = document.getElementById('global-off-btn');
  
  const positionLeftBtn = document.getElementById('position-left-btn');
  const positionRightBtn = document.getElementById('position-right-btn');
  
  const themeAutoBtn = document.getElementById('theme-auto-btn');
  const themeLightBtn = document.getElementById('theme-light-btn');
  const themeDarkBtn = document.getElementById('theme-dark-btn');
  
  const onlyForBtn = document.getElementById('only-for-btn');
  const onlyForDomain = document.getElementById('only-for-domain');
  
  const restoreBtn = document.getElementById('restore-btn');
  const requestSupportBtn = document.getElementById('request-support-btn');
  const restoreContainer = document.getElementById('restore-container');
  const supportContainer = document.getElementById('support-container');
  const betaBadge = document.getElementById('beta-badge');
  const resetSiteBtn = document.getElementById('reset-site-btn');
  const resetAllBtn = document.getElementById('reset-all-btn');

  const widthSlider = document.getElementById('width-slider');
  const widthVal = document.getElementById('width-val');
  const resetWidthBtn = document.getElementById('reset-width-btn');

  const heightSlider = document.getElementById('height-slider');
  const heightVal = document.getElementById('height-val');
  const resetHeightBtn = document.getElementById('reset-height-btn');

  const fontSizeSlider = document.getElementById('font-size-slider');
  const fontSizeVal = document.getElementById('font-size-val');
  const resetFontSizeBtn = document.getElementById('reset-font-size-btn');

  // Supported site patterns
  const otherSupportedSites = ['.atlassian.net', 'dev.to', 'wikipedia.org'];
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

  let currentDomain = 'This Site';
  let isSupported = false;
  let siteOverrideActive = false;

  function getCleanDomain(hostname) {
    if (!hostname) return 'This Site';
    return hostname.replace(/^www\./i, '');
  }

  function updatePositionSegment(pos) {
    if (pos === 'right') {
      positionRightBtn.classList.add('active');
      positionRightBtn.setAttribute('aria-pressed', 'true');
      positionLeftBtn.classList.remove('active');
      positionLeftBtn.setAttribute('aria-pressed', 'false');
    } else {
      positionLeftBtn.classList.add('active');
      positionLeftBtn.setAttribute('aria-pressed', 'true');
      positionRightBtn.classList.remove('active');
      positionRightBtn.setAttribute('aria-pressed', 'false');
    }
  }

  // Check current tab to see if it's supported and extract hostname
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0] && tabs[0].url) {
      try {
        const url = new URL(tabs[0].url);
        const hostname = url.hostname;
        currentDomain = getCleanDomain(hostname);
        
        // Update domain texts in UI
        if (siteToggleDomain) siteToggleDomain.textContent = currentDomain;
        if (onlyForDomain) onlyForDomain.textContent = currentDomain;

        // Exclude browser internal pages like chrome://
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
           restoreContainer.style.display = 'none';
           supportContainer.style.display = 'flex';
           betaBadge.style.display = 'none';
           onlyForBtn.style.display = 'none';
           return;
         }

        const cleanHost = hostname.replace(/^www\./i, '');
        isSupported = otherSupportedSites.some(site => cleanHost.endsWith(site)) || isMediumSite(cleanHost);

        if (isSupported) {
          restoreContainer.style.display = 'flex';
          supportContainer.style.display = 'none';
          betaBadge.style.display = 'none';
        } else {
          // Unsupported/Experimental site: show both buttons, show beta badge in header
          restoreContainer.style.display = 'flex';
          supportContainer.style.display = 'flex';
          betaBadge.style.display = 'inline-block';

          // Update helper text to reflect experimental support
          const supportHelperText = supportContainer.querySelector('.helper-text');
          if (supportHelperText) {
            supportHelperText.textContent = 'Explicit support is not yet added for this website. Features might be experimental.';
          }
        }

        // Load settings and bind them
        loadAllSettings();

      } catch (e) {
        // If there's an error parsing the URL
        restoreContainer.style.display = 'none';
        supportContainer.style.display = 'flex';
        betaBadge.style.display = 'none';
        loadAllSettings();
      }
    } else {
      // Cannot determine tab URL, default to showing restore
      restoreContainer.style.display = 'flex';
      betaBadge.style.display = 'none';
      loadAllSettings();
    }
  });

  // Request support action
  requestSupportBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let hostnameParam = '';
      if (tabs && tabs[0] && tabs[0].url) {
        try {
          const url = new URL(tabs[0].url);
          if (url.protocol === 'http:' || url.protocol === 'https:') {
            hostnameParam = url.hostname;
          }
        } catch(e) {}
      }

      const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLScjq5hXfuV2H97XSu918Hl26rVgGxfAJa3Vlc2T97miEMLldw/viewform?usp=pp_url&entry.745477224=${encodeURIComponent(hostnameParam)}`;
      if (formUrl.startsWith('https://docs.google.com/forms/d/e/')) {
        chrome.tabs.create({ url: formUrl });
      }
    });
  });

  function loadAllSettings() {
    const defaultSettings = {
      enabled: true,
      position: 'left',
      theme: 'auto',
      width: 300,
      height: 480,
      fontSize: 14,
      siteSettings: {}
    };

    chrome.storage.local.get(defaultSettings, (result) => {
      const siteSettings = result.siteSettings || {};
      const siteConfig = siteSettings[currentDomain];
      const hasSiteOverride = siteConfig !== undefined && (
        siteConfig.position !== undefined ||
        siteConfig.width !== undefined ||
        siteConfig.height !== undefined ||
        siteConfig.fontSize !== undefined ||
        siteConfig.customized === true
      );

      siteOverrideActive = hasSiteOverride;

      // Update "Only for" button style and state
      if (siteOverrideActive) {
        onlyForBtn.classList.add('active');
        onlyForBtn.setAttribute('aria-pressed', 'true');
      } else {
        onlyForBtn.classList.remove('active');
        onlyForBtn.setAttribute('aria-pressed', 'false');
      }

      // Top-left: Site Quick-Toggle (reflects site-specific enabled status if overridden, otherwise true/default)
      const defaultSiteEnabled = isSupported;
      const siteEnabled = (siteConfig && siteConfig.enabled !== undefined) ? siteConfig.enabled : defaultSiteEnabled;
      if (siteEnabled) {
        siteToggleBtn.classList.add('active');
        siteToggleBtn.classList.remove('inactive');
        siteToggleStatus.textContent = '✓';
        siteToggleBtn.setAttribute('aria-pressed', 'true');
      } else {
        siteToggleBtn.classList.add('inactive');
        siteToggleBtn.classList.remove('active');
        siteToggleStatus.textContent = '✗';
        siteToggleBtn.setAttribute('aria-pressed', 'false');
      }

      // Top-right: Global ON/OFF segmented control & Control Greying logic
      const globalEnabled = result.enabled !== undefined ? result.enabled : true;
      if (globalEnabled) {
        globalOnBtn.classList.add('active');
        globalOnBtn.setAttribute('aria-pressed', 'true');
        globalOffBtn.classList.remove('active');
        globalOffBtn.setAttribute('aria-pressed', 'false');
        
        // Remove disabled styling
        siteToggleBtn.classList.remove('disabled-control');
        document.querySelector('.settings-panel').classList.remove('disabled-control');
        onlyForBtn.classList.remove('disabled-control');
        supportContainer.classList.remove('disabled-control');
        resetAllBtn.classList.remove('disabled-control');

        // Gray out restore button if disabled on this site
        if (siteEnabled) {
          restoreBtn.classList.remove('disabled-control');
          restoreContainer.classList.remove('disabled-control');
        } else {
          restoreBtn.classList.add('disabled-control');
          restoreContainer.classList.add('disabled-control');
        }

        // Gray out reset site button if site settings override is not active
        if (siteOverrideActive) {
          resetSiteBtn.classList.remove('disabled-control');
        } else {
          resetSiteBtn.classList.add('disabled-control');
        }
      } else {
        globalOffBtn.classList.add('active');
        globalOffBtn.setAttribute('aria-pressed', 'true');
        globalOnBtn.classList.remove('active');
        globalOnBtn.setAttribute('aria-pressed', 'false');
        
        // Add disabled styling (grey out all other controls)
        siteToggleBtn.classList.add('disabled-control');
        document.querySelector('.settings-panel').classList.add('disabled-control');
        onlyForBtn.classList.add('disabled-control');
        restoreBtn.classList.add('disabled-control');
        restoreContainer.classList.add('disabled-control');
        supportContainer.classList.add('disabled-control');
        resetSiteBtn.classList.add('disabled-control');
        resetAllBtn.classList.add('disabled-control');
      }

      // Middle controls: TOC Position
      if (siteOverrideActive) {
        const pos = siteConfig.position !== undefined ? siteConfig.position : result.position;
        updatePositionSegment(pos);
      } else {
        updatePositionSegment(result.position);
      }

      // Theme Control
      const currentTheme = result.theme || 'auto';
      if (currentTheme === 'dark') {
        themeDarkBtn.classList.add('active');
        themeDarkBtn.setAttribute('aria-pressed', 'true');
        themeLightBtn.classList.remove('active');
        themeLightBtn.setAttribute('aria-pressed', 'false');
        themeAutoBtn.classList.remove('active');
        themeAutoBtn.setAttribute('aria-pressed', 'false');
      } else if (currentTheme === 'light') {
        themeLightBtn.classList.add('active');
        themeLightBtn.setAttribute('aria-pressed', 'true');
        themeDarkBtn.classList.remove('active');
        themeDarkBtn.setAttribute('aria-pressed', 'false');
        themeAutoBtn.classList.remove('active');
        themeAutoBtn.setAttribute('aria-pressed', 'false');
      } else {
        themeAutoBtn.classList.add('active');
        themeAutoBtn.setAttribute('aria-pressed', 'true');
        themeLightBtn.classList.remove('active');
        themeLightBtn.setAttribute('aria-pressed', 'false');
        themeDarkBtn.classList.remove('active');
        themeDarkBtn.setAttribute('aria-pressed', 'false');
      }

      // Width, Height, Text Size
      const curWidth = (siteOverrideActive && siteConfig && siteConfig.width !== undefined)
        ? siteConfig.width
        : (result.width !== undefined ? result.width : 300);
      const curHeight = (siteOverrideActive && siteConfig && siteConfig.height !== undefined)
        ? siteConfig.height
        : (result.height !== undefined ? result.height : 480);
      const curFontSize = (siteOverrideActive && siteConfig && siteConfig.fontSize !== undefined)
        ? siteConfig.fontSize
        : (result.fontSize !== undefined ? result.fontSize : 14);

      if (widthSlider) {
        widthSlider.value = curWidth;
        if (widthVal) widthVal.textContent = `${curWidth}px`;
      }
      if (heightSlider) {
        heightSlider.value = curHeight;
        if (heightVal) heightVal.textContent = `${curHeight}px`;
      }
      if (fontSizeSlider) {
        fontSizeSlider.value = curFontSize;
        if (fontSizeVal) fontSizeVal.textContent = `${curFontSize}px`;
      }
    });
  }

  // Top-left: Site Quick-Toggle Click
  siteToggleBtn.addEventListener('click', () => {
    chrome.storage.local.get(['siteSettings'], (result) => {
      const siteSettings = result.siteSettings || {};
      const siteConfig = siteSettings[currentDomain] || {};
      const defaultSiteEnabled = isSupported;
      const currentSiteEnabled = siteConfig.enabled !== undefined ? siteConfig.enabled : defaultSiteEnabled;
      
      const newSiteEnabled = !currentSiteEnabled;
      
      if (!siteSettings[currentDomain]) {
        siteSettings[currentDomain] = {};
      }
      siteSettings[currentDomain].enabled = newSiteEnabled;

      chrome.storage.local.set({ siteSettings }, () => {
        loadAllSettings();
      });
    });
  });

  // Top-right: Global On Button Click
  globalOnBtn.addEventListener('click', () => {
    chrome.storage.local.set({ enabled: true }, () => {
      loadAllSettings();
    });
  });

  // Top-right: Global Off Button Click
  globalOffBtn.addEventListener('click', () => {
    chrome.storage.local.set({ enabled: false }, () => {
      loadAllSettings();
    });
  });

  // Middle: TOC Position Change handler
  function handlePositionChange(newPos) {
    if (siteOverrideActive) {
      chrome.storage.local.get('siteSettings', (result) => {
        const siteSettings = result.siteSettings || {};
        if (!siteSettings[currentDomain]) {
          siteSettings[currentDomain] = {};
        }
        siteSettings[currentDomain].position = newPos;
        chrome.storage.local.set({ siteSettings }, () => {
          loadAllSettings();
        });
      });
    } else {
      chrome.storage.local.set({ position: newPos }, () => {
        loadAllSettings();
      });
    }
  }

  positionLeftBtn.addEventListener('click', () => handlePositionChange('left'));
  positionRightBtn.addEventListener('click', () => handlePositionChange('right'));

  // Width, Height, FontSize Change handlers
  function handleWidthChange(newVal, updateAll = false) {
    const val = parseInt(newVal, 10);
    if (isNaN(val)) return;
    if (widthVal) widthVal.textContent = `${val}px`;
    if (widthSlider && widthSlider.value != val) widthSlider.value = val;

    if (siteOverrideActive) {
      chrome.storage.local.get('siteSettings', (result) => {
        const siteSettings = result.siteSettings || {};
        if (!siteSettings[currentDomain]) {
          siteSettings[currentDomain] = {};
        }
        siteSettings[currentDomain].width = val;
        chrome.storage.local.set({ siteSettings }, () => {
          if (updateAll) loadAllSettings();
        });
      });
    } else {
      chrome.storage.local.set({ width: val }, () => {
        if (updateAll) loadAllSettings();
      });
    }
  }

  function handleHeightChange(newVal, updateAll = false) {
    const val = parseInt(newVal, 10);
    if (isNaN(val)) return;
    if (heightVal) heightVal.textContent = `${val}px`;
    if (heightSlider && heightSlider.value != val) heightSlider.value = val;

    if (siteOverrideActive) {
      chrome.storage.local.get('siteSettings', (result) => {
        const siteSettings = result.siteSettings || {};
        if (!siteSettings[currentDomain]) {
          siteSettings[currentDomain] = {};
        }
        siteSettings[currentDomain].height = val;
        chrome.storage.local.set({ siteSettings }, () => {
          if (updateAll) loadAllSettings();
        });
      });
    } else {
      chrome.storage.local.set({ height: val }, () => {
        if (updateAll) loadAllSettings();
      });
    }
  }

  function handleFontSizeChange(newVal, updateAll = false) {
    const val = parseInt(newVal, 10);
    if (isNaN(val)) return;
    if (fontSizeVal) fontSizeVal.textContent = `${val}px`;
    if (fontSizeSlider && fontSizeSlider.value != val) fontSizeSlider.value = val;

    if (siteOverrideActive) {
      chrome.storage.local.get('siteSettings', (result) => {
        const siteSettings = result.siteSettings || {};
        if (!siteSettings[currentDomain]) {
          siteSettings[currentDomain] = {};
        }
        siteSettings[currentDomain].fontSize = val;
        chrome.storage.local.set({ siteSettings }, () => {
          if (updateAll) loadAllSettings();
        });
      });
    } else {
      chrome.storage.local.set({ fontSize: val }, () => {
        if (updateAll) loadAllSettings();
      });
    }
  }

  if (widthSlider) {
    widthSlider.addEventListener('input', (e) => {
      handleWidthChange(e.target.value, false);
    });
    widthSlider.addEventListener('change', (e) => {
      handleWidthChange(e.target.value, true);
    });
  }
  if (resetWidthBtn) {
    resetWidthBtn.addEventListener('click', () => {
      handleWidthChange(300, true);
    });
  }

  if (heightSlider) {
    heightSlider.addEventListener('input', (e) => {
      handleHeightChange(e.target.value, false);
    });
    heightSlider.addEventListener('change', (e) => {
      handleHeightChange(e.target.value, true);
    });
  }
  if (resetHeightBtn) {
    resetHeightBtn.addEventListener('click', () => {
      handleHeightChange(480, true);
    });
  }

  if (fontSizeSlider) {
    fontSizeSlider.addEventListener('input', (e) => {
      handleFontSizeChange(e.target.value, false);
    });
    fontSizeSlider.addEventListener('change', (e) => {
      handleFontSizeChange(e.target.value, true);
    });
  }
  if (resetFontSizeBtn) {
    resetFontSizeBtn.addEventListener('click', () => {
      handleFontSizeChange(14, true);
    });
  }

  // Theme Toggle Clicks
  themeAutoBtn.addEventListener('click', () => {
    chrome.storage.local.set({ theme: 'auto' }, () => {
      loadAllSettings();
    });
  });

  themeLightBtn.addEventListener('click', () => {
    chrome.storage.local.set({ theme: 'light' }, () => {
      loadAllSettings();
    });
  });

  themeDarkBtn.addEventListener('click', () => {
    chrome.storage.local.set({ theme: 'dark' }, () => {
      loadAllSettings();
    });
  });

  // Bottom: "Only for <site>" Button Click
  onlyForBtn.addEventListener('click', () => {
    chrome.storage.local.get(['enabled', 'position', 'width', 'height', 'fontSize', 'siteSettings'], (result) => {
      const siteSettings = result.siteSettings || {};
      const siteConfig = siteSettings[currentDomain] || {};
      const hasOverride = siteConfig.position !== undefined ||
                          siteConfig.width !== undefined ||
                          siteConfig.height !== undefined ||
                          siteConfig.fontSize !== undefined ||
                          siteConfig.customized === true;

      if (!siteSettings[currentDomain]) {
        siteSettings[currentDomain] = {};
      }

      if (hasOverride) {
        // Disable override: delete site-specific overrides
        delete siteSettings[currentDomain].position;
        delete siteSettings[currentDomain].width;
        delete siteSettings[currentDomain].height;
        delete siteSettings[currentDomain].fontSize;
        delete siteSettings[currentDomain].customized;
        
        // Clean up empty site settings object
        if (Object.keys(siteSettings[currentDomain]).length === 0) {
          delete siteSettings[currentDomain];
        }
      } else {
        // Enable override: copy global settings
        siteSettings[currentDomain].position = result.position || 'left';
        siteSettings[currentDomain].width = result.width !== undefined ? result.width : 300;
        siteSettings[currentDomain].height = result.height !== undefined ? result.height : 480;
        siteSettings[currentDomain].fontSize = result.fontSize !== undefined ? result.fontSize : 14;
        siteSettings[currentDomain].customized = true;
      }

      chrome.storage.local.set({ siteSettings }, () => {
        loadAllSettings();
      });
    });
  });

  // Restore TOC button action (only resets closed/minimized state, doesn't force enable)
  restoreBtn.addEventListener('click', () => {
    chrome.storage.local.get(['siteSettings'], (result) => {
      const siteSettings = result.siteSettings || {};
      const siteConfig = siteSettings[currentDomain] || {};
      const hasSiteOverride = siteConfig.position !== undefined ||
                              siteConfig.width !== undefined ||
                              siteConfig.height !== undefined ||
                              siteConfig.fontSize !== undefined ||
                              siteConfig.customized === true;

      if (hasSiteOverride) {
        if (!siteSettings[currentDomain]) siteSettings[currentDomain] = {};
        siteSettings[currentDomain].closed = false;
        siteSettings[currentDomain].minimized = true;
        siteSettings[currentDomain].pinned = false;
        chrome.storage.local.set({ siteSettings }, () => {
          loadAllSettings();
          showRestoreSuccess();
        });
      } else {
        chrome.storage.local.set({ closed: false, minimized: true, pinned: false }, () => {
          loadAllSettings();
          showRestoreSuccess();
        });
      }
    });
  });

  function showRestoreSuccess() {
    const originalText = restoreBtn.textContent;
    restoreBtn.textContent = 'Restored!';
    setTimeout(() => {
      restoreBtn.textContent = originalText;
    }, 1500);
  }

  // Reset Site Settings button action
  resetSiteBtn.addEventListener('click', () => {
    chrome.storage.local.get('siteSettings', (result) => {
      const siteSettings = result.siteSettings || {};
      if (siteSettings[currentDomain]) {
        delete siteSettings[currentDomain];
        chrome.storage.local.set({ siteSettings }, () => {
          loadAllSettings();
          const originalText = resetSiteBtn.textContent;
          resetSiteBtn.textContent = 'Reset!';
          setTimeout(() => {
            resetSiteBtn.textContent = originalText;
          }, 1500);
        });
      } else {
        const originalText = resetSiteBtn.textContent;
        resetSiteBtn.textContent = 'Already Default';
        setTimeout(() => {
          resetSiteBtn.textContent = originalText;
        }, 1500);
      }
    });
  });

  // Reset All Settings button action
  resetAllBtn.addEventListener('click', () => {
    chrome.storage.local.set({
      enabled: true,
      position: 'left',
      closed: false,
      minimized: true,
      pinned: false,
      theme: 'auto',
      width: 300,
      height: 480,
      fontSize: 14,
      siteSettings: {}
    }, () => {
      loadAllSettings();
      const originalText = resetAllBtn.textContent;
      resetAllBtn.textContent = 'Reset All!';
      setTimeout(() => {
        resetAllBtn.textContent = originalText;
      }, 1500);
    });
  });
});