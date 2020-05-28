import { promises as fs } from "fs";
import { name } from "./utils.mjs";
import babel from "@babel/core";

export default async (path, dest, ext, options) => {
    console.log(`${path}: start`);

    const result = await babel.transformFileAsync(path, options);

    const file = name(path, ext);
    await Promise.all([
        fs.writeFile(`${dest}/${file}.map`, JSON.stringify(result.map)),
        fs.writeFile(`${dest}/${file}`, result.code)
    ]);

    console.log(`${path}: end`);
};
