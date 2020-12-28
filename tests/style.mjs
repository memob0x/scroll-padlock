import {
    html,
    head,
    body,
    
    setCSSRules,
    removeCSSRules,
    getCSSVariableValue,

    getScrollableElement,

    SCROLL_GAP_VALUE_DEFAULT,
    SCROLL_GAP_VALUE_LARGER,
    SCROLL_GAP_CSS_CLASS_NAME_LARGER
} from './_test-utils.mjs';

import { saveScrollPosition } from '../src/scroll.mjs';

import {
    updateCssVariables,
    getScrollbarsGaps,
    cssVarNamePositionTop,
    cssVarNameGapVertical,
    cssClassLocked,
    addLockedCssClass,
    removeLockedCssClass,
    cssClassBase,
    getStyler,
    clearStyle,
    toggleCssClass,
    addBaseCssClass,
    removeBaseCssClass,
    getGlobalScrollerWidth,
    getGlobalScrollerHeight
} from '../src/style.mjs';

describe('style', () => {
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

    it('should write consistent scroll position css variables', () => {
        // 0. ensuring scroll top position is 0, variable should be 0px after updateCssVariables call
        let scrollPosition = 0;
        scroller.scrollTo(0, scrollPosition);

        saveScrollPosition(scroller);
        const styler = updateCssVariables(scroller);

        expect(getCSSVariableValue(scroller, cssVarNamePositionTop)).to.equals(`${scrollPosition}px`);

        // 1. changing scroll position, variable should reflect the new value after updateCssVariables call
        scrollPosition = 120;
        scroller.scrollTo(0, scrollPosition);

        saveScrollPosition(scroller);
        updateCssVariables(scroller);

        expect(getStyler(scroller)).to.equals(styler);

        expect(getCSSVariableValue(scroller, cssVarNamePositionTop)).to.equals(`-${scrollPosition}px`);
        expect(head.contains(styler)).to.be.true;

        expect(clearStyle(scroller)).to.equals(styler);
        
        expect(head.contains(styler)).to.be.false;
        expect(getStyler(scroller)).to.equals(null);
    });

    it('should calculate and write consistent scrollbar gap css variables', () => {
        // 0. should calculate and write current scrollbar gap css variable
        updateCssVariables(scroller);

        expect(getScrollbarsGaps(scroller).vertical).to.equals(SCROLL_GAP_VALUE_DEFAULT);
        expect(getCSSVariableValue(scroller, cssVarNameGapVertical)).to.equals(`${SCROLL_GAP_VALUE_DEFAULT}px`);
    });

    it('should update css variables', () => {
        // 0. should calculate and write current scrollbar gap css variable
        updateCssVariables(scroller);

        expect(getScrollbarsGaps(scroller).vertical).to.equals(SCROLL_GAP_VALUE_DEFAULT);
        expect(getCSSVariableValue(scroller, cssVarNameGapVertical)).to.equals(`${SCROLL_GAP_VALUE_DEFAULT}px`);

        // 1. after a programmatic change to the scrollbar width style, should recalculate and rewrite the css variable accordingly after updateCssVariables call
        scroller.classList.add(SCROLL_GAP_CSS_CLASS_NAME_LARGER);
        updateCssVariables(scroller);

        expect(getScrollbarsGaps(scroller).vertical).to.equals(SCROLL_GAP_VALUE_LARGER);
        expect(getCSSVariableValue(scroller, cssVarNameGapVertical)).to.equals(`${SCROLL_GAP_VALUE_LARGER}px`);

        // cleanup
        scroller.classList.remove(SCROLL_GAP_CSS_CLASS_NAME_LARGER);
    });

    it('should be able to toggle a given css class to a given element', () => {
        const className = 'foo';

        expect(toggleCssClass(scroller, className)).to.be.true;
        expect(scroller.classList.contains(className)).to.be.true;

        expect(toggleCssClass(scroller, className)).to.be.true;
        expect(scroller.classList.contains(className)).to.be.false;

        expect(toggleCssClass(scroller, className, false)).to.be.false;
        
        expect(toggleCssClass(scroller, className, true)).to.be.true;
        expect(toggleCssClass(scroller, className, true)).to.be.false;
        
        expect(toggleCssClass(scroller, className, false)).to.be.true;
        expect(toggleCssClass(scroller, className, false)).to.be.false;
    });

    it('should be able to set or remove the library locked css class to the given element', () => {
        addLockedCssClass(scroller);

        expect(scroller.classList.contains(cssClassLocked)).to.be.true;

        removeLockedCssClass(scroller);

        expect(scroller.classList.contains(cssClassLocked)).to.be.false;
    });

    it('should be able to set or remove the library base css class to the given element', () => {
        addBaseCssClass(scroller);

        expect(scroller.classList.contains(cssClassBase)).to.be.true;

        removeBaseCssClass(scroller);

        expect(scroller.classList.contains(cssClassBase)).to.be.false;
    });

    it('should be able to retrieve elements or body width and height', () => {
        const div = document.createElement('div');

        const size = 100;

        div.style.width = div.style.height = `${size}px`;

        body.append(div);

        expect(getGlobalScrollerWidth(div)).to.equals(size);
        expect(getGlobalScrollerHeight(div)).to.equals(size);

        div.style.transform = 'scale(1.1)';

        expect(getGlobalScrollerWidth(div)).to.be.greaterThan(size);
        expect(getGlobalScrollerHeight(div)).to.be.greaterThan(size);

        div.remove();

        html.style.height = '100%';

        expect(Math.round(getGlobalScrollerWidth(html))).to.equals(Math.round(window.innerWidth));
        expect(Math.round(getGlobalScrollerHeight(html))).to.equals(Math.round(window.innerHeight));

        html.style.height = '';
    });
});
