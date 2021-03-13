export default async (browser, path) => {
    const page = await browser.newPage();

    await page.goto(`file://${path}`, { waitUntil: 'domcontentloaded' });

    return page;
};
