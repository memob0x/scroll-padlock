import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

import getScroll from '../../src/get-scroll-position.js';
import getJsdomWindow from '../utils/get-jsdom-window.js';

describe(getScroll.name, () => {
  let window;

  let document;

  beforeEach(() => {
    window = getJsdomWindow();

    ({ document } = window);
  });

  it('should not throw with given invalid arguments', () => {
    assert.deepEqual(getScroll(), getScroll(null));

    assert.deepEqual(getScroll(), {
      top: 0,
      left: 0,
    });
  });

  it('should be able to get an element scroll position', () => {
    const div = document.createElement('div');

    div.scrollTop = 10;
    div.scrollLeft = 20;

    assert.deepEqual(getScroll(div), { top: 10, left: 20 });
  });

  it('should be able to get the page scroll position', () => {
    // Saves original values
    const {
      scrollX, scrollY, pageXOffset, pageYOffset,
    } = window;

    // Mocks a modern browser
    let position = { top: 10, left: 20 };
    window.scrollY = position.top;
    window.scrollX = position.left;

    assert.deepEqual(getScroll(window), position);

    // Mocks an old browser
    window.scrollY = null;
    window.scrollX = null;

    position = { top: 11, left: 21 };
    window.pageYOffset = position.top;
    window.pageXOffset = position.left;

    assert.deepEqual(getScroll(window), position);

    // Restores original values
    window.scrollY = scrollY;
    window.scrollX = scrollX;
    window.pageYOffset = pageYOffset;
    window.pageXOffset = pageXOffset;
  });
});
