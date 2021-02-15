import puppeteer from 'puppeteer';

export default async () => await puppeteer.launch({
    headless: true,
    executablePath: puppeteer.executablePath(),
    defaultViewport: {
        width: 1280,
        height: 768
    },
    args: ['--disable-web-security'],
    ignoreDefaultArgs: ['--hide-scrollbars']
});
