import 'jsdom-global/register.js';

import { expect } from 'chai';
import path from 'path';

import launchBrowser from '../utils/launch-browser.js';
import browseHtmlPlaygroundFile from '../utils/browse-file.js';
import takeBrowserScreenshot from '../utils/take-browser-screenshot.js';
import compareTwoImages from '../utils/compare-two-images.js';

let browser;

before(async () => (browser = await launchBrowser()));

after(async () => await browser.close());

(playgroundFilename => describe(playgroundFilename, () => {
    it('should be able to ensure scroll position fixed approach', async () => {
        const page = await browseHtmlPlaygroundFile(browser, path.resolve(`./test/e2e/${playgroundFilename}.html`));

        await page.evaluate(() => window.scrollTo(0, 9999));

        const firstImage = await takeBrowserScreenshot(page, `${playgroundFilename}-0`);

        await page.evaluate(() => window.lock());

        console.warn('lock');

        await page.evaluate(() => window.scrollTo(0, 0));

        await page.evaluate(() => window.instance.scroll = { top: 0, left: 0 }); // TODO: fix this

        const secondImage = await takeBrowserScreenshot(page, `${playgroundFilename}-1`);

        let { isSameDimensions, rawMisMatchPercentage } = await compareTwoImages(firstImage, secondImage);
        
        expect(isSameDimensions).to.be.true;
        expect(rawMisMatchPercentage).to.equals(0);
        
        /*

        await page.evaluate(() => window.unlock());

        const thirdImage = await takeBrowserScreenshot(page, `${playgroundFilename}-2`);

        ({ isSameDimensions, rawMisMatchPercentage } = await compareTwoImages(secondImage, thirdImage));
        
        expect(isSameDimensions).to.be.true;
        expect(rawMisMatchPercentage).to.be.greaterThan(0);
        
        */
        
        await page.close();
    });
}))('body-scroll-position-fixed');
