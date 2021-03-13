import { default as nodePath } from 'path';

export default async (browser, evaluate) => {
    const page = await browser.newPage();

    const path = nodePath.resolve('./dist/iife/scroll-padlock.js');

    await page.addScriptTag({ path });

    await page.evaluate(evaluate);

    return page;
};
