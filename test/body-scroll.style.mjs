import {
    preparePlayground,
    clearPlayground,
    SCROLL_GAP_LARGER,
    CSS_VAR_NAME_POSITION,
    CSS_VAR_NAME_GAP,
    CSS_CLASS_GAP_LARGER,
    SCROLL_GAP_DEFAULT,
    getCssVariableValue
} from "./test.mjs";
import { html } from "../src/body-scroll.client.mjs";
import { saveScrollPosition } from "../src/body-scroll.scroll.mjs";
import {
    updateCssVariables,
    getVerticalScrollbarGap
} from "../src/body-scroll.style.mjs";

describe("body-scroll.style", () => {
    beforeEach(() => preparePlayground());

    afterEach(() => clearPlayground());

    it("should write consistent scroll position css variables", (done) => {
        // 0. ensuring scroll top position is 0, variable should be 0px after updateCssVariables call
        let scrollPosition = 0;
        window.scrollTo(0, scrollPosition);

        saveScrollPosition();
        updateCssVariables();

        expect(getCssVariableValue(CSS_VAR_NAME_POSITION)).to.equals(
            `${scrollPosition}px`
        );

        // 1. changing scroll position, variable should reflect the new value after updateCssVariables call
        scrollPosition = 120;
        window.scrollTo(0, scrollPosition);

        saveScrollPosition();
        updateCssVariables();

        expect(getCssVariableValue(CSS_VAR_NAME_POSITION)).to.equals(
            `-${scrollPosition}px`
        );

        done();
    });

    it("should calculate and write consistent scrollbar gap css variables", (done) => {
        // 0. should calculate and write current scrollbar gap css variable
        updateCssVariables();

        expect(getVerticalScrollbarGap()).to.equals(SCROLL_GAP_DEFAULT);
        expect(getCssVariableValue(CSS_VAR_NAME_GAP)).to.equals(
            `${SCROLL_GAP_DEFAULT}px`
        );

        // ok
        done();
    });

    it("should update css variables", (done) => {
        // 0. should calculate and write current scrollbar gap css variable
        updateCssVariables();

        expect(getVerticalScrollbarGap()).to.equals(SCROLL_GAP_DEFAULT);
        expect(getCssVariableValue(CSS_VAR_NAME_GAP)).to.equals(
            `${SCROLL_GAP_DEFAULT}px`
        );

        // 1. after a programmatic change to the scrollbar width style, should recalculate and rewrite the css variable accordingly after updateCssVariables call
        html.classList.add(CSS_CLASS_GAP_LARGER);
        updateCssVariables();

        expect(getCssVariableValue(CSS_VAR_NAME_GAP)).to.equals(
            `${SCROLL_GAP_LARGER}px`
        );
        expect(getVerticalScrollbarGap()).to.equals(SCROLL_GAP_LARGER);

        // cleanup
        html.classList.remove(CSS_CLASS_GAP_LARGER);

        // ok
        done();
    });
});
