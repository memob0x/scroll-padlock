import { describe, it } from 'node:test';
import { doesNotThrow, equal, match } from 'node:assert';
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
    equal(getCSSCustomProperties({
      offsetWidth: 100,
      offsetHeight: 200,
      clientWidth: 90,
      clientHeight: 190,
      scrollWidth: 300,
      scrollHeight: 400,
      scrollTop: 10,
      scrollLeft: 20,
    }), '--offset-width:100px;'
+ '--offset-height:200px;'
+ '--client-width:90px;'
+ '--client-height:190px;'
+ '--scroll-width:300px;'
+ '--scroll-height:400px;'
+ '--scroll-top:10px;'
+ '--scroll-left:20px;');
  });

  it('should set "client" values using the minimum value between the given "offset" and "client" values', () => {
    const result = getCSSCustomProperties({
      offsetWidth: 100,
      offsetHeight: 200,
      clientWidth: 120,
      clientHeight: 190,

      scrollWidth: 999,
      scrollHeight: 999,
      scrollTop: 999,
      scrollLeft: 999,
    });

    match(result, /--client-width:100px;/);
    match(result, /--client-height:190px/);
  });
});
