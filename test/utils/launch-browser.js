import puppeteer from 'puppeteer';

export default () => puppeteer.launch({
  headless: 'new',

  executablePath: puppeteer.executablePath(),

  defaultViewport: {
    width: 640,

    height: 480,
  },

  args: ['--disable-web-security'],

  ignoreDefaultArgs: ['--hide-scrollbars'],
});
