document.addEventListener('DOMContentLoaded', () => {
  const enableToggle = document.getElementById('enable-toggle');
  const positionSelect = document.getElementById('position-select');
  const restoreBtn = document.getElementById('restore-btn');
  const requestSupportBtn = document.getElementById('request-support-btn');

  // Check current tab to see if we should show the support button
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs && tabs.length > 0) {
      const currentTab = tabs[0];
      if (currentTab.url) {
        try {
          const urlObj = new URL(currentTab.url);
          const hostname = urlObj.hostname;

          // Check if it's NOT a supported site (*.atlassian.net)
          if (!hostname.endsWith('.atlassian.net') && hostname !== 'atlassian.net') {
            requestSupportBtn.style.display = 'flex';
            requestSupportBtn.addEventListener('click', () => {
              const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLScjq5hXfuV2H97XSu918Hl26rVgGxfAJa3Vlc2T97miEMLldw/viewform?entry.745477224=${encodeURIComponent(hostname)}`;
              browser.tabs.create({ url: formUrl });
            });
          }
        } catch (e) {
          // Invalid URL (e.g. about: addons page), ignore
        }
      }
    }
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