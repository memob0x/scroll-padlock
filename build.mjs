import buildCSS from "./build/sass.mjs";
import buildJS from "./build/js.mjs";
import buildJsBundle from "./build/js.bundle.mjs";

import babel from "@rollup/plugin-babel";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

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
                from: `${root}/src/styles.scss`,
                to: `${root}/dist/styles.css`
            },
            [autoprefixer(), cssnano()]
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
