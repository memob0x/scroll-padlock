import { Page } from 'puppeteer';

/**
 * Clicks the toggle scroll lock button on the page.
 * @param page - The Puppeteer Page instance to operate on.
 * @returns A promise that resolves when the button has been clicked.
 */
export function clickOnToggleScrollLockButton(page: Page) {
  return page.evaluate(() => document.querySelector<HTMLElement>('[data-button-name="toggle-scroll-lock"]')?.click());
}
