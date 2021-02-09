import path from 'path';
import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        ignoreDefaultArgs: ['--hide-scrollbars']
    });

    const page = await browser.newPage();

    page.on('console', c => console.log(c.text()));

    await page.setViewport({ width: 1000, height: 1000 });

    await page.addScriptTag({ path: path.resolve('./node_modules/mocha/mocha.js') });
    await page.addScriptTag({ path: path.resolve('./node_modules/chai/chai.js') });

    await page.evaluate(() => mocha.setup('bdd'));

    await page.addScriptTag({ path: path.resolve('./dist/iife/scroll-padlock.js') });
    await page.addScriptTag({ path: path.resolve('./test/e2e/scroll-padlock.spec.js') });

    await page.evaluate(() => mocha.run());

    await page.close();

    await browser.close();
})();
