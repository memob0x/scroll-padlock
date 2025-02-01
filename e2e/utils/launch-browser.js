import puppeteer from 'puppeteer';

export default (viewport) => puppeteer.launch({
  headless: 'new',

  executablePath: puppeteer.executablePath(),

  defaultViewport: viewport,

  args: [
    '--no-sandbox',
    '--disable-web-security',
  ],

  ignoreDefaultArgs: [
    '--hide-scrollbars',
  ],
});
