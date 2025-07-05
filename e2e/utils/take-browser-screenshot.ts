import {
  basename, dirname, extname, join,
} from 'path';
import { rename, rm } from 'fs/promises';
import sharp from 'sharp';
import { ImageFormat, Page } from 'puppeteer';
import { createFolder } from './create-folder.ts';

type Options = {
  crop?: sharp.Region
};

/**
 * Takes a screenshot of the given Puppeteer page, optionally crops it, and saves it to the specified path.
 * @param page - The Puppeteer Page instance to capture.
 * @param path - The file path (including extension) where the screenshot will be saved.
 * @param options - Options for screenshot processing.
 * @returns A promise that resolves to the final screenshot file path.
 */
export async function takeBrowserScreenshot(page: Page, path: `${string}.${ImageFormat}`, options?: Options) {
  const {
    crop,
  } = options || {};

  const pathFolder = dirname(path);

  await createFolder(pathFolder);

  await page.screenshot({
    path,
  });

  if (crop) {
    const pathCrop = join(
      pathFolder,

      `${basename(path, extname(path))}-crop${extname(path)}`,
    );

    await sharp(path).extract(crop).toFile(pathCrop);

    await rm(path);

    await rename(pathCrop, path);
  }

  return path;
}
