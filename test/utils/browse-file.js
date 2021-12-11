export default async (browser, path) => {
  const page = await browser.newPage();

  await page.goto(`file://${path}`);

  // eslint-disable-next-line no-console
  page.on('console', (msg) => console.log(msg.text()));

  return page;
};
