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
import { Browser, Page } from 'puppeteer';
import { launchBrowser } from './utils/launch-browser.ts';
import { browseFile } from './utils/browse-file.ts';
import { takeBrowserScreenshot } from './utils/take-browser-screenshot.ts';
import { compareTwoImages } from './utils/compare-two-images.ts';
import { VIEWPORT, VIEWPORT_CROP } from './constants.ts';
import { clickOnScrollToBottomButton } from './utils/click-on-scroll-to-bottom-button.ts';
import { clickOnToggleScrollLockButton } from './utils/click-on-toggle-scroll-lock-button.ts';
import { sleep } from './utils/sleep.ts';

const currentFile = fileURLToPath(import.meta.url);

const currentPath = dirname(currentFile);

const testBaseName = basename(currentFile, '.spec.ts');

const distPath = resolve(currentPath, '..', 'dist');

describe(testBaseName, () => {
  let browser: Browser;

  let page: Page;

  beforeEach(async () => {
    browser = await launchBrowser(VIEWPORT);

    page = await browseFile(browser, `${currentPath}/${testBaseName}.html`);
  });

  afterEach(() => browser.close());

  it('should be able to lock and unlock element scrolling while showing a modal window, without causing layout shifts', async () => {
    await clickOnScrollToBottomButton(page);

    let screenshots: string[] = [];

    screenshots.push(await takeBrowserScreenshot(page, `${distPath}/${testBaseName}-${screenshots.length}.jpeg`, { crop: VIEWPORT_CROP }));

    await clickOnToggleScrollLockButton(page);

    await sleep(1000);

    screenshots.push(await takeBrowserScreenshot(page, `${distPath}/${testBaseName}-${screenshots.length}.jpeg`, { crop: VIEWPORT_CROP }));

    let mismatchPercentage = await compareTwoImages(screenshots[0], screenshots[1]);

    assert.notEqual(Math.round(mismatchPercentage), 0);

    await rm(screenshots[0]);

    screenshots.shift();

    await clickOnToggleScrollLockButton(page);

    await sleep(1000);

    screenshots.push(await takeBrowserScreenshot(page, `${distPath}/${testBaseName}-${screenshots.length}.jpeg`, { crop: VIEWPORT_CROP }));

    mismatchPercentage = await compareTwoImages(screenshots[0], screenshots[1]);

    assert.equal(Math.round(mismatchPercentage), 0);

    await Promise.all(screenshots.map((screenshot) => rm(screenshot)));

    screenshots = [];
  });
});
