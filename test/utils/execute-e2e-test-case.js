import assert from 'node:assert';
import { resolve, basename, extname } from 'node:path';
import browseHtmlPlaygroundFile from './browse-file.js';
import takeBrowserScreenshot from './take-browser-screenshot.js';
import compareTwoImages from './compare-two-images.js';
import cropImage from './crop-image.js';

const takeCroppedBrowserScreenshot = async (
  page,

  filename,

  screenshotCropSettings,
) => {
  // puppeteer triggers resize event when taking screenshot
  // so event resize listener needs to be paused...
  await page.evaluate(() => window.instance.unlisten('resize'));

  let image = await takeBrowserScreenshot(page, filename);

  ({ output: image } = await cropImage(image, screenshotCropSettings));

  await page.evaluate(() => window.instance.listen('resize'));

  return image;
};

/**
 * Executes the e2e default test case with the given html file path.
 * @param {Promise<Browser>} browser - The browser instance.
 * @param {string} testCaseHtmlFilePath - The test case html file path to be used in the test case.
 * @param {Region} screenshotCropSettings - The settings to be used to crop the screenshot. NOTE:
 * image is cropped in order to cut out the scrollbar which may cause images comparison failures.
 */
export default async function executeE2eTestCase(
  browser,

  testCaseHtmlFilePath,

  screenshotCropSettings,
) {
  const page = await browseHtmlPlaygroundFile(browser, resolve(testCaseHtmlFilePath));

  await page.evaluate(() => window.elScrollTo.scrollTo(0, 9999));

  const filenameWithoutExt = basename(testCaseHtmlFilePath, extname(testCaseHtmlFilePath));

  const firstImage = await takeCroppedBrowserScreenshot(page, `${filenameWithoutExt}-0`, screenshotCropSettings);

  await page.evaluate(() => window.lock());

  const secondImage = await takeCroppedBrowserScreenshot(page, `${filenameWithoutExt}-1`, screenshotCropSettings);

  let {
    isSameDimensions,

    rawMisMatchPercentage,
  } = await compareTwoImages(firstImage, secondImage);

  assert.equal(isSameDimensions, true);
  assert.equal(Math.floor(rawMisMatchPercentage), 0);

  await page.evaluate(() => {
    window.instance.scroll = { top: 0, left: 0 };
  });

  const thirdImage = await takeCroppedBrowserScreenshot(page, `${filenameWithoutExt}-2`, screenshotCropSettings);

  ({
    isSameDimensions,

    rawMisMatchPercentage,
  } = await compareTwoImages(firstImage, thirdImage));

  assert.equal(isSameDimensions, true);
  assert.equal(Math.floor(rawMisMatchPercentage), 0);

  await page.evaluate(() => window.unlock());

  const fourthImage = await takeCroppedBrowserScreenshot(page, `${filenameWithoutExt}-3`, screenshotCropSettings);

  ({
    isSameDimensions,

    rawMisMatchPercentage,
  } = await compareTwoImages(secondImage, fourthImage));

  assert.equal(isSameDimensions, true);
  assert.notEqual(Math.floor(rawMisMatchPercentage), 0);

  await page.close();
}
