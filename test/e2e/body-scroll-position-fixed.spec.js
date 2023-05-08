import { expect } from 'chai';
import { resolve } from 'path';

import launchBrowser from '../utils/launch-browser';
import browseHtmlPlaygroundFile from '../utils/browse-file';
import takeBrowserScreenshot from '../utils/take-browser-screenshot';
import compareTwoImages from '../utils/compare-two-images';

describe('body-scroll-position-fixed', () => {
  let browser;

  beforeEach(async () => {
    browser = await launchBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  it('should be able to ensure scroll position fixed approach', async () => {
    const page = await browseHtmlPlaygroundFile(browser, resolve('./test/e2e/body-scroll-position-fixed.html'));

    // puppeteer triggers resize event when taking screenshot
    // so event resize listener needs to be paused...
    await page.evaluate(() => window.instance.unlisten('resize'));

    await page.evaluate(() => window.scrollTo(0, 9999));

    const firstImage = await takeBrowserScreenshot(page, 'body-scroll-position-fixed-0');

    await page.evaluate(() => window.lock());

    // NOTE: usually this would actually scroll the page (even with overflow: hidden; set)
    // but with position: fixed; approach there should be nothing to scroll
    await page.evaluate(() => window.scrollTo(0, 0));

    const secondImage = await takeBrowserScreenshot(page, 'body-scroll-position-fixed-1');

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

    const thirdImage = await takeBrowserScreenshot(page, 'body-scroll-position-fixed-2');

    ({ isSameDimensions, rawMisMatchPercentage } = await compareTwoImages(firstImage, thirdImage));

    expect(isSameDimensions).to.be.true;
    // can't expect to be 0 since new puppeteer renders scrollbars in screenshots
    // mismatch percentage should be ~11%
    expect(Math.floor(rawMisMatchPercentage)).to.be.greaterThanOrEqual(0).and.lessThanOrEqual(12);

    await page.evaluate(() => window.unlock());

    const fourthImage = await takeBrowserScreenshot(page, 'body-scroll-position-fixed-3');

    ({
      isSameDimensions,
      rawMisMatchPercentage,
    } = await compareTwoImages(secondImage, fourthImage));

    expect(isSameDimensions).to.be.true;
    expect(rawMisMatchPercentage).to.be.greaterThan(12);

    await page.close();
  });
});
