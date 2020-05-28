import { extname } from "path";
import { promises as fs } from "fs";
import { basename, join } from "path";

const getFiles = async (path, extension) =>
    await asyncFilter(
        Array.isArray(path) ? path : await ls(path),
        async (file) => hasExtension(file, extension)
    );

const getDirectories = async (path) =>
    await asyncFilter(Array.isArray(path) ? path : await ls(path), isDirectory);

const asyncFilter = async (array, predicate) => {
    const results = await Promise.all(array.map(predicate));

    return array.filter((_v, index) => results[index]);
};

const asyncForEach = async (array, callback) => {
    for (let index = 0, count = array.length; index < count; index++) {
        await callback(array[index], index, array);
    }
};

const isDirectory = async (path) => (await fs.stat(path)).isDirectory();

const hasExtension = (path, extension) => extname(path) === `.${extension}`;

const eachFile = async (path, extension, callback) =>
    await asyncForEach(await getFiles(path, extension), callback);

const eachDirectory = async (path, callback) =>
    await asyncForEach(await getDirectories(path), callback);

export const each = async (...args) =>
    args.length <= 2 ? await eachDirectory(...args) : await eachFile(...args);

export const ls = async (root) =>
    (await fs.readdir(root)).map((file) => join(root, file));

export const extension = (path, extension) => {
    const fragments = path.split(".").slice(0, -1);

    if (extension) {
        fragments.push(extension);
    }

    return fragments.join(".");
};

export const name = (path, ext) => extension(basename(path), ext);

export const buffer = (path) => fs.readFile(path, "utf-8");
