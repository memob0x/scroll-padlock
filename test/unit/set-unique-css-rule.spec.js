import { describe, it, beforeEach } from 'node:test';
import { expect } from 'chai';
import setUniqueCssRule from '../../src/set-unique-css-rule.js';
import getJsdomWindow from '../utils/get-jsdom-window.js';

describe('src/set-unique-css-rule', () => {
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

    expect(styler.sheet).to.be.null;

    document.body.append(styler);

    expect(styler.sheet).to.not.be.null;

    expect(styler.sheet.cssRules).to.be.lengthOf(0);

    setUniqueCssRule(styler, '.color { color: red; }');

    expect(styler.sheet.cssRules).to.be.lengthOf(1);

    setUniqueCssRule(styler, '.color { color: red; }');

    expect(styler.sheet.cssRules).to.be.lengthOf(1);

    setUniqueCssRule(styler, '.color { color: blue; }');

    expect(styler.sheet.cssRules).to.be.lengthOf(1);

    styler.remove();
  });
});
