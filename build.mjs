import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import rollupBabel from "@rollup/plugin-babel";
import rollupGzip from 'rollup-plugin-gzip';

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
    const bundles = [];

    const bundlify = async (type, min) => await buildJsBundle({
        input: {
            input: "./src/padlock.mjs"
        },
        output: [
            {
                compact: min,
                sourcemap: true,
                format: type,
                name: "ScrollPadlock",
                file: `./dist/${type}/scroll-padlock${min ? '.min' : ''}.js`,
                exports: "auto",
                plugins: [
                    rollupBabel.getBabelOutputPlugin({
                        compact: min,
                        comments: false,
                        presets: babelPresets,
                        plugins: babelPlugins,
                        allowAllFormats: true
                    }),
                    
                    rollupGzip()
                ]
            }
        ]
    });

    ["amd", "iife", "system", "es", "cjs"].forEach(type => {
        // non-minified version
        bundles.push(bundlify(type, false));

        // minified version
        bundles.push(bundlify(type, true));
    });

    await Promise.all(bundles);
})();
