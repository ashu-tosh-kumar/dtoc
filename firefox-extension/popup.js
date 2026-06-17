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

  // Supported site patterns
  const otherSupportedSites = ['.atlassian.net', 'dev.to'];
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
      positionLeftBtn.classList.remove('active');
    } else {
      positionLeftBtn.classList.add('active');
      positionRightBtn.classList.remove('active');
    }
  }

  // Check current tab to see if it's supported and extract hostname
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs && tabs[0] && tabs[0].url) {
      try {
        const url = new URL(tabs[0].url);
        const hostname = url.hostname;
        currentDomain = getCleanDomain(hostname);
        
        // Update domain texts in UI
        if (siteToggleDomain) siteToggleDomain.textContent = currentDomain;
        if (onlyForDomain) onlyForDomain.textContent = currentDomain;

        // Exclude browser internal pages like about:
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
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
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
        browser.tabs.create({ url: formUrl });
      }
    });
  });

  function loadAllSettings() {
    const defaultSettings = {
      enabled: true,
      position: 'left',
      theme: 'auto',
      siteSettings: {}
    };

    browser.storage.local.get(defaultSettings).then((result) => {
      const siteSettings = result.siteSettings || {};
      const siteConfig = siteSettings[currentDomain];
      const hasSiteOverride = siteConfig !== undefined && siteConfig.position !== undefined;

      siteOverrideActive = hasSiteOverride;

      // Update "Only for" button style
      if (siteOverrideActive) {
        onlyForBtn.classList.add('active');
      } else {
        onlyForBtn.classList.remove('active');
      }

      // Top-left: Site Quick-Toggle (reflects site-specific enabled status if overridden, otherwise true/default)
      const defaultSiteEnabled = isSupported;
      const siteEnabled = (siteConfig && siteConfig.enabled !== undefined) ? siteConfig.enabled : defaultSiteEnabled;
      if (siteEnabled) {
        siteToggleBtn.classList.add('active');
        siteToggleBtn.classList.remove('inactive');
        siteToggleStatus.textContent = '✓';
      } else {
        siteToggleBtn.classList.add('inactive');
        siteToggleBtn.classList.remove('active');
        siteToggleStatus.textContent = '✗';
      }

      // Top-right: Global ON/OFF segmented control & Control Greying logic
      const globalEnabled = result.enabled !== undefined ? result.enabled : true;
      if (globalEnabled) {
        globalOnBtn.classList.add('active');
        globalOffBtn.classList.remove('active');
        
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
        globalOnBtn.classList.remove('active');
        
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
        themeLightBtn.classList.remove('active');
        themeAutoBtn.classList.remove('active');
      } else if (currentTheme === 'light') {
        themeLightBtn.classList.add('active');
        themeDarkBtn.classList.remove('active');
        themeAutoBtn.classList.remove('active');
      } else {
        themeAutoBtn.classList.add('active');
        themeLightBtn.classList.remove('active');
        themeDarkBtn.classList.remove('active');
      }
    });
  }

  // Top-left: Site Quick-Toggle Click
  siteToggleBtn.addEventListener('click', () => {
    browser.storage.local.get(['siteSettings']).then((result) => {
      const siteSettings = result.siteSettings || {};
      const siteConfig = siteSettings[currentDomain] || {};
      const defaultSiteEnabled = isSupported;
      const currentSiteEnabled = siteConfig.enabled !== undefined ? siteConfig.enabled : defaultSiteEnabled;
      
      const newSiteEnabled = !currentSiteEnabled;
      
      if (!siteSettings[currentDomain]) {
        siteSettings[currentDomain] = {};
      }
      siteSettings[currentDomain].enabled = newSiteEnabled;

      browser.storage.local.set({ siteSettings }).then(() => {
        loadAllSettings();
      });
    });
  });

  // Top-right: Global On Button Click
  globalOnBtn.addEventListener('click', () => {
    browser.storage.local.set({ enabled: true }).then(() => {
      loadAllSettings();
    });
  });

  // Top-right: Global Off Button Click
  globalOffBtn.addEventListener('click', () => {
    browser.storage.local.set({ enabled: false }).then(() => {
      loadAllSettings();
    });
  });

  // Middle: TOC Position Change handler
  function handlePositionChange(newPos) {
    if (siteOverrideActive) {
      browser.storage.local.get('siteSettings').then((result) => {
        const siteSettings = result.siteSettings || {};
        if (!siteSettings[currentDomain]) {
          siteSettings[currentDomain] = {};
        }
        siteSettings[currentDomain].position = newPos;
        browser.storage.local.set({ siteSettings }).then(() => {
          loadAllSettings();
        });
      });
    } else {
      browser.storage.local.set({ position: newPos }).then(() => {
        loadAllSettings();
      });
    }
  }

  positionLeftBtn.addEventListener('click', () => handlePositionChange('left'));
  positionRightBtn.addEventListener('click', () => handlePositionChange('right'));

  // Theme Toggle Clicks
  themeAutoBtn.addEventListener('click', () => {
    browser.storage.local.set({ theme: 'auto' }).then(() => {
      loadAllSettings();
    });
  });

  themeLightBtn.addEventListener('click', () => {
    browser.storage.local.set({ theme: 'light' }).then(() => {
      loadAllSettings();
    });
  });

  themeDarkBtn.addEventListener('click', () => {
    browser.storage.local.set({ theme: 'dark' }).then(() => {
      loadAllSettings();
    });
  });

  // Bottom: "Only for <site>" Button Click
  onlyForBtn.addEventListener('click', () => {
    browser.storage.local.get(['enabled', 'position', 'siteSettings']).then((result) => {
      const siteSettings = result.siteSettings || {};
      const siteConfig = siteSettings[currentDomain] || {};
      const hasPositionOverride = siteConfig.position !== undefined;

      if (!siteSettings[currentDomain]) {
        siteSettings[currentDomain] = {};
      }

      if (hasPositionOverride) {
        // Disable override: delete site-specific position
        delete siteSettings[currentDomain].position;
        
        // Clean up empty site settings object
        if (Object.keys(siteSettings[currentDomain]).length === 0) {
          delete siteSettings[currentDomain];
        }
      } else {
        // Enable override: copy global position
        siteSettings[currentDomain].position = result.position || 'left';
      }

      browser.storage.local.set({ siteSettings }).then(() => {
        loadAllSettings();
      });
    });
  });
  // Restore TOC button action (only resets closed/minimized state, doesn't force enable)
  restoreBtn.addEventListener('click', () => {
    browser.storage.local.get(['siteSettings']).then((result) => {
      const siteSettings = result.siteSettings || {};
      const siteConfig = siteSettings[currentDomain] || {};
      const hasSiteOverride = siteConfig.position !== undefined;

      if (hasSiteOverride) {
        if (!siteSettings[currentDomain]) siteSettings[currentDomain] = {};
        siteSettings[currentDomain].closed = false;
        siteSettings[currentDomain].minimized = true;
        siteSettings[currentDomain].pinned = false;
        browser.storage.local.set({ siteSettings }).then(() => {
          loadAllSettings();
          showRestoreSuccess();
        });
      } else {
        browser.storage.local.set({ closed: false, minimized: true, pinned: false }).then(() => {
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
    browser.storage.local.get('siteSettings').then((result) => {
      const siteSettings = result.siteSettings || {};
      if (siteSettings[currentDomain]) {
        delete siteSettings[currentDomain];
        browser.storage.local.set({ siteSettings }).then(() => {
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
    browser.storage.local.set({
      enabled: true,
      position: 'left',
      closed: false,
      minimized: true,
      pinned: false,
      theme: 'auto',
      siteSettings: {}
    }).then(() => {
      loadAllSettings();
      const originalText = resetAllBtn.textContent;
      resetAllBtn.textContent = 'Reset All!';
      setTimeout(() => {
        resetAllBtn.textContent = originalText;
      }, 1500);
    });
  });
});