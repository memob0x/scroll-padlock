import {
  basename, dirname, extname, join,
} from 'path';
import { rename, rm } from 'fs/promises';
import sharp from 'sharp';

export default async (page, path, options) => {
  const {
    type = 'jpeg',

    crop,
  } = options || {};

  await page.screenshot({
    path,

    type,
  });

  if (crop) {
    const pathCrop = join(
      dirname(path),

      `${basename(path, extname(path))}-crop${extname(path)}`,
    );

    await sharp(path).extract(crop).toFile(pathCrop);

    await rm(path);

    await rename(pathCrop, path);
  }

  return path;
};
