import { resolve } from 'path';
import ensureFolderExistence from './ensure-folder-existence.js';

const screenshotsPath = resolve('./test/e2e/screenshots');

export default async (page, name) => {
  await ensureFolderExistence(screenshotsPath);

  const path = `${screenshotsPath}/${name}.jpg`;

  await page.screenshot({ path, type: 'jpeg' });

  return path;
};
