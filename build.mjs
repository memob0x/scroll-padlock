import buildCSS from "./build/sass.mjs";
import buildJS from "./build/js.mjs";
import buildJsBundle from "./build/js.bundle.mjs";

import babel from "@rollup/plugin-babel";

// demo files
// -----------------------------------------------------------------------------------------
(async (root) =>
    await Promise.all([
        await buildJS(`${root}/src/scripts.js`, `${root}/dist`, "js", {
            presets: ["@babel/preset-env"],
            comments: false,
            compact: true
        }),

        await buildCSS(
            {
                file: `${root}/src/styles.scss`,
                outputStyle: "compressed",
                sourceMap: `${root}/src/styles.scss`,
                omitSourceMapUrl: true
            },
            `${root}/dist`
        )
    ]))("./demo");

// library
// -----------------------------------------------------------------------------------------
(async () =>
    await buildJsBundle({
        input: {
            input: "./src/body-scroll.mjs"
        },
        output: [
            {
                compact: true,
                sourcemap: true,
                format: "umd",
                name: "bodyScroll",
                file: "./dist/body-scroll.js",
                plugins: [
                    babel.getBabelOutputPlugin({
                        compact: true,
                        comments: false,
                        presets: ["@babel/preset-env"],
                        allowAllFormats: true
                    })
                ]
            }
        ]
    }))();
