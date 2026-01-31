import { describe, it } from 'node:test';
import { doesNotThrow, equal } from 'node:assert';
import { getCSSCustomProperties } from './get-css-custom-properties.js';

describe(getCSSCustomProperties.name, () => {
  it('should not throw when the parameter is missing', () => {
    doesNotThrow(() => getCSSCustomProperties(), Error);
  });

  it('should handle missing properties', () => {
    equal(getCSSCustomProperties({ }), '--offset-width:0px;'
+ '--offset-height:0px;'
+ '--client-width:0px;'
+ '--client-height:0px;'
+ '--scroll-width:0px;'
+ '--scroll-height:0px;'
+ '--scroll-top:0px;'
+ '--scroll-left:0px;');
  });

  it('should format CSS custom attributes correctly', () => {
    const offsetWidth = 1;
    const offsetHeight = 2;
    const clientWidth = 3;
    const clientHeight = 4;
    const scrollWidth = 5;
    const scrollHeight = 6;
    const scrollTop = 7;
    const scrollLeft = 8;

    equal(getCSSCustomProperties({
      offsetWidth,
      offsetHeight,
      clientWidth,
      clientHeight,
      scrollWidth,
      scrollHeight,
      scrollTop,
      scrollLeft,
    }), `--offset-width:${offsetWidth}px;`
+ `--offset-height:${offsetHeight}px;`
+ `--client-width:${clientWidth}px;`
+ `--client-height:${clientHeight}px;`
+ `--scroll-width:${scrollWidth}px;`
+ `--scroll-height:${scrollHeight}px;`
+ `--scroll-top:${scrollTop}px;`
+ `--scroll-left:${scrollLeft}px;`);
  });
});
