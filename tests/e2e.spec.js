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

    await popupPage.waitForSelector('.setting-row');

    const enableToggle = popupPage.locator('#enable-toggle');
    await enableToggle.waitFor({ state: 'attached' });
    await popupPage.waitForTimeout(1000);

    await popupPage.evaluate(() => {
        document.getElementById('enable-toggle').checked = false;
        document.getElementById('enable-toggle').dispatchEvent(new Event('change'));
    });

    await page.waitForTimeout(1000);
    await page.bringToFront();
    await page.waitForTimeout(1000);
    await expect(containerLocator).toHaveClass(/hidden/);

    await popupPage.bringToFront();
    const restoreBtn = popupPage.locator('#restore-btn');
    await restoreBtn.evaluate(el => el.click());

    const [sw] = browserContext.serviceWorkers();
    if (sw) {
      await sw.evaluate(() => chrome.storage.local.set({ enabled: true, closed: false }));
    } else {
      await page.evaluate(() => window.postMessage({ type: 'dtoc_e2e_test', action: 'enable' }));
    }

    await page.waitForTimeout(2000);

    await page.bringToFront();
    await expect(containerLocator).not.toHaveClass(/hidden/);

    await popupPage.bringToFront();
    const positionSelect = popupPage.locator('#position-select');
    await positionSelect.selectOption('right');

    await page.bringToFront();
    await expect(containerLocator).toHaveClass(/position-right/);

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

  test('Unsupported website interactions (Wikipedia)', async () => {
    test.setTimeout(120000);
    const page = await browserContext.newPage();
    await page.goto('https://en.wikipedia.org/wiki/Main_Page', { waitUntil: 'domcontentloaded' });

    const hostLocator = page.locator('#dtoc-host');
    await expect(hostLocator).not.toBeAttached();

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

    await page.close();
    await popupPage.close();
  });
});
