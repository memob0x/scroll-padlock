import puppeteer, { Viewport } from 'puppeteer';

/**
 * Launches a Puppeteer browser instance with the specified viewport.
 * @param viewport - The viewport settings to use for the browser.
 * @returns A Promise that resolves to the launched Puppeteer browser instance.
 */
export function launchBrowser(viewport: Viewport) {
  return puppeteer.launch({
    headless: true,
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
}
