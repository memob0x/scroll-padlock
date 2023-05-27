import {
  describe, it, beforeEach, afterEach,
} from 'node:test';
import { expect } from 'chai';
import { resolve } from 'path';

import launchBrowser from '../utils/launch-browser.js';
import browseHtmlPlaygroundFile from '../utils/browse-file.js';
import takeBrowserScreenshot from '../utils/take-browser-screenshot.js';
import compareTwoImages from '../utils/compare-two-images.js';

describe('body-scroll-standard', () => {
  let browser;

  beforeEach(async () => {
    browser = await launchBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  it('should be able to ensure scroll position standard approach', async () => {
    const page = await browseHtmlPlaygroundFile(browser, resolve('./test/e2e/body-scroll-standard.html'));

    // puppeteer triggers resize event when taking screenshot
    // so event resize listener needs to be paused...
    await page.evaluate(() => window.instance.unlisten('resize'));

    await page.evaluate(() => window.scrollTo(0, 9999));

    const firstImage = await takeBrowserScreenshot(page, 'body-scroll-standard-0');

    await page.evaluate(() => window.lock());

    const secondImage = await takeBrowserScreenshot(page, 'body-scroll-standard-1');

    let {
      isSameDimensions,

      rawMisMatchPercentage,
    } = await compareTwoImages(firstImage, secondImage);

    expect(isSameDimensions).to.be.true;
    // can't expect to be 0 since new puppeteer renders scrollbars in screenshots
    // mismatch percentage should be ~11%
    expect(Math.floor(rawMisMatchPercentage)).to.be.greaterThanOrEqual(0).and.lessThanOrEqual(12);

    await page.evaluate(() => {
      window.instance.scroll = { top: 0, left: 0 };
    });

    const thirdImage = await takeBrowserScreenshot(page, 'body-scroll-standard-2');

    ({ isSameDimensions, rawMisMatchPercentage } = await compareTwoImages(firstImage, thirdImage));

    expect(isSameDimensions).to.be.true;
    // can't expect to be 0 since new puppeteer renders scrollbars in screenshots
    // mismatch percentage should be ~11%
    expect(Math.floor(rawMisMatchPercentage)).to.be.greaterThanOrEqual(0).and.lessThanOrEqual(12);

    await page.evaluate(() => window.unlock());

    const fourthImage = await takeBrowserScreenshot(page, 'body-scroll-standard-3');

    ({
      isSameDimensions,

      rawMisMatchPercentage,
    } = await compareTwoImages(secondImage, fourthImage));

    expect(isSameDimensions).to.be.true;
    expect(rawMisMatchPercentage).to.be.greaterThan(12);

    await page.close();
  });
});
