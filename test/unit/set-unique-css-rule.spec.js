import { expect } from 'chai';
import 'jsdom-global/register';
import setUniqueCssRule from '../../src/set-unique-css-rule';

describe('src/set-unique-css-rule', () => {
  it('should be able to append a unique css rule to a given dom style tag', () => {
    const styler = document.createElement('style');

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
