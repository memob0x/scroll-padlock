import connect from 'connect';
import serveStatic from 'serve-static';
import path from 'path';

const PORT = 9999;
const PATH = './demo';

connect()
    .use(serveStatic(PATH))
    .listen(PORT, () => console.log(`Server exposes ${path.resolve(PATH)} on port ${PORT}...`));
