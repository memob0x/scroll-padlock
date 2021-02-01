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

        // will be detected
        fn();

        // not detected
        fn();

        expect(calls).to.equals(0);

        await sleep(debounceIntervalMs);

        expect(calls).to.equals(1);

        // will be detected
        fn();

        // not detected
        fn();

        await sleep(debounceIntervalMs);

        expect(calls).to.equals(2);
    });

    it('should be able to count a given element parents', () => {
        const div1 = document.createElement('div');

        const div2 = document.createElement('div');

        expect(getElementParentsLength(document.documentElement)).to.equals(0);

        expect(getElementParentsLength(document.body)).to.equals(1);

        div1.prepend(div2);

        document.body.prepend(div1);

        expect(getElementParentsLength(div1)).to.equals(2);

        expect(getElementParentsLength(div2)).to.equals(3);

        div1.remove();

        div2.remove();
    });

    it('should be able to get a given element index in DOM tree', () => {
        const div1 = document.createElement('div');

        const div2 = document.createElement('div');

        const div3 = document.createElement('div');

        expect(getElementIndex(document.documentElement)).to.equals(0);

        // NOTE: there's head before document.body
        expect(getElementIndex(document.body)).to.equals(1);

        document.body.prepend(div3);

        document.body.prepend(div2);

        document.body.prepend(div1);

        expect(getElementIndex(div1)).to.equals(0);

        expect(getElementIndex(div2)).to.equals(1);

        expect(getElementIndex(div3)).to.equals(2);

        div1.remove();

        div2.remove();

        div3.remove();
    });

    it('should be able to join string fragments with hyphens', () => expect(joinHyphen('foo', 'barr', 1234)).to.equals('foo-barr-1234'));
});
