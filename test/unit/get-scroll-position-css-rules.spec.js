import { describe, it } from 'node:test';
import { expect } from 'chai';
import getScrollPositionCssRules from '../../src/get-scroll-position-css-rules.js';

describe('src/get-scroll-position-css-rules', () => {
  it('should be able to format a scroll object as a css rules string', () => {
    expect(getScrollPositionCssRules())
      .to.equals(getScrollPositionCssRules(null))
      .to.equals(getScrollPositionCssRules({}))
      .to.equals(`--scroll-padlock-scroll-top: 0px;
--scroll-padlock-scroll-left: 0px;`);

    expect(getScrollPositionCssRules({
      top: 10,
      left: 20,
    })).to.equals(`--scroll-padlock-scroll-top: 10px;
--scroll-padlock-scroll-left: 20px;`);
  });
});
