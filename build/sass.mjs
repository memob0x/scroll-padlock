import postscss from "postscss";

export default async (options, plugins) => {
    console.log(`${options.from}: start`);

    postscss(plugins).process(options);

    console.log(`${options.from}: end`);
};
