import pixelmatch from 'pixelmatch';
import sharp from 'sharp';
import { Buffer } from 'buffer';

/**
 * Compares two images and returns the raw mismatch percentage.
 * @param imgA - The first image.
 * @param imgA.data - The first image data.
 * @param imgA.info - The first image informations.
 * @param imgB - The second image.
 * @param imgB.data - The first image data.
 * @param imgB.info - The first image informations.
 * @returns A promise that resolves to the raw mismatch percentage.
 */
export function compareTwoImages(imgA: {
  data: Buffer<ArrayBufferLike>;
  info: sharp.OutputInfo;
}, imgB: {
  data: Buffer<ArrayBufferLike>;
  info: sharp.OutputInfo;
}) {
  return (pixelmatch(
    imgA.data,
    imgB.data,
    undefined, // do not generate diff image
    imgA.info.width,
    imgA.info.height,
    {
      threshold: 0.1,
      includeAA: true,
    },
  ) / (imgA.info.width * imgA.info.height)) * 100;
}
