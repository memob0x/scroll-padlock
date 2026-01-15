import pixelmatch from 'pixelmatch';
import { parseImage } from './parse-image';

/**
 * Compares two images and returns the raw mismatch percentage.
 * @param pathA - Path to the first image.
 * @param pathB - Path to the second image.
 * @returns A promise that resolves to the raw mismatch percentage.
 */
export async function compareTwoImages(pathA: string, pathB: string): Promise<number> {
  const [
    imgA,
    imgB,
  ] = await Promise.all([
    parseImage(pathA),
    parseImage(pathB),
  ]);

  if (imgA.info.width !== imgB.info.width || imgA.info.height !== imgB.info.height) {
    throw new Error('Images must have the same dimensions');
  }

  if (!imgA.data || !imgB.data) {
    throw new Error('Failed to read PNG image data');
  }

  const totalPixels = imgA.info.width * imgA.info.height;

  const diffPixels = pixelmatch(
    imgA.data,
    imgB.data,
    undefined, // do not generate diff image
    imgA.info.width,
    imgA.info.height,
    {
      threshold: 0.1,
      includeAA: true,
    },
  );

  return (diffPixels / totalPixels) * 100;
}
