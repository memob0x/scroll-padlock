import { expect } from 'chai';

import sleep from '../utils/sleep.mjs';
import puppeteerLaunch from '../utils/puppeteer-launch.mjs';
import puppeteerNewPage from '../utils/puppeteer-new-page.mjs';
import puppeteerTakeScreenshot from '../utils/puppeteer-take-screenshot.mjs';
import prepareBodyScrollerTestBed from '../utils/prepare-body-scroller-test-bed.mjs';

import { TIME_MS_DEBOUNCE_SCROLL } from '../../src/constants.mjs';
import compareTwoImages from '../utils/compare-two-images.mjs';

let browser;
let page;

before(async () => (browser = await puppeteerLaunch()));

after(async () => await browser.close());

describe('ScrollPadlock instance on page scroll', () => {
    beforeEach(async () => (page = await puppeteerNewPage(browser, prepareBodyScrollerTestBed)));

    afterEach(async () => await page.close());

    it('', async () => {
        const firstImage = await puppeteerTakeScreenshot(page, '0');

        await page.evaluate(async () => {
            window.instance = new window.ScrollPadlock(document.body, window.LOCKED_CLASS_NAME);

            document.body.classList.add(window.LOCKED_CLASS_NAME);
        });

        await sleep(TIME_MS_DEBOUNCE_SCROLL);

        const secondImage = await puppeteerTakeScreenshot(page, '1');

        const { rawMisMatchPercentage, isSameDimensions } = await compareTwoImages(firstImage, secondImage);
        
        expect(isSameDimensions).to.be.true;
        expect(rawMisMatchPercentage).to.equals(0);
    });
});
