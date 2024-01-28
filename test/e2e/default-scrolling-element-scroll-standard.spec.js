import {
  describe, it, beforeEach, afterEach,
} from 'node:test';
import assert from 'node:assert';
import { resolve } from 'node:path';
import launchBrowser from '../utils/launch-browser.js';
import browseHtmlPlaygroundFile from '../utils/browse-file.js';
import takeBrowserScreenshot from '../utils/take-browser-screenshot.js';
import compareTwoImages from '../utils/compare-two-images.js';

describe('default-scrolling-element-scroll-standard', () => {
  let browser;

  beforeEach(async () => {
    browser = await launchBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  it('should be able to ensure scroll position standard approach', async () => {
    const page = await browseHtmlPlaygroundFile(browser, resolve('./test/e2e/default-scrolling-element-scroll-standard.html'));

    // puppeteer triggers resize event when taking screenshot
    // so event resize listener needs to be paused...
    await page.evaluate(() => window.instance.unlisten('resize'));

    await page.evaluate(() => window.scrollTo(0, 9999));

    const firstImage = await takeBrowserScreenshot(page, 'default-scrolling-element-scroll-standard-0');

    await page.evaluate(() => window.lock());

    const secondImage = await takeBrowserScreenshot(page, 'default-scrolling-element-scroll-standard-1');

    let {
      isSameDimensions,

      rawMisMatchPercentage,
    } = await compareTwoImages(firstImage, secondImage);

    assert.equal(isSameDimensions, true);

    let rawMisMatchPercentageFloor = Math.floor(rawMisMatchPercentage);

    // can't expect to be 0 since new puppeteer renders scrollbars in screenshots
    // mismatch percentage should be ~11%
    assert.equal(rawMisMatchPercentageFloor >= 0, true);
    assert.equal(rawMisMatchPercentageFloor <= 12, true);

    await page.evaluate(() => {
      window.instance.scroll = { top: 0, left: 0 };
    });

    const thirdImage = await takeBrowserScreenshot(page, 'default-scrolling-element-scroll-standard-2');

    ({ isSameDimensions, rawMisMatchPercentage } = await compareTwoImages(firstImage, thirdImage));

    assert.equal(isSameDimensions, true);

    rawMisMatchPercentageFloor = Math.floor(rawMisMatchPercentage);

    // can't expect to be 0 since new puppeteer renders scrollbars in screenshots
    // mismatch percentage should be ~11%
    assert.equal(rawMisMatchPercentageFloor >= 0, true);
    assert.equal(rawMisMatchPercentageFloor <= 12, true);

    await page.evaluate(() => window.unlock());

    const fourthImage = await takeBrowserScreenshot(page, 'default-scrolling-element-scroll-standard-3');

    ({
      isSameDimensions,

      rawMisMatchPercentage,
    } = await compareTwoImages(secondImage, fourthImage));

    assert.equal(isSameDimensions, true);
    assert.equal(rawMisMatchPercentage > 12, true);

    await page.close();
  });
});
