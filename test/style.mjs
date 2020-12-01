import { html } from "../src/client.mjs";
import {
    preparePlayground,
    clearPlayground,
    scrollGapDefaultValue,
    scrollGapLargerValue,
    scrollGapLargerCssClassName
} from "./index.mjs";
import { saveScrollPosition } from "../src/scroll.mjs";
import {
    updateCssVariables,
    getScrollbarsGaps,
    cssVarNamePositionTop,
    cssVarNameGapVertical,
    cssClassLocked,
    addLockedCssClass,
    removeLockedCssClass
} from "../src/style.mjs";

/**
 *
 * @param {String} variableName
 * @returns {String}
 */
const getCssVariableValue = (element, variableName) =>
    window.getComputedStyle(element).getPropertyValue(variableName).trim();

describe("style", () => {
    beforeEach(() => preparePlayground());

    afterEach(() => clearPlayground());

    it("should write consistent scroll position css variables", () => {
        // 0. ensuring scroll top position is 0, variable should be 0px after updateCssVariables call
        let scrollPosition = 0;
        window.scrollTo(0, scrollPosition);

        saveScrollPosition(html);
        updateCssVariables(html);

        expect(getCssVariableValue(html, cssVarNamePositionTop)).to.equals(
            `${scrollPosition}px`
        );

        // 1. changing scroll position, variable should reflect the new value after updateCssVariables call
        scrollPosition = 120;
        window.scrollTo(0, scrollPosition);

        saveScrollPosition(html);
        updateCssVariables(html);

        expect(getCssVariableValue(html, cssVarNamePositionTop)).to.equals(
            `-${scrollPosition}px`
        );
    });

    it("should calculate and write consistent scrollbar gap css variables", () => {
        // 0. should calculate and write current scrollbar gap css variable
        updateCssVariables(html);

        expect(getScrollbarsGaps(html).vertical).to.equals(scrollGapDefaultValue);
        expect(getCssVariableValue(html, cssVarNameGapVertical)).to.equals(
            `${scrollGapDefaultValue}px`
        );
    });

    it("should update css variables", () => {
        // 0. should calculate and write current scrollbar gap css variable
        updateCssVariables(html);

        expect(getScrollbarsGaps(html).vertical).to.equals(scrollGapDefaultValue);
        expect(getCssVariableValue(html, cssVarNameGapVertical)).to.equals(
            `${scrollGapDefaultValue}px`
        );

        // 1. after a programmatic change to the scrollbar width style, should recalculate and rewrite the css variable accordingly after updateCssVariables call
        html.classList.add(scrollGapLargerCssClassName);
        updateCssVariables(html);

        expect(getScrollbarsGaps(html).vertical).to.equals(scrollGapLargerValue);
        expect(getCssVariableValue(html, cssVarNameGapVertical)).to.equals(
            `${scrollGapLargerValue}px`
        );

        // cleanup
        html.classList.remove(scrollGapLargerCssClassName);
    });

    it("should be able to toggle a css class to element", () => {
        addLockedCssClass(html);

        expect(html.classList.contains(cssClassLocked)).to.be.true;

        removeLockedCssClass(html);

        expect(html.classList.contains(cssClassLocked)).to.be.false;
    });
});
