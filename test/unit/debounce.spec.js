import 'jsdom-global/register';

import { expect } from 'chai';

import debounce from '../../src/debounce';

describe('debounce', () => {
  it('should be able to make a debounced function off a given function', async () => {
    let calls = 0;

    const fn = debounce(() => {
      calls += 1;
    });

    // This call won't be detected because of debounce
    fn();

    // This call will be detected
    fn();

    expect(calls).to.equals(0);

    await new Promise(window.setTimeout);

    expect(calls).to.equals(1);

    // This call won't be detected because of debounce
    fn();

    // This will be detected
    fn();

    expect(calls).to.equals(1);

    await new Promise(window.setTimeout);

    expect(calls).to.equals(2);
  });
});
