import { JSDOM } from 'jsdom';

const getJsdomWindow = () => {
  const { window } = new JSDOM(
    '<html> <body> </body> </html>',
    { url: 'http://localhost' },
  );

  return window;
};

export default getJsdomWindow;
