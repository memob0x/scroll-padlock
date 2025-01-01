import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import ensureFolderExistence from './ensure-folder-existence.js';

const currentPath = dirname(fileURLToPath(import.meta.url));

const screenshotsPath = resolve(currentPath, '..', 'screenshots');

export default async (page, name) => {
  await ensureFolderExistence(screenshotsPath);

  const path = `${screenshotsPath}/${name}.jpg`;

  await page.screenshot({ path, type: 'jpeg' });

  return path;
};
