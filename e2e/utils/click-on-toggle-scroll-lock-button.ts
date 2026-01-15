import { Page } from 'puppeteer';

/**
 * Clicks the toggle scroll lock button on the page.
 * @param page - The Puppeteer Page instance to operate on.
 * @returns A promise that resolves when the button has been clicked.
 */
export async function clickOnToggleScrollLockButton(page: Page) {
  const $page = await page.$('[data-button-name="toggle-scroll-lock"]');

  return $page?.click();
}
