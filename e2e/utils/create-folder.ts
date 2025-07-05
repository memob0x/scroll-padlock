import { mkdir } from 'fs/promises';
import { folderExists } from './folder-exists.js';

/**
 * Creates a folder at the specified path if it does not already exist.
 * @param path - The path where the folder should be created.
 */
export async function createFolder(path: string) {
  if (await folderExists(path)) {
    return;
  }

  await mkdir(path);
}
