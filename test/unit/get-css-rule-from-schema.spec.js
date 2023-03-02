import { expect } from 'chai';
import getCssRuleFromSchema from '../../src/get-css-rule-from-schema';

describe('src/get-css-rule-from-schema', () => {
  it('should be able to convert a css rule schema object to string', () => {
    expect(getCssRuleFromSchema('.test-selector', [
      ['--scroll-padlock-outer-width', 1],
      ['--scroll-padlock-outer-height', 2],
      ['--scroll-padlock-inner-width', 3],
      ['--scroll-padlock-inner-height', 4],
      ['--scroll-padlock-scroll-width', 5],
      ['--scroll-padlock-scroll-height', 6],
      ['--scroll-padlock-scrollbar-width', 7],
      ['--scroll-padlock-scrollbar-height', 8],
    ])).to.equal('.test-selector { --scroll-padlock-outer-width: 1px; --scroll-padlock-outer-height: 2px; --scroll-padlock-inner-width: 3px; --scroll-padlock-inner-height: 4px; --scroll-padlock-scroll-width: 5px; --scroll-padlock-scroll-height: 6px; --scroll-padlock-scrollbar-width: 7px; --scroll-padlock-scrollbar-height: 8px; }');
  });
});
