import babel from "@rollup/plugin-babel";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

import buildCSS from "./build/sass.mjs";
import buildJS from "./build/js.mjs";
import buildJsBundle from "./build/js.bundle.mjs";

const babelPresets = ["@babel/preset-env"];

// demo files
// -----------------------------------------------------------------------------------------
(async (root) =>
    await Promise.all([
        await buildJS(`${root}/src/scripts.js`, `${root}/dist`, "js", {
            presets: babelPresets,
            comments: false,
            compact: true,
            sourceMap: true
        }),

        await buildCSS(
            {
                file: `${root}/src/styles.scss`,
                outFile: `${root}/dist/styles.css`,
                sourceMap: true,
                sourceMapEmbed: true
            },
            [autoprefixer(), cssnano()]
        )
    ]))("./demo");

// library
// -----------------------------------------------------------------------------------------
(async () => {
    const boundles = [];

    ["amd", "iife", "system", "es", "cjs"].forEach((type) =>
        buildJsBundle({
            input: {
                input: "./src/body-scroll.mjs"
            },
            output: [
                {
                    compact: true,
                    sourcemap: true,
                    format: type,
                    name: "bodyScroll",
                    file: `./dist/${type}/body-scroll.js`,
                    exports: "auto",
                    plugins: [
                        babel.getBabelOutputPlugin({
                            compact: true,
                            comments: false,
                            presets: babelPresets,
                            allowAllFormats: true
                        })
                    ]
                }
            ]
        })
    );

    await Promise.all(boundles);
})();
