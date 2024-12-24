import assert from 'node:assert';
import { resolve, basename, extname } from 'node:path';
import browseHtmlPlaygroundFile from './browse-file.js';
import takeBrowserScreenshot from './take-browser-screenshot.js';
import compareTwoImages from './compare-two-images.js';
import cropImage from './crop-image.js';

/**
 * Executes the e2e default test case with the given html file path.
 * @param {Promise<Browser>} browser - The browser instance.
 * @param {string} testCaseHtmlFilePath - The test case html file path to be used in the test case.
 * @param {Region} screenshotCropSettings - The settings to be used to crop the screenshot.
 */
export default async function executeE2eTestCase(
  browser,

  testCaseHtmlFilePath,

  screenshotCropSettings,
) {
  const page = await browseHtmlPlaygroundFile(browser, resolve(testCaseHtmlFilePath));

  // puppeteer triggers resize event when taking screenshot
  // so event resize listener needs to be paused...
  await page.evaluate(() => window.instance.unlisten('resize'));

  await page.evaluate(() => window.elScrollTo.scrollTo(0, 9999));

  const filenameWithoutExt = basename(testCaseHtmlFilePath, extname(testCaseHtmlFilePath));

  let firstImage = await takeBrowserScreenshot(page, `${filenameWithoutExt}-0`);

  // NOTE: image is cropped in order to cut out the scrollbar
  // which may cause images comparison failures
  ({ output: firstImage } = await cropImage(firstImage, screenshotCropSettings));

  await page.evaluate(() => window.lock());

  let secondImage = await takeBrowserScreenshot(page, `${filenameWithoutExt}-1`);

  // NOTE: image is cropped in order to cut out the scrollbar
  // which may cause images comparison failures
  ({ output: secondImage } = await cropImage(secondImage, screenshotCropSettings));

  let {
    isSameDimensions,

    rawMisMatchPercentage,
  } = await compareTwoImages(firstImage, secondImage);

  assert.equal(isSameDimensions, true);
  assert.equal(Math.floor(rawMisMatchPercentage), 0);

  await page.evaluate(() => {
    window.instance.scroll = { top: 0, left: 0 };
  });

  let thirdImage = await takeBrowserScreenshot(page, `${filenameWithoutExt}-2`);

  // NOTE: image is cropped in order to cut out the scrollbar
  // which may cause images comparison failures
  ({ output: thirdImage } = await cropImage(thirdImage, screenshotCropSettings));

  ({
    isSameDimensions,

    rawMisMatchPercentage,
  } = await compareTwoImages(firstImage, thirdImage));

  assert.equal(isSameDimensions, true);
  assert.equal(Math.floor(rawMisMatchPercentage), 0);

  await page.evaluate(() => window.unlock());

  let fourthImage = await takeBrowserScreenshot(page, `${filenameWithoutExt}-3`);

  // NOTE: image is cropped in order to cut out the scrollbar
  // which may cause images comparison failures
  ({ output: fourthImage } = await cropImage(fourthImage, screenshotCropSettings));

  ({
    isSameDimensions,

    rawMisMatchPercentage,
  } = await compareTwoImages(secondImage, fourthImage));

  assert.equal(isSameDimensions, true);
  assert.notEqual(Math.floor(rawMisMatchPercentage), 0);

  await page.close();
}
