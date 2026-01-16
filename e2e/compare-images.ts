import pixelmatch from 'pixelmatch';
import sharp from 'sharp';
import { Buffer } from 'buffer';

type Image = {
  data: Buffer<ArrayBufferLike>;
  info: sharp.OutputInfo;
};

/**
 * Compares two images and returns the raw mismatch percentage.
 * @param a - The first image.
 * @param b - The second image.
 * @returns A promise that resolves to the raw mismatch percentage.
 */
export function compareImages(a: Image, b: Image) {
  const {
    width,
    height,
  } = a.info;

  return (pixelmatch(
    a.data,
    b.data,
    undefined, // do not generate diff image
    width,
    height,
    {
      threshold: 0.1,
      includeAA: true,
    },
  ) / (width * height)) * 100;
}
