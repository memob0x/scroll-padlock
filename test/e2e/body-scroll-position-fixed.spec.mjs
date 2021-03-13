import { expect } from 'chai';
import path from 'path';

import launchBrowser from '../utils/launch-browser.mjs';
import browseHtmlPlaygroundFile from '../utils/browse-file.mjs';
import takeBrowserScreenshot from '../utils/take-browser-screenshot.mjs';
import compareTwoImages from '../utils/compare-two-images.mjs';

let browser;

before(async () => (browser = await launchBrowser()));

after(async () => await browser.close());

(playgroundFilename => describe(playgroundFilename, () => {
    it('should be able to ensure scroll position fixed approach', async () => {
        const page = await browseHtmlPlaygroundFile(browser, path.resolve(`./test/e2e/${playgroundFilename}.html`));

        const firstImage = await takeBrowserScreenshot(page, `${playgroundFilename}-0`);

        await page.evaluate(() => window.lock());

        await page.evaluate(() => window.scrollTo(0, 0));

        await page.evaluate(() => window.instance.scroll = { top: 0, left: 0 });

        const secondImage = await takeBrowserScreenshot(page, `${playgroundFilename}-1`);

        const firstAndSecondImageComparation = await compareTwoImages(firstImage, secondImage);
        
        expect(firstAndSecondImageComparation.isSameDimensions).to.be.true;
        expect(firstAndSecondImageComparation.rawMisMatchPercentage).to.equals(0);

        await page.evaluate(() => window.unlock());

        const thirdImage = await takeBrowserScreenshot(page, `${playgroundFilename}-2`);

        const secondAndThirdImageComparation = await compareTwoImages(secondImage, thirdImage);
        
        expect(secondAndThirdImageComparation.isSameDimensions).to.be.true;
        expect(secondAndThirdImageComparation.rawMisMatchPercentage).to.be.greaterThan(0);
        
        await page.close();
    });
}))('body-scroll-position-fixed');
