import {
  describe, it, beforeEach, afterEach,
} from 'node:test';
import launchBrowser from '../utils/launch-browser.js';
import executeE2eTestCase from '../utils/execute-e2e-test-case.js';

describe('div-scroll-standard', () => {
  let browser;

  beforeEach(async () => {
    browser = await launchBrowser({
      width: 640,

      height: 480,
    });
  });

  afterEach(async () => {
    await browser.close();
  });

  it('should be able to ensure scroll position standard approach', () => executeE2eTestCase(browser, './test/e2e/div-scroll-standard.html', {
    top: 0,

    left: 0,

    width: 600,

    height: 400,
  }));
});
