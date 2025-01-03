import {
  describe, it, beforeEach, afterEach,
} from 'node:test';
import assert from 'node:assert';
import {
  resolve, dirname,
  basename,
} from 'node:path';
import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import launchBrowser from './utils/launch-browser.js';
import browseHtmlPlaygroundFile from './utils/browse-file.js';
import takeBrowserScreenshot from './utils/take-browser-screenshot.js';
import compareTwoImages from './utils/compare-two-images.js';
import { VIEWPORT, VIEWPORT_CROP } from './constants.js';
import clickOnScrollToBottomButton from './utils/click-on-scroll-to-bottom-button.js';
import clickOnToggleLockScrollButton from './utils/click-on-toggle-scroll-lock-button.js';
import sleep from './utils/sleep.js';

const currentFile = fileURLToPath(import.meta.url);

const currentPath = dirname(currentFile);

const testBaseName = basename(currentFile, '.spec.js');

const distPath = resolve(currentPath, '..', 'dist');

describe(testBaseName, () => {
  let browser;

  let page;

  beforeEach(async () => {
    browser = await launchBrowser(VIEWPORT);

    page = await browseHtmlPlaygroundFile(browser, `${currentPath}/${testBaseName}.html`);
  });

  afterEach(async () => {
    await browser.close();
  });

  it('should be able to lock and unlock element scrolling while showing a modal window, without causing layout shifts', async () => {
    await clickOnScrollToBottomButton(page);

    let screenshots = [];

    screenshots.push(await takeBrowserScreenshot(page, `${distPath}/${testBaseName}-${screenshots.length}.jpg`, { crop: VIEWPORT_CROP }));

    await clickOnToggleLockScrollButton(page);

    await sleep(1000);

    screenshots.push(await takeBrowserScreenshot(page, `${distPath}/${testBaseName}-${screenshots.length}.jpg`, { crop: VIEWPORT_CROP }));

    let comparison = await compareTwoImages(...screenshots);

    assert.notEqual(Math.round(comparison.rawMisMatchPercentage), 0);

    await rm(screenshots[0]);

    screenshots.shift();

    await clickOnToggleLockScrollButton(page);

    await sleep(1000);

    screenshots.push(await takeBrowserScreenshot(page, `${distPath}/${testBaseName}-${screenshots.length}.jpg`, { crop: VIEWPORT_CROP }));

    comparison = await compareTwoImages(...screenshots);

    assert.equal(Math.round(comparison.rawMisMatchPercentage), 0);

    await Promise.all(screenshots.map((screenshot) => rm(screenshot)));

    screenshots = [];
  });
});
