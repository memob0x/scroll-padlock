import { describe, it } from 'node:test';
import { equal, throws } from 'node:assert';
import getCSSCustomProperties from './get-css-custom-properties.js';

describe('getCSSCustomProperties', () => {
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
    }), `--offset-width: 100px;
--offset-height: 200px;
--client-width: 90px;
--client-height: 190px;
--scroll-width: 300px;
--scroll-height: 400px;
--scrollbar-width: 10px;
--scrollbar-height: 10px;
--scroll-top: 10px;
--scroll-left: 20px;`);
  });

  it('should throw when the parameter is missing', () => {
    throws(() => getCSSCustomProperties(), Error);
  });

  it('should not handle missing properties', () => {
    equal(getCSSCustomProperties({
      offsetWidth: 100,
      offsetHeight: 200,
    }), `--offset-width: 100px;
--offset-height: 200px;
--client-width: NaNpx;
--client-height: NaNpx;
--scroll-width: NaNpx;
--scroll-height: NaNpx;
--scrollbar-width: NaNpx;
--scrollbar-height: NaNpx;
--scroll-top: NaNpx;
--scroll-left: NaNpx;`);
  });

  it('should set "client" values using the minimum value between the given "offset" and "client" values', () => {
    equal(getCSSCustomProperties({
      offsetWidth: 100,
      offsetHeight: 200,
      clientWidth: 120,
      clientHeight: 190,

      scrollWidth: 999,
      scrollHeight: 999,

      scrollTop: 999,
      scrollLeft: 999,
    }), `--offset-width: 100px;
--offset-height: 200px;
--client-width: 100px;
--client-height: 190px;
--scroll-width: 999px;
--scroll-height: 999px;
--scrollbar-width: 0px;
--scrollbar-height: 10px;
--scroll-top: 999px;
--scroll-left: 999px;`);
  });

  it('should calculate and set "scrollbar" values using the given "offset" and "client" values without setting negative values', () => {
    equal(getCSSCustomProperties({
      offsetWidth: 150,
      offsetHeight: 250,
      clientWidth: 100,
      clientHeight: 200,

      scrollWidth: 999,
      scrollHeight: 999,

      scrollTop: 999,
      scrollLeft: 999,
    }), `--offset-width: 150px;
--offset-height: 250px;
--client-width: 100px;
--client-height: 200px;
--scroll-width: 999px;
--scroll-height: 999px;
--scrollbar-width: 50px;
--scrollbar-height: 50px;
--scroll-top: 999px;
--scroll-left: 999px;`);
  });
});
