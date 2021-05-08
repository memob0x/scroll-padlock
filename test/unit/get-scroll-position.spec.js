import 'jsdom-global/register.js';

import chai from 'chai';

import getScroll from '../../src/get-scroll-position.js';

const { expect } = chai;

describe('get-scroll-position', () => {
    it('should be able to get an element scroll position', () => {
        const div = document.createElement('div');
        
        div.scrollTop = 10;
        div.scrollLeft = 20;

        expect(getScroll(div)).to.deep.equals({ top: 10, left: 20 });
    });

    it('should be able to get the page scroll position', () => {
        // Saves original values
        const { scrollX, scrollY, pageXOffset, pageYOffset } = window;

        // Mocks a modern browser
        let position = { top: 10, left: 20 };
        window.scrollY = position.top;
        window.scrollX = position.left;

        expect(getScroll(window)).to.deep.equals(position);

        // Mocks an old browser
        window.scrollY = window.scrollX = null;

        position = { top: 11, left: 21 };
        window.pageYOffset = position.top;
        window.pageXOffset = position.left;

        expect(getScroll(window)).to.deep.equals(position);

        // Restores original values
        window.scrollY = scrollY;
        window.scrollX = scrollX;
        window.pageYOffset = pageYOffset;
        window.pageXOffset = pageXOffset;
    });
});
