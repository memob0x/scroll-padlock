import path from 'path';
import { mkdir } from 'fs/promises';

const screenshotsPath = path.resolve('./test/e2e/screenshots');

const ensureFolderExistence = async path => {
    try {
        await mkdir(path);
    } catch (e) { }
};

export default async (page, name) => {
    await ensureFolderExistence(screenshotsPath);

    await page.screenshot({ path: `${screenshotsPath}/${name}.jpg`, type: 'jpeg' });
};