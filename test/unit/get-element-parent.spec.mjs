import 'jsdom-global/register.js';

import chai from 'chai';

import getElementParent from '../../src/get-element-parent.mjs';

const { expect } = chai;

describe('get-element-parent', () => {
    it('should be able to get a given element first ancestor', () => {
        expect(getElementParent(null)).to.equals(null);
        expect(getElementParent({})).to.equals(null);

        const holder = document.createElement('div');

        const div1 = document.createElement('div');

        const div2 = document.createElement('div');

        expect(getElementParent(document.documentElement)).to.equals(null);

        expect(getElementParent(document.body)).to.equals(document.documentElement);

        expect(getElementParent(holder)).to.equals(null);

        div1.prepend(div2);

        holder.prepend(div1);

        expect(getElementParent(div1)).to.equals(holder);

        expect(getElementParent(div2)).to.equals(div1);
    });
});
