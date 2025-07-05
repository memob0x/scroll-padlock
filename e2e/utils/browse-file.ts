import { Browser } from 'puppeteer';

/**
 * Opens a new browser page and navigates to the specified local file path.
 * @param browser - The Puppeteer Browser instance to use for opening the page.
 * @param path - The absolute file path to open in the browser.
 * @returns The Puppeteer Page object for the opened file.
 */
export async function browseFile(browser: Browser, path: string) {
  const page = await browser.newPage();

  await page.goto(`file://${path}`);

  // eslint-disable-next-line no-console
  page.on('console', (msg) => console.log(msg.text()));

  return page;
}
