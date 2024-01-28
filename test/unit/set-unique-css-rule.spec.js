import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import setUniqueCssRule from '../../src/set-unique-css-rule.js';
import getJsdomWindow from '../utils/get-jsdom-window.js';

describe(setUniqueCssRule.name, () => {
  let window;

  let document;

  let styler;

  beforeEach(() => {
    window = getJsdomWindow();

    ({ document } = window);

    styler = window.document.createElement('style');
  });

  it('should be able to append a unique css rule to a given dom style tag', () => {
    setUniqueCssRule(styler, '.color { color: red; }');

    assert.equal(styler.sheet, null);

    document.body.append(styler);

    assert.notEqual(styler.sheet, null);

    assert.equal(styler.sheet.cssRules.length, 0);

    setUniqueCssRule(styler, '.color { color: red; }');

    assert.equal(styler.sheet.cssRules.length, 1);

    setUniqueCssRule(styler, '.color { color: red; }');

    assert.equal(styler.sheet.cssRules.length, 1);

    setUniqueCssRule(styler, '.color { color: blue; }');

    assert.equal(styler.sheet.cssRules.length, 1);

    styler.remove();
  });
});
