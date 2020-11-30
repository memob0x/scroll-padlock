import babel from "@rollup/plugin-babel";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

import buildCSS from "./build/sass.mjs";
import buildJS from "./build/js.mjs";
import buildJsBundle from "./build/js.bundle.mjs";

const babelPresets = ["@babel/preset-env"];
const babelPlugins = ["@babel/plugin-proposal-class-properties"];

// demo files
// -----------------------------------------------------------------------------------------
(async (root) =>
    await Promise.all([
        await buildJS(`${root}/src/scripts.js`, `${root}/dist`, "js", {
            presets: babelPresets,
            plugins: babelPlugins,
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
                input: "./src/padlock.mjs"
            },
            output: [
                {
                    compact: true,
                    sourcemap: true,
                    format: type,
                    name: "ScrollPadlock",
                    file: `./dist/${type}/scroll-padlock.js`,
                    exports: "auto",
                    plugins: [
                        babel.getBabelOutputPlugin({
                            compact: true,
                            comments: false,
                            presets: babelPresets,
                            plugins: babelPlugins,
                            allowAllFormats: true
                        })
                    ]
                }
            ]
        })
    );

    await Promise.all(boundles);
})();
