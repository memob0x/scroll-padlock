import { promises as fs } from "fs";
import sass from "node-sass";
import postcss from "postcss";
import path from "path";

export default async (options, plugins) => {
    console.log(`${options.file}: start`);

    options.from = path.resolve(options.file);
    options.outFile = path.resolve(options.outFile);

    const nodeSassResult = await new Promise((resolve, reject) =>
        sass.render(options, (err, result) =>
            err ? reject(err) : resolve(result)
        )
    );

    const postCssResult = await postcss(plugins).process(nodeSassResult.css, {
        from: options.from,
        to: options.outFile,
        map: { inline: false }
    });

    await Promise.all([
        fs.writeFile(`${options.outFile}.map`, postCssResult.map.toString()),
        fs.writeFile(`${options.outFile}`, postCssResult.css)
    ]);

    console.log(`${options.file}: end`);
};
