import { writeFile } from 'fs/promises';
import jsdoc2md from 'jsdoc-to-markdown';

await writeFile(
  './documentation.md',

  await jsdoc2md.render({
    files: 'src/**/*.js',
  }),
);
