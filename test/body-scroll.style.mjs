import {
    preparePlayground,
    clearPlayground,
    scrollGapDefaultValue,
    scrollGapLargerValue,
    scrollGapLargerCssClassName
} from "./test.mjs";
import { html } from "../src/body-scroll.client.mjs";
import { saveScrollPosition } from "../src/body-scroll.scroll.mjs";
import {
    updateCssVariables,
    getVerticalScrollbarGap,
    cssVarNamePosition,
    cssVarNameGap
} from "../src/body-scroll.style.mjs";

/**
 *
 * @param {String} variableName
 * @returns {String}
 */
const getCssVariableValue = (variableName) =>
    window.getComputedStyle(html).getPropertyValue(variableName).trim();

describe("body-scroll.style", () => {
    beforeEach(() => preparePlayground());

    afterEach(() => clearPlayground());

    it("should write consistent scroll position css variables", (done) => {
        // 0. ensuring scroll top position is 0, variable should be 0px after updateCssVariables call
        let scrollPosition = 0;
        window.scrollTo(0, scrollPosition);

        saveScrollPosition();
        updateCssVariables();

        expect(getCssVariableValue(cssVarNamePosition)).to.equals(
            `${scrollPosition}px`
        );

        // 1. changing scroll position, variable should reflect the new value after updateCssVariables call
        scrollPosition = 120;
        window.scrollTo(0, scrollPosition);

        saveScrollPosition();
        updateCssVariables();

        expect(getCssVariableValue(cssVarNamePosition)).to.equals(
            `-${scrollPosition}px`
        );

        done();
    });

    it("should calculate and write consistent scrollbar gap css variables", (done) => {
        // 0. should calculate and write current scrollbar gap css variable
        updateCssVariables();

        expect(getVerticalScrollbarGap()).to.equals(scrollGapDefaultValue);
        expect(getCssVariableValue(cssVarNameGap)).to.equals(
            `${scrollGapDefaultValue}px`
        );

        // ok
        done();
    });

    it("should update css variables", (done) => {
        // 0. should calculate and write current scrollbar gap css variable
        updateCssVariables();

        expect(getVerticalScrollbarGap()).to.equals(scrollGapDefaultValue);
        expect(getCssVariableValue(cssVarNameGap)).to.equals(
            `${scrollGapDefaultValue}px`
        );

        // 1. after a programmatic change to the scrollbar width style, should recalculate and rewrite the css variable accordingly after updateCssVariables call
        html.classList.add(scrollGapLargerCssClassName);
        updateCssVariables();

        expect(getCssVariableValue(cssVarNameGap)).to.equals(
            `${scrollGapLargerValue}px`
        );
        expect(getVerticalScrollbarGap()).to.equals(scrollGapLargerValue);

        // cleanup
        html.classList.remove(scrollGapLargerCssClassName);

        // ok
        done();
    });
});
