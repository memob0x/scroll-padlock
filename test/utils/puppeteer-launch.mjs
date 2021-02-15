import puppeteer from 'puppeteer';

export default async () => await puppeteer.launch({
    headless: true,
    executablePath: puppeteer.executablePath(),
    args: ['--disable-web-security'],
    ignoreDefaultArgs: ['--hide-scrollbars']
});
