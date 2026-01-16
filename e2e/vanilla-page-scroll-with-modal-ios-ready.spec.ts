import {
  describe, it, beforeEach, afterEach,
} from 'node:test';
import assert from 'node:assert';
import {
  dirname,
  basename,
} from 'node:path';
import { fileURLToPath } from 'node:url';
import { Browser, launch, Page } from 'puppeteer';
import sharp from 'sharp';
import { compareTwoImages } from './utils/compare-two-images.ts';
import {
  BROWSER_LAUNCH_OPTIONS,
  SELECTOR_BUTTON_SCROLL_TO_BOTTOM,
  SELECTOR_BUTTON_TOGGLE_SCROLL_LOCK,
} from './constants.ts';

const currentFile = fileURLToPath(import.meta.url);

const currentPath = dirname(currentFile);

const testBaseName = basename(currentFile, '.spec.ts');

describe(testBaseName, () => {
  let browser: Browser;

  let page: Page;

  beforeEach(async () => {
    browser = await launch(BROWSER_LAUNCH_OPTIONS);

    page = await browser.newPage();

    await page.goto(`file://${currentPath}/${testBaseName}.html`);
  });

  afterEach(() => browser.close());

  it('should be able to lock and unlock element scrolling while showing a modal window, without causing layout shifts', async () => {
    const buttonScrollToBottomEl = await page.$(SELECTOR_BUTTON_SCROLL_TO_BOTTOM);

    await buttonScrollToBottomEl?.click();

    const screenshotA = await sharp(await page.screenshot())
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    const buttonToggleScrollLockEl = await page.$(SELECTOR_BUTTON_TOGGLE_SCROLL_LOCK);

    await buttonToggleScrollLockEl?.click();

    // NOTE: waiting for CSS transition
    await new Promise((resolve) => { setTimeout(resolve, 1000); });

    const screenshotB = await sharp(await page.screenshot())
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    const modalButtonToggleScrollLockEl = await page.$(`#modal ${SELECTOR_BUTTON_TOGGLE_SCROLL_LOCK}`);

    await modalButtonToggleScrollLockEl?.click();

    // NOTE: waiting for CSS transition
    await new Promise((resolve) => { setTimeout(resolve, 1000); });

    const screenshotC = await sharp(await page.screenshot())
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    // writeFileSync('a.jpeg', await sharp(screenshotA.data, { raw: screenshotA.info }).jpeg().toBuffer());

    assert.notEqual(compareTwoImages(screenshotA, screenshotB), 0);

    assert.equal(compareTwoImages(screenshotA, screenshotC), 0);

    assert.notEqual(compareTwoImages(screenshotB, screenshotC), 0);
  });
});
