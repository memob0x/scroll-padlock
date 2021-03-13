import puppeteer from 'puppeteer';

export default async () => await puppeteer.launch({
    headless: false,
    
    executablePath: puppeteer.executablePath(),
    
    defaultViewport: {
        width: 640,

        height: 480
    },
    
    args: ['--disable-web-security'],
    
    ignoreDefaultArgs: ['--hide-scrollbars']
});
