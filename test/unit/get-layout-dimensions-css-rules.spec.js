import { describe, it } from 'node:test';
import assert from 'node:assert';

import getLayoutDimensionsCssRules from '../../src/get-layout-dimensions-css-rules.js';

describe('src/get-layout-dimensions-css-rules', () => {
  it('should be able to format a layout object as a css rules string', () => {
    assert.equal(getLayoutDimensionsCssRules(), getLayoutDimensionsCssRules(null));

    assert.equal(getLayoutDimensionsCssRules(), getLayoutDimensionsCssRules({}));

    assert.equal(getLayoutDimensionsCssRules(), `--scroll-padlock-outer-width: 0px;
--scroll-padlock-outer-height: 0px;
--scroll-padlock-inner-width: 0px;
--scroll-padlock-inner-height: 0px;
--scroll-padlock-scroll-width: 0px;
--scroll-padlock-scroll-height: 0px;
--scroll-padlock-scrollbar-width: 0px;
--scroll-padlock-scrollbar-height: 0px;`);

    assert.equal(getLayoutDimensionsCssRules({
      outerWidth: 1,
      outerHeight: 2,
      innerWidth: 3,
      innerHeight: 4,
      scrollWidth: 5,
      scrollHeight: 6,
      scrollbarWidth: 7,
      scrollbarHeight: 8,
    }), `--scroll-padlock-outer-width: 1px;
--scroll-padlock-outer-height: 2px;
--scroll-padlock-inner-width: 3px;
--scroll-padlock-inner-height: 4px;
--scroll-padlock-scroll-width: 5px;
--scroll-padlock-scroll-height: 6px;
--scroll-padlock-scrollbar-width: 7px;
--scroll-padlock-scrollbar-height: 8px;`);
  });
});
