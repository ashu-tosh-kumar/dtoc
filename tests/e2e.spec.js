const { test, expect, chromium } = require('@playwright/test');
const path = require('path');

test.describe('DTOC Extension E2E Tests', () => {
  let browserContext;
  let extensionId;

  test.beforeAll(async ({ }, testInfo) => {
    const extensionPath = path.resolve(__dirname, '..', testInfo.project.use.extensionPath);

    browserContext = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });

    let [background] = browserContext.serviceWorkers();
    if (!background) {
      let page = await browserContext.newPage();
      await page.goto('chrome://extensions/');

      const devModeToggle = page.locator('extensions-manager').locator('cr-toggle#devMode');
      if (await devModeToggle.isVisible()) {
        await devModeToggle.click();
      }

      const extensionIdElement = page.locator('extensions-manager').locator('extensions-item-list').locator('extensions-item').first().locator('#extension-id');
      await extensionIdElement.waitFor();
      const text = await extensionIdElement.textContent();
      extensionId = text.replace('ID: ', '').trim();
      await page.close();
    } else {
      const extensionIdMatch = background.url().match(/chrome-extension:\/\/(.*)\//);
      if (extensionIdMatch) {
        extensionId = extensionIdMatch[1];
      }
    }
  });

  test.afterAll(async () => {
    await browserContext.close();
  });

  test('Supported website interactions (Confluence)', async () => {
    test.setTimeout(120000);
    const page = await browserContext.newPage();

    await page.route('https://mocked.atlassian.net/wiki/spaces/ENG/pages/123/Architecture', async route => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Architecture - Confluence</title>
        </head>
        <body>
          <div id="main-content">
            <h1>Architecture</h1>
            <h2>Introduction</h2>
            <p>Some text</p>
            <h3>Backend</h3>
            <p>Backend details</p>
            <h3>Frontend</h3>
            <p>Frontend details</p>
          </div>
        </body>
        </html>
      `;
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: html,
      });
    });

    await page.goto('https://mocked.atlassian.net/wiki/spaces/ENG/pages/123/Architecture');
    await page.waitForSelector('h1, h2, h3', { timeout: 10000 });
    await page.waitForTimeout(2000);

    const hostLocator = page.locator('#dtoc-host');
    await expect(hostLocator).toBeAttached({ timeout: 10000 });

    const containerLocator = hostLocator.locator('css=div#dtoc-container');
    await expect(containerLocator).toBeVisible();

    const headerTitle = hostLocator.locator('.dtoc-title');
    await expect(headerTitle).toHaveText('Table of Contents');

    const tocList = hostLocator.locator('.toc-list');
    await expect(tocList).toBeVisible();

    const firstLink = tocList.locator('.toc-link:not([href="#"])').first();
    const href = await firstLink.getAttribute('href');

    await firstLink.click();

    await page.waitForFunction((expectedHash) => {
      return window.location.hash === expectedHash;
    }, href);

    expect(page.url()).toContain(href);

    const minimizeBtn = hostLocator.locator('button[title="Minimize"]');
    await minimizeBtn.click();

    await expect(containerLocator).toHaveClass(/minimized/);

    const maximizeIcon = hostLocator.locator('.maximize-icon');
    await expect(maximizeIcon).toBeVisible();

    await containerLocator.click();
    await expect(containerLocator).not.toHaveClass(/minimized/);

    const closeBtn = hostLocator.locator('button[title="Close"]');
    await closeBtn.click();
    await expect(containerLocator).toHaveClass(/hidden/);

    const popupPage = await browserContext.newPage();

    await popupPage.addInitScript(() => {
      window.chrome = window.chrome || {};
      window.chrome.tabs = window.chrome.tabs || {};
      const originalQuery = window.chrome.tabs.query;
      window.chrome.tabs.query = function(queryInfo, callback) {
        if (callback) {
          if (queryInfo.active && queryInfo.currentWindow) {
            callback([{ url: 'https://mocked.atlassian.net/wiki/spaces/ENG/pages/123/Architecture' }]);
            return;
          }
          return originalQuery(queryInfo, callback);
        } else {
          if (queryInfo.active && queryInfo.currentWindow) {
            return Promise.resolve([{ url: 'https://mocked.atlassian.net/wiki/spaces/ENG/pages/123/Architecture' }]);
          }
          return originalQuery(queryInfo);
        }
      };
    });

    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);

    const siteToggleBtn = popupPage.locator('#site-toggle-btn');
    await siteToggleBtn.waitFor({ state: 'attached' });
    await popupPage.waitForTimeout(1000);

    // Restore TOC first to ensure closed state is reset
    const restoreBtn = popupPage.locator('#restore-btn');
    await restoreBtn.click();
    await page.waitForTimeout(1000);
    await page.bringToFront();
    await expect(containerLocator).not.toHaveClass(/hidden/);

    await popupPage.bringToFront();
    // 1. Disable global status -> TOC should hide, controls should be greyed out
    const globalOffBtn = popupPage.locator('#global-off-btn');
    await globalOffBtn.click();
    await page.waitForTimeout(1000);
    await page.bringToFront();
    await expect(containerLocator).toHaveClass(/hidden/);

    // Assert site controls are greyed out
    await popupPage.bringToFront();
    await expect(popupPage.locator('#site-toggle-btn')).toHaveClass(/disabled-control/);
    await expect(popupPage.locator('.settings-panel')).toHaveClass(/disabled-control/);
    await expect(popupPage.locator('#only-for-btn')).toHaveClass(/disabled-control/);
    await expect(popupPage.locator('#reset-site-btn')).toHaveClass(/disabled-control/);
    await expect(popupPage.locator('#reset-all-btn')).toHaveClass(/disabled-control/);

    // 2. Enable global status back -> TOC should show, controls should be enabled
    await popupPage.bringToFront();
    const globalOnBtn = popupPage.locator('#global-on-btn');
    await globalOnBtn.click();
    await page.waitForTimeout(1000);
    await page.bringToFront();
    await expect(containerLocator).not.toHaveClass(/hidden/);

    // Assert site controls are active again
    await popupPage.bringToFront();
    await expect(popupPage.locator('#site-toggle-btn')).not.toHaveClass(/disabled-control/);
    await expect(popupPage.locator('.settings-panel')).not.toHaveClass(/disabled-control/);
    await expect(popupPage.locator('#only-for-btn')).not.toHaveClass(/disabled-control/);
    await expect(popupPage.locator('#reset-site-btn')).not.toHaveClass(/disabled-control/);
    await expect(popupPage.locator('#reset-all-btn')).not.toHaveClass(/disabled-control/);

    // 3. Disable site-specific status via Site Quick-Toggle -> TOC should hide
    await popupPage.bringToFront();
    await siteToggleBtn.click();
    await page.waitForTimeout(1000);
    await page.bringToFront();
    await expect(containerLocator).toHaveClass(/hidden/);

    // Enable site-specific status back -> TOC should show
    await popupPage.bringToFront();
    await siteToggleBtn.click();
    await page.waitForTimeout(1000);
    await page.bringToFront();
    await expect(containerLocator).not.toHaveClass(/hidden/);

    // Reset site settings to clear the override before testing global/OnlyFor settings
    await popupPage.bringToFront();
    await popupPage.locator('#reset-site-btn').click();
    await page.waitForTimeout(1000);

    // 4. Change global position to right -> TOC should be on the right
    await popupPage.bringToFront();
    const positionRightBtn = popupPage.locator('#position-right-btn');
    const positionLeftBtn = popupPage.locator('#position-left-btn');
    await positionRightBtn.click();
    await page.waitForTimeout(1000);
    await page.bringToFront();
    await expect(containerLocator).toHaveClass(/position-right/);

    // Now, enable "Only for" site-specific override
    await popupPage.bringToFront();
    const onlyForBtn = popupPage.locator('#only-for-btn');
    await onlyForBtn.click();
    await expect(onlyForBtn).toHaveClass(/active/);

    // With "Only for" active, change position to left -> site position is left, global remains right
    await positionLeftBtn.click();
    await page.waitForTimeout(1000);
    await page.bringToFront();
    await expect(containerLocator).toHaveClass(/position-left/);

    // 5. Test Reset Site Settings -> site specific setting goes back to global (right) -> TOC should be on right
    await popupPage.bringToFront();
    const resetSiteBtn = popupPage.locator('#reset-site-btn');
    await resetSiteBtn.click();
    await page.waitForTimeout(1000);
    await page.bringToFront();
    await expect(containerLocator).toHaveClass(/position-right/);

    // 6. Test Reset All Settings
    await popupPage.bringToFront();
    const resetAllBtn = popupPage.locator('#reset-all-btn');
    await resetAllBtn.click();
    await page.waitForTimeout(1000);
    
    // Assert all controls reset to default
    await expect(popupPage.locator('#global-on-btn')).toHaveClass(/active/);
    await expect(positionLeftBtn).toHaveClass(/active/);
    await expect(onlyForBtn).not.toHaveClass(/active/);

    await page.bringToFront();
    await expect(containerLocator).toHaveClass(/position-left/);

    const secondLink = tocList.locator('.toc-link:not([href="#"])').nth(1);
    const secondHref = await secondLink.getAttribute('href');
    await secondLink.click();
    await page.waitForFunction((expectedHash) => {
      return window.location.hash === expectedHash;
    }, secondHref);
    expect(page.url()).toContain(secondHref);

    await minimizeBtn.click();
    await expect(containerLocator).toHaveClass(/minimized/);
    await containerLocator.click();
    await expect(containerLocator).not.toHaveClass(/minimized/);

    await closeBtn.click();
    await expect(containerLocator).toHaveClass(/hidden/);

    await page.close();
    await popupPage.close();
  });

  test('Supported website interactions (Medium)', async () => {
    test.setTimeout(120000);
    const page = await browserContext.newPage();

    await page.route('https://medium.com/@author/my-awesome-article', async route => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>My Awesome Article | by Author | Medium</title>
        </head>
        <body>
          <article>
            <h1>My Awesome Article</h1>
            <h2>Section 1</h2>
            <p>Some text</p>
            <h3>Subsection A</h3>
            <p>Details</p>
            <h2>Section 2</h2>
            <p>More text</p>
          </article>
        </body>
        </html>
      `;
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: html,
      });
    });

    await page.goto('https://medium.com/@author/my-awesome-article');
    await page.waitForSelector('h1, h2, h3', { timeout: 10000 });
    await page.waitForTimeout(2000);

    const hostLocator = page.locator('#dtoc-host');
    await expect(hostLocator).toBeAttached({ timeout: 10000 });

    const containerLocator = hostLocator.locator('css=div#dtoc-container');
    await expect(containerLocator).toBeVisible();

    const headerTitle = hostLocator.locator('.dtoc-title');
    await expect(headerTitle).toHaveText('Table of Contents');

    const tocList = hostLocator.locator('.toc-list');
    await expect(tocList).toBeVisible();

    // The first heading is <h1>, but since it is the first heading in <article>,
    // and matching the title, let's see if firstLink has 'Section 1' or 'My Awesome Article'.
    // In content.js: titleInfo.element is the h1. firstHeading is also h1.
    // So hasTitlePrepend is false, meaning 'My Awesome Article' is not prepended.
    // The first item in the list is the h1 'My Awesome Article'.
    const firstLink = tocList.locator('.toc-link').first();
    await expect(firstLink).toHaveText('My Awesome Article');

    const href = await firstLink.getAttribute('href');
    await firstLink.click();

    await page.waitForFunction((expectedHash) => {
      return window.location.hash === expectedHash;
    }, href);

    await page.close();
  });

  test('Supported website interactions (Dev.to)', async () => {
    test.setTimeout(120000);
    const page = await browserContext.newPage();

    await page.route('https://dev.to/author/my-awesome-post', async route => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>My Awesome Post - DEV Community</title>
        </head>
        <body>
          <div id="article-body">
            <h1>My Awesome Post</h1>
            <h2>Section 1</h2>
            <p>Some text</p>
            <h3>Subsection A</h3>
            <p>Details</p>
            <h2>Section 2</h2>
            <p>More text</p>
          </div>
        </body>
        </html>
      `;
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: html,
      });
    });

    await page.goto('https://dev.to/author/my-awesome-post');
    await page.waitForSelector('h1, h2, h3', { timeout: 10000 });
    await page.waitForTimeout(2000);

    const hostLocator = page.locator('#dtoc-host');
    await expect(hostLocator).toBeAttached({ timeout: 10000 });

    const containerLocator = hostLocator.locator('css=div#dtoc-container');
    await expect(containerLocator).toBeVisible();

    const headerTitle = hostLocator.locator('.dtoc-title');
    await expect(headerTitle).toHaveText('Table of Contents');

    const tocList = hostLocator.locator('.toc-list');
    await expect(tocList).toBeVisible();

    const firstLink = tocList.locator('.toc-link').first();
    await expect(firstLink).toHaveText('My Awesome Post');

    const href = await firstLink.getAttribute('href');
    await firstLink.click();

    await page.waitForFunction((expectedHash) => {
      return window.location.hash === expectedHash;
    }, href);

    expect(page.url()).toContain(href);
    await page.close();
  });

  test('Experimental website interactions (Wikipedia)', async () => {
    test.setTimeout(120000);
    const page = await browserContext.newPage();
    await page.goto('https://en.wikipedia.org/wiki/Main_Page', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const hostLocator = page.locator('#dtoc-host');
    await expect(hostLocator).toBeAttached({ timeout: 10000 });

    // By default, unsupported sites should have the TOC hidden
    const containerLocator = hostLocator.locator('css=div#dtoc-container');
    await expect(containerLocator).toHaveClass(/hidden/);

    const popupPage = await browserContext.newPage();

    await popupPage.addInitScript(() => {
      window.chrome = window.chrome || {};
      window.chrome.tabs = window.chrome.tabs || {};
      const originalQuery = window.chrome.tabs.query;
      window.chrome.tabs.query = function(queryInfo, callback) {
        if (callback) {
          if (queryInfo.active && queryInfo.currentWindow) {
            callback([{ url: 'https://en.wikipedia.org/wiki/Main_Page' }]);
            return;
          }
          return originalQuery(queryInfo, callback);
        } else {
          if (queryInfo.active && queryInfo.currentWindow) {
            return Promise.resolve([{ url: 'https://en.wikipedia.org/wiki/Main_Page' }]);
          }
          return originalQuery(queryInfo);
        }
      };
    });

    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);

    const supportContainer = popupPage.locator('#support-container');
    await expect(supportContainer).toBeVisible();

    const requestSupportBtn = popupPage.locator('#request-support-btn');
    await expect(requestSupportBtn).toBeVisible();

    const restoreContainer = popupPage.locator('#restore-container');
    await expect(restoreContainer).toBeVisible();

    const restoreBtn = popupPage.locator('#restore-btn');
    await expect(restoreBtn).toHaveClass(/disabled-control/);

    const betaBadge = popupPage.locator('#beta-badge');
    await expect(betaBadge).toBeVisible();

    // The site toggle should show as inactive/off by default
    const siteToggleBtn = popupPage.locator('#site-toggle-btn');
    await expect(siteToggleBtn).toHaveClass(/inactive/);

    // Turn the feature ON manually
    await siteToggleBtn.click();
    await page.waitForTimeout(1000);

    // Verify it is now visible and has beta headers on the page
    await page.bringToFront();
    await expect(containerLocator).not.toHaveClass(/hidden/);
    await expect(containerLocator).toHaveClass(/experimental/);

    const headerTitle = hostLocator.locator('.dtoc-title');
    await expect(headerTitle).toHaveText('Table of Contents (Beta)');

    // Verify the popup toggle is updated to active/on
    await popupPage.bringToFront();
    await expect(siteToggleBtn).toHaveClass(/active/);

    // Verify the restore button is no longer grayed out
    await expect(restoreBtn).not.toHaveClass(/disabled-control/);

    await page.close();
    await popupPage.close();
  });
});
