import bodyScroll from "../src/body-scroll.mjs";

// component.bodyScroll consts
const CSS_VAR_NAME_POSITION = "--body-scroll-lock-top-rect";
const CSS_VAR_NAME_GAP = "--body-scroll-lock-vertical-scrollbar-gap";
const LOCKED_STATE_CLASS = "body-scroll-lock";

// test consts
const SCROLL_GAP_DEFAULT = 20;
const SCROLL_GAP_LARGER = 60;
const CSS_CLASS_GAP_LARGER = "scrollbar-wider";

// caching test involved elements
const head = document.head;
const body = document.body;
const html = document.documentElement;
const styler = document.createElement("style");
const expander = document.createElement("div");

// utility function to retrieve a css variable value (maybe can be component._utils)
const getCssVariableValue = (variableName) =>
    window.getComputedStyle(html).getPropertyValue(variableName).trim();

describe("API", () => {
    before(() => {
        head.append(styler);

        // styler.sheet.insertRule( // FIXME: y throws?
        styler.innerHTML = `html::-webkit-scrollbar { width: ${SCROLL_GAP_DEFAULT}px; }
            html.${CSS_CLASS_GAP_LARGER}::-webkit-scrollbar { width: ${SCROLL_GAP_LARGER}px; }`;

        expander.style.height = "9999px";
    });

    it('should return the lock status expressed by a boolean with "isLocked" method', (done) => {
        // 0. programmatically setting locked state, isLocked method should return true
        bodyScroll.lock();

        expect(bodyScroll.isLocked()).to.be.true;

        // 1. programmatically setting unlocked state, isLocked method should return false
        bodyScroll.unlock();

        expect(bodyScroll.isLocked()).to.be.false;

        // ok
        done();
    });

    it('should give class to html element with "lock" and "unlock" method', (done) => {
        // 0. programmatically setting locked state, css class should be absent
        bodyScroll.lock();

        expect(html.classList.contains(LOCKED_STATE_CLASS)).to.be.true;

        // 1. programmatically setting locked state, css class should be present
        bodyScroll.unlock();

        expect(html.classList.contains(LOCKED_STATE_CLASS)).to.be.false;

        // ok
        done();
    });

    it("should save and restore body scroll position", (done) => {
        // preparation
        head.append(styler);
        body.append(expander);

        // 0. setting a scroll position and saving it
        const scrollPosition = 120;
        window.scrollTo(0, scrollPosition);

        bodyScroll.saveScrollPosition();

        expect(window.pageYOffset).to.equals(scrollPosition);
        expect(window.pageYOffset).to.equals(
            bodyScroll.getSavedScrollPosition().top
        );

        // 1. changing scroll position
        window.scrollTo(0, 9999);

        expect(window.pageYOffset).to.greaterThan(scrollPosition);

        // 2. restoring previously saved scroll position
        bodyScroll.restoreScrollPosition();

        expect(window.pageYOffset).to.equals(scrollPosition);

        // cleanup
        expander.remove();
        styler.remove();
        done();
    });

    it("should write consistent scroll position css variables", (done) => {
        // preparation
        head.append(styler);
        body.append(expander);

        // 0. ensuring scroll top position is 0, variable should be 0px after updateCssVariables call
        let scrollPosition = 0;
        window.scrollTo(0, scrollPosition);

        bodyScroll.saveScrollPosition();
        bodyScroll.updateCssVariables();

        expect(getCssVariableValue(CSS_VAR_NAME_POSITION)).to.equals(
            scrollPosition + "px"
        );

        // 1. changing scroll position, variable should reflect the new value after updateCssVariables call
        scrollPosition = 120;
        window.scrollTo(0, scrollPosition);

        bodyScroll.saveScrollPosition();
        bodyScroll.updateCssVariables();

        expect(getCssVariableValue(CSS_VAR_NAME_POSITION)).to.equals(
            "-" + scrollPosition + "px"
        );

        // cleanup
        expander.remove();
        styler.remove();
        done();
    });

    it("should calculate and write consistent scrollbar gap css variables", (done) => {
        // preparation
        head.append(styler);
        body.append(expander);

        // 0. should calculate and write current scrollbar gap css variable
        bodyScroll.updateCssVariables();

        expect(bodyScroll.getVerticalScrollbarGap()).to.equals(
            SCROLL_GAP_DEFAULT
        );
        expect(getCssVariableValue(CSS_VAR_NAME_GAP)).to.equals(
            SCROLL_GAP_DEFAULT + "px"
        );

        // cleanup
        expander.remove();
        styler.remove();
        done();
    });

    it("should update css variables", (done) => {
        // preparation
        head.append(styler);
        body.append(expander);

        // 0. should calculate and write current scrollbar gap css variable
        bodyScroll.updateCssVariables();

        expect(bodyScroll.getVerticalScrollbarGap()).to.equals(
            SCROLL_GAP_DEFAULT
        );
        expect(getCssVariableValue(CSS_VAR_NAME_GAP)).to.equals(
            SCROLL_GAP_DEFAULT + "px"
        );

        // 1. after a programmatic change to the scrollbar width style, should recalculate and rewrite the css variable accordingly after updateCssVariables call
        html.classList.add(CSS_CLASS_GAP_LARGER);
        bodyScroll.updateCssVariables();

        expect(getCssVariableValue(CSS_VAR_NAME_GAP)).to.equals(
            SCROLL_GAP_LARGER + "px"
        );
        expect(bodyScroll.getVerticalScrollbarGap()).to.equals(
            SCROLL_GAP_LARGER
        );

        // cleanup
        html.classList.remove(CSS_CLASS_GAP_LARGER);
        expander.remove();
        styler.remove();
        done();
    });
});
