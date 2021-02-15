import { mkdir } from 'fs/promises';

export default async path => {
    try {
        await mkdir(path);
    } catch (e) { }
};
