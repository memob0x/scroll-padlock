import { access } from 'fs/promises';

export default async (path) => {
  try {
    await access(path);

    return true;
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return false;
  }
};
