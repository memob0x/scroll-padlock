import 'jsdom-global/register.js';

import chai from 'chai';

import { debounce, getElementParentsLength, getElementIndex, joinHyphen } from '../../src/utils.mjs';

const { expect } = chai;

describe('utils', () => {
    const debounceIntervalMs = 125;

    const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout));

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

    it('should be able to count a given element parents', () => {
        const holder = document.createElement('div');

        const div1 = document.createElement('div');

        const div2 = document.createElement('div');

        expect(getElementParentsLength(document.documentElement)).to.equals(0);

        expect(getElementParentsLength(document.body)).to.equals(1);

        expect(getElementParentsLength(holder)).to.equals(0);

        div1.prepend(div2);

        holder.prepend(div1);

        expect(getElementParentsLength(div1)).to.equals(1);

        expect(getElementParentsLength(div2)).to.equals(2);
    });

    it('should be able to get a given element index in DOM tree', () => {
        const holder = document.createElement('div');

        const div1 = document.createElement('div');

        const div2 = document.createElement('div');

        const div3 = document.createElement('div');

        expect(getElementIndex(document.documentElement)).to.equals(0);

        expect(getElementIndex(holder)).to.equals(0);

        holder.prepend(div3);

        holder.prepend(div2);

        holder.prepend(div1);

        expect(getElementIndex(div1)).to.equals(0);

        expect(getElementIndex(div2)).to.equals(1);

        expect(getElementIndex(div3)).to.equals(2);
    });

    it('should be able to join string fragments with hyphens', () => expect(joinHyphen('foo', 'barr', 1234)).to.equals('foo-barr-1234'));
});
