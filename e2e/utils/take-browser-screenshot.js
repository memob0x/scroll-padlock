import {
  basename, dirname, extname, join,
} from 'path';
import { rename, rm } from 'fs/promises';
import sharp from 'sharp';
import ensureFolderExistence from './ensure-folder-existence.js';

export default async (page, path, options) => {
  const {
    type = 'jpeg',

    crop,
  } = options || {};

  const pathFolder = dirname(path);

  await ensureFolderExistence(pathFolder);

  await page.screenshot({
    path,

    type,
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
};
