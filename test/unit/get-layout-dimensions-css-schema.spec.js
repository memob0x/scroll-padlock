import { expect } from 'chai';
import getLayoutDimensionsCssSchema from '../../src/get-layout-dimensions-css-schema';

describe('src/get-layout-dimensions-css-schema', () => {
  it('should be able to format a layout object as a css rules schema', () => {
    expect(getLayoutDimensionsCssSchema())
      .to.deep.equals(getLayoutDimensionsCssSchema(null))
      .to.deep.equals(getLayoutDimensionsCssSchema({}))
      .to.deep.equals([
        ['--scroll-padlock-outer-width', 0],
        ['--scroll-padlock-outer-height', 0],
        ['--scroll-padlock-inner-width', 0],
        ['--scroll-padlock-inner-height', 0],
        ['--scroll-padlock-scroll-width', 0],
        ['--scroll-padlock-scroll-height', 0],
        ['--scroll-padlock-scrollbar-width', 0],
        ['--scroll-padlock-scrollbar-height', 0],
      ]);

    expect(getLayoutDimensionsCssSchema({
      outerWidth: 1,
      outerHeight: 2,
      innerWidth: 3,
      innerHeight: 4,
      scrollWidth: 5,
      scrollHeight: 6,
      scrollbarWidth: 7,
      scrollbarHeight: 8,
    })).to.deep.equals([
      ['--scroll-padlock-outer-width', 1],
      ['--scroll-padlock-outer-height', 2],
      ['--scroll-padlock-inner-width', 3],
      ['--scroll-padlock-inner-height', 4],
      ['--scroll-padlock-scroll-width', 5],
      ['--scroll-padlock-scroll-height', 6],
      ['--scroll-padlock-scrollbar-width', 7],
      ['--scroll-padlock-scrollbar-height', 8],
    ]);
  });
});
