import { describe, it } from 'node:test';
import assert from 'node:assert';

import getScrollPositionCssRules from '../../src/get-scroll-position-css-rules.js';

describe('src/get-scroll-position-css-rules', () => {
  it('should be able to format a scroll object as a css rules string', () => {
    assert.equal(getScrollPositionCssRules(), getScrollPositionCssRules(null));

    assert.equal(getScrollPositionCssRules(), getScrollPositionCssRules({}));

    assert.equal(getScrollPositionCssRules(), `--scroll-padlock-scroll-top: 0px;
--scroll-padlock-scroll-left: 0px;`);

    assert.equal(getScrollPositionCssRules({
      top: 10,
      left: 20,
    }), `--scroll-padlock-scroll-top: 10px;
--scroll-padlock-scroll-left: 20px;`);
  });
});
