import 'jsdom-global/register.js';

import chai from 'chai';

import getElementIndex from '../../src/get-element-index.mjs';

const { expect } = chai;

describe('get-element-index', () => {
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
});
