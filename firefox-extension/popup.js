document.addEventListener('DOMContentLoaded', () => {
  const enableToggle = document.getElementById('enable-toggle');
  const positionSelect = document.getElementById('position-select');
  const restoreBtn = document.getElementById('restore-btn');
  const requestSupportBtn = document.getElementById('request-support-btn');
  const restoreContainer = document.getElementById('restore-container');
  const supportContainer = document.getElementById('support-container');
  const experimentalBadge = document.getElementById('experimental-badge');

  // Supported site patterns
  const supportedSites = ['.atlassian.net', 'dev.to', 'medium.com'];

  // Check current tab to see if it's supported
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs && tabs[0] && tabs[0].url) {
      try {
        const url = new URL(tabs[0].url);
        const hostname = url.hostname;

        // Exclude browser internal pages like chrome:// or about:
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
           restoreContainer.style.display = 'none';
           supportContainer.style.display = 'flex';
           experimentalBadge.style.display = 'none';
           return;
        }

        const isSupported = supportedSites.some(site => hostname.endsWith(site));

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
      } catch (e) {
        // If there's an error parsing the URL
        restoreContainer.style.display = 'none';
        supportContainer.style.display = 'flex';
        experimentalBadge.style.display = 'none';
      }
    } else {
      // Cannot determine tab URL, default to showing restore
      restoreContainer.style.display = 'flex';
      experimentalBadge.style.display = 'none';
    }
  });

  // Request support action
  requestSupportBtn.addEventListener('click', () => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      let hostnameParam = '';
      if (tabs && tabs[0] && tabs[0].url) {
        try {
          const url = new URL(tabs[0].url);
          // Only pass hostname to protect privacy
          if (url.protocol === 'http:' || url.protocol === 'https:') {
            hostnameParam = url.hostname;
          }
        } catch(e) {}
      }

      const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLScjq5hXfuV2H97XSu918Hl26rVgGxfAJa3Vlc2T97miEMLldw/viewform?usp=pp_url&entry.745477224=${encodeURIComponent(hostnameParam)}`;
      browser.tabs.create({ url: formUrl });
    });
  });

  // Default settings
  const defaultSettings = {
    enabled: true,
    position: 'left',
    closed: false,
    minimized: false
  };

  // Load current settings
  browser.storage.local.get(defaultSettings).then((result) => {
    enableToggle.checked = result.enabled;
    positionSelect.value = result.position;
  });

  // Save settings when changed
  enableToggle.addEventListener('change', () => {
    browser.storage.local.set({ enabled: enableToggle.checked });
  });

  positionSelect.addEventListener('change', () => {
    browser.storage.local.set({ position: positionSelect.value });
  });

  // Restore TOC
  restoreBtn.addEventListener('click', () => {
    browser.storage.local.set({ closed: false, minimized: false, enabled: true }).then(() => {
      // Also update local UI state if toggled off
      enableToggle.checked = true;

      // Give feedback
      const originalText = restoreBtn.textContent;
      restoreBtn.textContent = 'Restored!';
      setTimeout(() => {
        restoreBtn.textContent = originalText;
      }, 1500);
    });
  });
});