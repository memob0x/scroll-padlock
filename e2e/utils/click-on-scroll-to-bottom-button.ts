import { Page } from 'puppeteer';

/**
 * Clicks the "scroll to bottom" button on the given Puppeteer page.
 * @param page - The Puppeteer Page instance where the button will be clicked.
 * @returns A promise that resolves to the result of the click action.
 */
export async function clickOnScrollToBottomButton(page: Page) {
  const $page = await page.$('[data-button-name="scroll-to-bottom"]');

  return $page?.click();
}
