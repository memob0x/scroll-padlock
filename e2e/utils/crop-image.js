import sharp from 'sharp';
import {
  dirname,
  basename,
  extname,
  join,
} from 'node:path';

export default async (
  imgInput,

  options,

  imgOutput = join(
    dirname(imgInput),

    `${basename(imgInput, extname(imgInput))}-crop${extname(imgInput)}`,
  ),
) => {
  const data = await sharp(imgInput).extract(options).toFile(imgOutput);

  return {
    ...data,

    output: imgOutput,
  };
};
