import path from 'path';

export default async (browser, evaluate) => {
    const page = await browser.newPage();

    await page.setViewport({
        width: 1000,
        height: 1000
    });

    await page.addScriptTag({
        path: path.resolve('./dist/iife/scroll-padlock.js')
    });

    await page.evaluate(evaluate);

    return page;
};
