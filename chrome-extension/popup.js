document.addEventListener('DOMContentLoaded', () => {
  const globalEnableToggle = document.getElementById('global-enable-toggle');
  const globalPositionSelect = document.getElementById('global-position-select');
  const siteEnableToggle = document.getElementById('site-enable-toggle');
  const sitePositionSelect = document.getElementById('site-position-select');
  const restoreBtn = document.getElementById('restore-btn');
  const requestSupportBtn = document.getElementById('request-support-btn');
  const restoreContainer = document.getElementById('restore-container');
  const supportContainer = document.getElementById('support-container');
  const experimentalBadge = document.getElementById('experimental-badge');
  const siteHeaderTitle = document.getElementById('site-header-title');
  const resetSiteBtn = document.getElementById('reset-site-btn');
  const resetAllBtn = document.getElementById('reset-all-btn');

  // Supported site patterns
  const supportedSites = ['.atlassian.net', 'dev.to', 'medium.com'];
  let currentDomain = 'This Site';
  let isSupported = false;

  function getCleanDomain(hostname) {
    if (!hostname) return 'This Site';
    return hostname.replace(/^www\./i, '');
  }

  // Check current tab to see if it's supported and extract hostname
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0] && tabs[0].url) {
      try {
        const url = new URL(tabs[0].url);
        const hostname = url.hostname;
        currentDomain = getCleanDomain(hostname);
        
        // Update the site header in popup
        if (siteHeaderTitle) {
          siteHeaderTitle.textContent = 'SITE';
          siteHeaderTitle.title = currentDomain;
        }

        // Exclude browser internal pages like chrome://
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
           restoreContainer.style.display = 'none';
           supportContainer.style.display = 'flex';
           experimentalBadge.style.display = 'none';
           return;
        }

        isSupported = supportedSites.some(site => hostname.endsWith(site));

        if (isSupported) {
          restoreContainer.style.display = 'flex';
          supportContainer.style.display = 'none';
          experimentalBadge.style.display = 'none';
        } else {
          // Unsupported/Experimental site: show both buttons, show experimental badge
          restoreContainer.style.display = 'flex';
          supportContainer.style.display = 'flex';
          experimentalBadge.style.display = 'block';

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
        experimentalBadge.style.display = 'none';
        loadAllSettings();
      }
    } else {
      // Cannot determine tab URL, default to showing restore
      restoreContainer.style.display = 'flex';
      experimentalBadge.style.display = 'none';
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
      chrome.tabs.create({ url: formUrl });
    });
  });

  function updateControlStates() {
    const globalEnabled = globalEnableToggle.checked;
    siteEnableToggle.disabled = !globalEnabled;
    sitePositionSelect.disabled = !globalEnabled;

    if (globalEnabled) {
      document.getElementById('site-enable-switch').classList.remove('disabled-control');
      sitePositionSelect.classList.remove('disabled-control');
    } else {
      document.getElementById('site-enable-switch').classList.add('disabled-control');
      sitePositionSelect.classList.add('disabled-control');
    }
  }

  function loadAllSettings() {
    const defaultSettings = {
      enabled: true,
      position: 'left',
      siteSettings: {}
    };

    chrome.storage.local.get(defaultSettings, (result) => {
      globalEnableToggle.checked = result.enabled;
      globalPositionSelect.value = result.position;

      const siteSettings = result.siteSettings || {};
      const siteConfig = siteSettings[currentDomain] || {};

      siteEnableToggle.checked = siteConfig.enabled !== undefined ? siteConfig.enabled : true;
      sitePositionSelect.value = siteConfig.position !== undefined ? siteConfig.position : result.position;

      updateControlStates();
    });
  }

  // Save changes when changed
  globalEnableToggle.addEventListener('change', () => {
    chrome.storage.local.set({ enabled: globalEnableToggle.checked }, () => {
      updateControlStates();
    });
  });

  globalPositionSelect.addEventListener('change', () => {
    const newPos = globalPositionSelect.value;
    chrome.storage.local.get('siteSettings', (result) => {
      const siteSettings = result.siteSettings || {};
      const siteConfig = siteSettings[currentDomain] || {};
      
      // If the site position select is currently inheriting the global position, visually update it.
      if (siteConfig.position === undefined) {
        sitePositionSelect.value = newPos;
      }
      chrome.storage.local.set({ position: newPos });
    });
  });

  siteEnableToggle.addEventListener('change', () => {
    chrome.storage.local.get('siteSettings', (result) => {
      const siteSettings = result.siteSettings || {};
      if (!siteSettings[currentDomain]) {
        siteSettings[currentDomain] = {};
      }
      siteSettings[currentDomain].enabled = siteEnableToggle.checked;
      chrome.storage.local.set({ siteSettings });
    });
  });

  sitePositionSelect.addEventListener('change', () => {
    chrome.storage.local.get('siteSettings', (result) => {
      const siteSettings = result.siteSettings || {};
      if (!siteSettings[currentDomain]) {
        siteSettings[currentDomain] = {};
      }
      siteSettings[currentDomain].position = sitePositionSelect.value;
      chrome.storage.local.set({ siteSettings });
    });
  });

  // Restore TOC
  restoreBtn.addEventListener('click', () => {
    chrome.storage.local.get('siteSettings', (result) => {
      const siteSettings = result.siteSettings || {};
      if (siteSettings[currentDomain]) {
        siteSettings[currentDomain].enabled = true;
      }
      chrome.storage.local.set({ closed: false, minimized: false, enabled: true, siteSettings }, () => {
        // Also update local UI state
        globalEnableToggle.checked = true;
        siteEnableToggle.checked = true;
        updateControlStates();

        const originalText = restoreBtn.textContent;
        restoreBtn.textContent = 'Restored!';
        setTimeout(() => {
          restoreBtn.textContent = originalText;
        }, 1500);
      });
    });
  });

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
      minimized: false,
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