import { rollup } from "rollup";

export default async (options) => {
    console.log(`${options.input.input}: start`);

    const result = await rollup(options.input);

    options.output = Array.isArray(options.output) ? options.output : [options.output];

    await Promise.all(options.output.map((output) => result.write(output)));

    console.log(`${options.input.input}: end`);
};
