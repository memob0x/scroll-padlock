import { mkdir } from 'fs/promises';

import folderExists from './folder-exists';

export default async (path) => {
  if (await folderExists(path)) {
    return;
  }

  await mkdir(path);
};
