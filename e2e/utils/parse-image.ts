import fs from 'fs/promises';
import sharp from 'sharp';

/**
 * Reads an image from disk and converts it to raw RGBA pixel data.
 *
 * Supports PNG, JPEG, WebP, and any format supported by `sharp`.
 * @param {string} path - The file path to the image.
 * @returns An object containing "data" (Buffer) and "info" (metadata including width, height...).
 * @example
 * const { data, info } = await parseImage('image.png');
 * console.log(info.width, info.height); // Image dimensions
 */
export async function parseImage(path: string) {
  const buffer = await fs.readFile(path);

  const image = sharp(buffer);

  return image.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
}
