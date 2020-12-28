import {
    html,
    body,

    setCSSRules,
    removeCSSRules,

    getScrollExpanderElement,

    getScrollableElement
} from './_test-utils.mjs';

import {
    getScrollPosition,
    saveScrollPosition,
    getSavedScrollPosition,
    restoreScrollPosition,
    isValidScrollPosition,
    formatScrollPosition,
    clearSavedScrollPosition,

    getGlobalScrollPosition,
    getElementScrollPosition,
    scrollTo,
    getScroller
} from '../src/scroll.mjs';

describe('scroll', () => {
    let scroller;

    before(() => setCSSRules());

    after(() => removeCSSRules());

    beforeEach(() => {
        scroller = getScrollableElement();

        body.append(scroller);
    });

    afterEach(() => {
        scroller.remove();

        scroller = null;
    });
    
    it('should retrieve, save and restore element scroll position', () => {
        // 0. setting a scroll position and saving it
        const scrollPosition = 120;
        scroller.scrollTo(0, scrollPosition);
        
        expect(scroller.scrollTop).to.equals(getScrollPosition(scroller).top);

        saveScrollPosition(scroller);

        expect(scroller.scrollTop).to.equals(scrollPosition);
        expect(scroller.scrollTop).to.equals(getSavedScrollPosition(scroller).top);

        // 1. changing scroll position
        scroller.scrollTo(0, 9999);

        expect(scroller.scrollTop).to.greaterThan(scrollPosition);

        // 2. restoring previously saved scroll position
        restoreScrollPosition(scroller);

        expect(scroller.scrollTop).to.equals(scrollPosition);
        
        expect(scroller.scrollTop).to.equals(getScrollPosition(scroller).top);
    });
    
    it('should retrieve, save and restore body scroll position', () => {
        const expander = getScrollExpanderElement();

        body.append(expander);

        // 0. setting a scroll position and saving it
        const scrollPosition = 120;
        window.scrollTo(0, scrollPosition);
        
        expect(window.pageYOffset).to.equals(getScrollPosition(html).top);

        saveScrollPosition(html);

        expect(window.pageYOffset).to.equals(scrollPosition);
        expect(window.pageYOffset).to.equals(getSavedScrollPosition(html).top);

        // 1. changing scroll position
        window.scrollTo(0, 9999);

        expect(window.pageYOffset).to.greaterThan(scrollPosition);

        // 2. restoring previously saved scroll position
        restoreScrollPosition(html);

        expect(window.pageYOffset).to.equals(scrollPosition);
        
        expect(window.pageYOffset).to.equals(getScrollPosition(html).top);

        expander.remove();
    });

    it('should be able to clear scroll position saving', () => {
        // 0. setting a scroll position and saving it
        scroller.scrollTo(0, 120);

        saveScrollPosition(scroller);

        expect(scroller.scrollTop).to.equals(getSavedScrollPosition(scroller).top);

        // 1. clearing scroll position saving
        clearSavedScrollPosition(scroller);

        expect(getSavedScrollPosition(scroller)).to.be.null;
    });

    it('should be able to recognize valid or invalid scroll position objects', () => {
        // invalid
        expect(isValidScrollPosition('foo')).to.be.false;
        expect(isValidScrollPosition('')).to.be.false;
        expect(isValidScrollPosition({})).to.be.false;
        expect(isValidScrollPosition(NaN)).to.be.false;
        expect(isValidScrollPosition(null)).to.be.false;
        expect(isValidScrollPosition(true)).to.be.false;
        expect(isValidScrollPosition(Infinity)).to.be.false;
        expect(isValidScrollPosition(undefined)).to.be.false;
        expect(isValidScrollPosition({ top: 0 })).to.be.false;
        expect(isValidScrollPosition({ left: 0 })).to.be.false;
        expect(isValidScrollPosition({ top: Infinity, left: Infinity })).to.be.false;
        expect(isValidScrollPosition({ top: NaN, left: NaN })).to.be.false;

        // valid
        expect(isValidScrollPosition({ top: 0, left: 0 })).to.be.true;
    });

    it('should be able to convert invalid scroll position object into null through formatter function', () => {
        // invalid
        expect(formatScrollPosition('foo')).to.be.null;
        expect(formatScrollPosition('')).to.be.null;
        expect(formatScrollPosition({})).to.be.null;
        expect(formatScrollPosition(NaN)).to.be.null;
        expect(formatScrollPosition(null)).to.be.null;
        expect(formatScrollPosition(true)).to.be.null;
        expect(formatScrollPosition(Infinity)).to.be.null;
        expect(formatScrollPosition(undefined)).to.be.null;
        expect(formatScrollPosition({ top: 0 })).to.be.null;
        expect(formatScrollPosition({ left: 0 })).to.be.null;
        expect(formatScrollPosition({ top: Infinity, left: Infinity })).to.be.null;
        expect(formatScrollPosition({ top: NaN, left: NaN })).to.be.null;

        // valid
        const validScrollPosition = { top: 0, left: 0 };
        expect(JSON.stringify(formatScrollPosition(validScrollPosition))).to.equals(JSON.stringify(validScrollPosition));
    });

    it('should be able to get global scroll position', () => {
        const expander = getScrollExpanderElement();

        body.append(expander);

        window.scrollTo(0, 0);

        expect(getGlobalScrollPosition().top).to.equals(window.pageYOffset);
        expect(getGlobalScrollPosition().left).to.equals(window.pageXOffset);
        expect(getGlobalScrollPosition().top).to.equals(0);
        expect(getGlobalScrollPosition().left).to.equals(0);

        const position = {
            top: 1234,
            left: 4567
        };

        window.scrollTo(position.left, position.top);
        
        expect(getGlobalScrollPosition().top).to.equals(window.pageYOffset);
        expect(getGlobalScrollPosition().left).to.equals(window.pageXOffset);
        expect(getGlobalScrollPosition().top).to.equals(position.top);
        expect(getGlobalScrollPosition().left).to.equals(position.left);

        expect(JSON.stringify(getScrollPosition(html))).to.equals(JSON.stringify(getGlobalScrollPosition()));
        expect(JSON.stringify(getScrollPosition(body))).to.equals(JSON.stringify(getGlobalScrollPosition()));
        expect(JSON.stringify(getScrollPosition(scroller))).to.not.equals(JSON.stringify(getGlobalScrollPosition()));

        expander.remove();
    });

    it('should be able to get an element scroll position', () => {
        scroller.scrollTo(0, 0);

        expect(getElementScrollPosition().top).to.equals(scroller.scrollTop);
        expect(getElementScrollPosition().left).to.equals(scroller.scrollLeft);
        expect(getElementScrollPosition().top).to.equals(0);
        expect(getElementScrollPosition().left).to.equals(0);

        const position = {
            top: 1234,
            left: 4567
        };

        scroller.scrollTo(position.left, position.top);
        
        expect(getElementScrollPosition(scroller).top).to.equals(scroller.scrollTop);
        expect(getElementScrollPosition(scroller).left).to.equals(scroller.scrollLeft);
        expect(getElementScrollPosition(scroller).top).to.equals(position.top);
        expect(getElementScrollPosition(scroller).left).to.equals(position.left);

        expect(JSON.stringify(getScrollPosition(html))).to.not.equals(JSON.stringify(getElementScrollPosition(scroller)));
        expect(JSON.stringify(getScrollPosition(body))).to.not.equals(JSON.stringify(getElementScrollPosition(scroller)));
        expect(JSON.stringify(getScrollPosition(scroller))).to.equals(JSON.stringify(getElementScrollPosition(scroller)));
    });

    it('should be able to scroll elements', () => {
        expect(scroller.scrollTop).to.equals(0);
        expect(scroller.scrollLeft).to.equals(0);

        const position = {
            top: 1234,
            left: 4567
        };

        scrollTo(scroller, position);

        expect(scroller.scrollTop).to.equals(position.top);
        expect(scroller.scrollLeft).to.equals(position.left);
    });
    
    it('should be able to scroll body', () => {
        const expander = getScrollExpanderElement();

        body.append(expander);

        expect(window.pageYOffset).to.equals(0);
        expect(window.pageXOffset).to.equals(0);

        const position = {
            top: 1234,
            left: 4567
        };

        scrollTo(body, position);

        expect(window.pageYOffset).to.equals(position.top);
        expect(window.pageXOffset).to.equals(position.left);

        expander.remove();
    });

    it('should be able to retrieve the element which can perform "scrollTo"', () => {
        expect(getScroller(html)).to.equals(window);
        expect(getScroller(body)).to.equals(window);

        const div = document.createElement('div');
        expect(getScroller(div)).to.equals(div);
    });
});
