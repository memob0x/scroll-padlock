import {
    preparePlayground,
    clearPlayground,
    scrollGapDefaultValue,
    scrollGapLargerValue,
    scrollGapLargerCssClassName
} from "./index.mjs";

import { html } from "../src/client.mjs";

import { saveScrollPosition } from "../src/scroll.mjs";

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
    removeBaseCssClass
} from "../src/style.mjs";

const getCssVariableValue = (element, variableName) => window.getComputedStyle(element).getPropertyValue(variableName).trim();

// TODO: move tests target from html to a custom div

describe("style", () => {
    beforeEach(() => preparePlayground());

    afterEach(() => clearPlayground());

    it("should write consistent scroll position css variables", () => {
        // 0. ensuring scroll top position is 0, variable should be 0px after updateCssVariables call
        let scrollPosition = 0;
        window.scrollTo(0, scrollPosition);

        saveScrollPosition(html);
        const styler = updateCssVariables(html);

        expect(getCssVariableValue(html, cssVarNamePositionTop)).to.equals(`${scrollPosition}px`);

        // 1. changing scroll position, variable should reflect the new value after updateCssVariables call
        scrollPosition = 120;
        window.scrollTo(0, scrollPosition);

        saveScrollPosition(html);
        updateCssVariables(html);

        expect(getStyler(html)).to.equals(styler);

        expect(getCssVariableValue(html, cssVarNamePositionTop)).to.equals(`-${scrollPosition}px`);
        expect(document.head.contains(styler)).to.be.true;

        expect(clearStyle(html)).to.equals(styler);
        
        expect(document.head.contains(styler)).to.be.false;
        expect(getStyler(html)).to.equals(null);
    });

    it("should calculate and write consistent scrollbar gap css variables", () => {
        // 0. should calculate and write current scrollbar gap css variable
        updateCssVariables(html);

        expect(getScrollbarsGaps(html).vertical).to.equals(scrollGapDefaultValue);
        expect(getCssVariableValue(html, cssVarNameGapVertical)).to.equals(`${scrollGapDefaultValue}px`);
    });

    it("should update css variables", () => {
        // 0. should calculate and write current scrollbar gap css variable
        updateCssVariables(html);

        expect(getScrollbarsGaps(html).vertical).to.equals(scrollGapDefaultValue);
        expect(getCssVariableValue(html, cssVarNameGapVertical)).to.equals(`${scrollGapDefaultValue}px`);

        // 1. after a programmatic change to the scrollbar width style, should recalculate and rewrite the css variable accordingly after updateCssVariables call
        html.classList.add(scrollGapLargerCssClassName);
        updateCssVariables(html);

        expect(getScrollbarsGaps(html).vertical).to.equals(scrollGapLargerValue);
        expect(getCssVariableValue(html, cssVarNameGapVertical)).to.equals(`${scrollGapLargerValue}px`);

        // cleanup
        html.classList.remove(scrollGapLargerCssClassName);
    });

    it('should be able to toggle a given css class to a given element', () => {
        const div = document.createElement('div');
        const className = 'foo';

        expect(toggleCssClass(div, className)).to.be.true;
        expect(div.classList.contains(className)).to.be.true;

        expect(toggleCssClass(div, className)).to.be.true;
        expect(div.classList.contains(className)).to.be.false;

        expect(toggleCssClass(div, className, false)).to.be.false;
        
        expect(toggleCssClass(div, className, true)).to.be.true;
        expect(toggleCssClass(div, className, true)).to.be.false;
        
        expect(toggleCssClass(div, className, false)).to.be.true;
        expect(toggleCssClass(div, className, false)).to.be.false;
    });

    it("should be able to set or remove the library locked css class to the given element", () => {
        const div = document.createElement('div');

        addLockedCssClass(div);

        expect(div.classList.contains(cssClassLocked)).to.be.true;

        removeLockedCssClass(div);

        expect(div.classList.contains(cssClassLocked)).to.be.false;
    });

    it("should be able to set or remove the library base css class to the given element", () => {
        const div = document.createElement('div');

        addBaseCssClass(div);

        expect(div.classList.contains(cssClassBase)).to.be.true;

        removeBaseCssClass(div);

        expect(div.classList.contains(cssClassBase)).to.be.false;
    });
});
