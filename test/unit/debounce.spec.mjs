import 'jsdom-global/register.js';

import chai from 'chai';

import debounce from '../../src/debounce.mjs';

import sleep from '../utils/sleep.mjs';

const { expect } = chai;

describe('debounce', () => {
    const debounceIntervalMs = 125;

    it('should be able to make a debounced function off a given function', async () => {
        let calls = 0;

        const fn = debounce(() => (calls++), debounceIntervalMs);

        // This call will be detected
        fn();

        // This call won't be detected because of debounce
        fn();

        expect(calls).to.equals(0);

        await sleep(debounceIntervalMs);

        expect(calls).to.equals(1);

        // This will be detected
        fn();

        // This call won't be detected because of debounce
        fn();

        await sleep(debounceIntervalMs);

        expect(calls).to.equals(2);
    });
});
