document.addEventListener('DOMContentLoaded', () => {
  const enableToggle = document.getElementById('enable-toggle');
  const positionSelect = document.getElementById('position-select');
  const restoreBtn = document.getElementById('restore-btn');

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