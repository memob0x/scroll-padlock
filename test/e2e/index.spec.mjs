import puppeteerLaunch from '../utils/puppeteer-launch.mjs';
import puppeteerNewPage from '../utils/puppeteer-new-page.mjs';
import prepareTestBed from '../utils/prepare-test-bed.mjs';
import puppeteerTakeScreenshot from '../utils/puppeteer-take-screenshot.mjs';
import sleep from '../utils/sleep.mjs';

import { TIME_MS_DEBOUNCE_SCROLL } from '../../src/constants.mjs';

let browser;
let page;

before(async () => (browser = await puppeteerLaunch()));

after(async () => await browser.close());

beforeEach(async () => (page = await puppeteerNewPage(browser, prepareTestBed)));

afterEach(async () => await page.close());

describe('ScrollPadlock instance on page scroll', () => {
    it('', async () => {
        await puppeteerTakeScreenshot(page, '0');

        await page.evaluate(async () => {
            window.instance = new window.ScrollPadlock(document.body, window.LOCKED_CLASS_NAME);

            document.body.classList.add(window.LOCKED_CLASS_NAME);
        });

        await sleep(TIME_MS_DEBOUNCE_SCROLL);

        await puppeteerTakeScreenshot(page, '1');
    });
});
