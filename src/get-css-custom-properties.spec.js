import { describe, it } from 'node:test';
import { equal, match, throws } from 'node:assert';
import getCSSCustomProperties from './get-css-custom-properties.js';

describe(getCSSCustomProperties.name, () => {
  it('should throw when the parameter is missing', () => {
    throws(() => getCSSCustomProperties(), Error);
  });

  it('should not handle missing properties', () => {
    equal(getCSSCustomProperties({ }), '--offset-width:NaNpx;'
+ '--offset-height:NaNpx;'
+ '--client-width:NaNpx;'
+ '--client-height:NaNpx;'
+ '--scroll-width:NaNpx;'
+ '--scroll-height:NaNpx;'
+ '--scrollbar-width:NaNpx;'
+ '--scrollbar-height:NaNpx;'
+ '--scroll-top:NaNpx;'
+ '--scroll-left:NaNpx;');
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
+ '--scrollbar-width:10px;'
+ '--scrollbar-height:10px;'
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

  it('should calculate and set "scrollbar" values using the given "offset" and "client" values without setting negative values', () => {
    const result = getCSSCustomProperties({
      offsetWidth: 150,
      offsetHeight: 250,
      clientWidth: 100,
      clientHeight: 200,

      scrollWidth: 999,
      scrollHeight: 999,
      scrollTop: 999,
      scrollLeft: 999,
    });

    match(result, /--scrollbar-width:50px;/);
    match(result, /--scrollbar-height:50px;/);
  });
});
