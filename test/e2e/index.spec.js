import {
  describe, it, beforeEach, afterEach,
} from 'node:test';
import assert from 'node:assert';
import {
  resolve, basename, extname, dirname,
} from 'node:path';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import launchBrowser from '../utils/launch-browser.js';
import browseHtmlPlaygroundFile from '../utils/browse-file.js';
import takeBrowserScreenshot from '../utils/take-browser-screenshot.js';
import compareTwoImages from '../utils/compare-two-images.js';
import cropImage from '../utils/crop-image.js';

const CROP = {
  top: 0,

  left: 0,

  width: 600,

  height: 400,
};

const VIEWPORT = {
  width: 640,

  height: 480,
};

const takeCroppedBrowserScreenshot = async (
  page,

  filename,
) => {
  let image = await takeBrowserScreenshot(page, filename);

  ({ output: image } = await cropImage(image, CROP));

  return image;
};

const currentPath = dirname(fileURLToPath(import.meta.url));

const currentPathFiles = await readdir(currentPath);

const currentPathHtmlFiles = currentPathFiles.filter((file) => extname(file) === '.html');

currentPathHtmlFiles.forEach((htmlFile) => {
  const filenameWithoutExt = basename(htmlFile, extname(htmlFile));

  describe(filenameWithoutExt, () => {
    let browser;

    beforeEach(async () => {
      browser = await launchBrowser(VIEWPORT);
    });

    afterEach(async () => {
      await browser.close();
    });

    it('should be able to ensure scroll position standard approach', async () => {
      const page = await browseHtmlPlaygroundFile(browser, resolve(currentPath, htmlFile));

      await page.evaluate(() => document.querySelector('#scroll-by-some-px').click());

      const firstImage = await takeCroppedBrowserScreenshot(page, `${filenameWithoutExt}-0`);

      await page.evaluate(() => document.querySelector('#toggle-lock-scroll').click());

      const secondImage = await takeCroppedBrowserScreenshot(page, `${filenameWithoutExt}-1`);

      let {
        isSameDimensions,

        rawMisMatchPercentage,
      } = await compareTwoImages(firstImage, secondImage);

      assert.equal(isSameDimensions, true);
      assert.equal(Math.floor(rawMisMatchPercentage), 0);

      await page.evaluate(() => document.querySelector('#restore-scroll').click());

      const thirdImage = await takeCroppedBrowserScreenshot(page, `${filenameWithoutExt}-2`);

      ({
        isSameDimensions,

        rawMisMatchPercentage,
      } = await compareTwoImages(firstImage, thirdImage));

      assert.equal(isSameDimensions, true);
      assert.equal(Math.floor(rawMisMatchPercentage), 0);

      await page.evaluate(() => document.querySelector('#toggle-lock-scroll').click());

      const fourthImage = await takeCroppedBrowserScreenshot(page, `${filenameWithoutExt}-3`);

      ({
        isSameDimensions,

        rawMisMatchPercentage,
      } = await compareTwoImages(secondImage, fourthImage));

      assert.equal(isSameDimensions, true);
      assert.notEqual(Math.floor(rawMisMatchPercentage), 0);

      await page.close();
    });
  });
});
