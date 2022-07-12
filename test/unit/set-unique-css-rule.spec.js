import { expect } from 'chai';
import setUniqueCssRule from '../../src/set-unique-css-rule';
import getJsdomWindow from '../utils/get-jsdom-window';

describe('src/set-unique-css-rule', () => {
  it('should be able to append a unique css rule to a given dom style tag', () => {
    const window = getJsdomWindow();

    const styler = window.document.createElement('style');

    setUniqueCssRule(styler, '.color { color: red; }');

    expect(styler.sheet).to.be.null;

    window.document.body.append(styler);

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
