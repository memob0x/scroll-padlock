import { executablePath } from 'puppeteer';

export const BROWSER_LAUNCH_OPTIONS = {
  headless: true,
  executablePath: executablePath(),
  defaultViewport: {
    width: 360,
    height: 720,
  },
  args: [
    '--no-sandbox',
    '--disable-web-security',
  ],
  ignoreDefaultArgs: [
    '--hide-scrollbars',
  ],
};

export const SELECTOR_BUTTON_SCROLL_TO_BOTTOM = '[data-button-name="scroll-to-bottom"]';

export const SELECTOR_BUTTON_TOGGLE_SCROLL_LOCK = '[data-button-name="toggle-scroll-lock"]';
