import { access } from 'fs/promises';

/**
 * Checks if a folder exists at the given path.
 * @param path - The path to the folder to check.
 * @returns A promise that resolves to true if the folder exists, otherwise false.
 */
export async function folderExists(path: string) {
  try {
    await access(path);

    return true;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err: unknown) {
    return false;
  }
}
