import { expect } from 'chai';
import getScrollPositionCssSchema from '../../src/get-scroll-position-css-schema';

describe('src/get-scroll-position-css-schema', () => {
  it('should be able to format a scroll object as a css rules schema', () => {
    expect(getScrollPositionCssSchema({
      top: 10,
      left: 20,
    })).to.deep.equals([
      ['--scroll-padlock-scroll-top', 10],
      ['--scroll-padlock-scroll-left', 20],
    ]);
  });
});
