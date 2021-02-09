import 'jsdom-global/register.js';

import chai from 'chai';

import getElementParentsLength from '../../src/get-element-parents-length.mjs';

const { expect } = chai;

describe('get-element-parents-length', () => {
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
});
