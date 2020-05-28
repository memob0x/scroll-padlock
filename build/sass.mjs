import { promises as fs } from "fs";
import sass from "node-sass";
import { name } from "./utils.mjs";

export default async (options, dest) => {
    console.log(`${options.file}: start`);

    const result = await new Promise((resolve, reject) =>
        sass.render(options, (err, result) =>
            err ? reject(err) : resolve(result)
        )
    );

    const file = name(options.file, "css");
    await Promise.all([
        fs.writeFile(`${dest}/${file}.map`, result.map),
        fs.writeFile(`${dest}/${file}`, result.css)
    ]);

    console.log(`${options.file}: end`);
};
