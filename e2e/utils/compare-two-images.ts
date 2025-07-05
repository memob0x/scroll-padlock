import resemble from 'resemblejs';

/**
 * Compares two images and returns the raw mismatch percentage.
 * @param a - The path or data URL of the first image.
 * @param b - The path or data URL of the second image.
 * @returns A promise that resolves to the raw mismatch percentage between the two images.
 */
export function compareTwoImages(a: string, b: string) {
  return new Promise<number>((resolve) => {
    resemble(a)
      .compareTo(b)
      .onComplete(({ rawMisMatchPercentage }) => resolve(rawMisMatchPercentage));
  });
}
