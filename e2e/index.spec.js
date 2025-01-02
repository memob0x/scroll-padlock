import {
  describe, it, beforeEach, afterEach,
} from 'node:test';
import assert from 'node:assert';
import {
  resolve, basename, extname, dirname,
} from 'node:path';
import { readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import launchBrowser from './utils/launch-browser.js';
import browseHtmlPlaygroundFile from './utils/browse-file.js';
import takeBrowserScreenshot from './utils/take-browser-screenshot.js';
import compareTwoImages from './utils/compare-two-images.js';
import ensureFolderExistence from './utils/ensure-folder-existence.js';

const VIEWPORT = {
  width: 640,

  height: 480,
};

const VIEWPORT_CROP = {
  top: 0,

  left: 0,

  width: 620,

  height: 480,
};

const currentPath = dirname(fileURLToPath(import.meta.url));

const currentPathFiles = await readdir(currentPath);

const currentPathHtmlFiles = currentPathFiles.filter((file) => extname(file) === '.html');

const distPath = resolve(currentPath, '..', 'dist');

await ensureFolderExistence(distPath);

currentPathHtmlFiles.forEach((htmlFile) => {
  const filenameWithoutExt = basename(htmlFile, extname(htmlFile));

  const isModalFile = filenameWithoutExt.includes('modal');

  let crop = null;

  if (!isModalFile) {
    crop = VIEWPORT_CROP;
  }

  describe(filenameWithoutExt, () => {
    let browser;

    let page;

    const scrollBySomePx = () => page.evaluate(() => document.querySelector('[data-button-name="scroll-by-some-px"]').click());

    const toggleLockScroll = () => page.evaluate(() => document.querySelector('[data-button-name="toggle-lock-scroll"]').click());

    beforeEach(async () => {
      browser = await launchBrowser(VIEWPORT);

      page = await browseHtmlPlaygroundFile(browser, resolve(currentPath, htmlFile));
    });

    afterEach(async () => {
      await browser.close();
    });

    it('should be able to lock and unlock the scroll position without any layout shift', async () => {
      await scrollBySomePx();

      let screenshots = [];

      screenshots.push(await takeBrowserScreenshot(page, `${distPath}/${filenameWithoutExt}-${screenshots.length}.jpg`, { crop }));

      await toggleLockScroll();

      let comparison;

      if (!isModalFile) {
        screenshots.push(await takeBrowserScreenshot(page, `${distPath}/${filenameWithoutExt}-${screenshots.length}.jpg`, { crop }));

        comparison = await compareTwoImages(...screenshots);

        assert.equal(comparison.isSameDimensions, true);

        assert.equal(Math.floor(comparison.rawMisMatchPercentage), 0);

        await rm(screenshots[0]);

        screenshots.shift();
      }

      await toggleLockScroll();

      screenshots.push(await takeBrowserScreenshot(page, `${distPath}/${filenameWithoutExt}-${screenshots.length}.jpg`, { crop }));

      comparison = await compareTwoImages(...screenshots);

      assert.equal(comparison.isSameDimensions, true);

      assert.equal(Math.floor(comparison.rawMisMatchPercentage), 0);

      await Promise.all(screenshots.map((screenshot) => rm(screenshot)));

      screenshots = [];
    });
  });
});
