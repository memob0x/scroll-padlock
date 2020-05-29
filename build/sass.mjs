import { promises as fs } from "fs";
import sass from "node-sass";
import { name } from "./utils.mjs";
import postscss from "postscss";

export default async (options, plugins) => {
    console.log(`${options.from}: start`);

    postscss(plugins).process(options);

    console.log(`${options.from}: end`);
};
