/**
 * Delays execution for a specified number of milliseconds.
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified delay.
 */
export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
