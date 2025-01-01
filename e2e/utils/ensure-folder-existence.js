import { mkdir } from 'fs/promises';
import folderExists from './folder-exists.js';

export default async (path) => {
  if (await folderExists(path)) {
    return;
  }

  await mkdir(path);
};
