import { preparePlayground, clearPlayground } from "./test.mjs";
import {
    saveScrollPosition,
    getSavedScrollPosition,
    restoreScrollPosition,
    isValidScrollPosition,
    formatScrollPosition,
    clearSavedScrollPosition
} from "../src/body-scroll.scroll.mjs";

describe("body-scroll.scroll", () => {
    beforeEach(() => preparePlayground());

    afterEach(() => clearPlayground());

    it("should save and restore body scroll position", (done) => {
        // 0. setting a scroll position and saving it
        const scrollPosition = 120;
        window.scrollTo(0, scrollPosition);

        saveScrollPosition();

        expect(window.pageYOffset).to.equals(scrollPosition);
        expect(window.pageYOffset).to.equals(getSavedScrollPosition().top);

        // 1. changing scroll position
        window.scrollTo(0, 9999);

        expect(window.pageYOffset).to.greaterThan(scrollPosition);

        // 2. restoring previously saved scroll position
        restoreScrollPosition();

        expect(window.pageYOffset).to.equals(scrollPosition);

        // ok
        done();
    });

    it("should be able to clear scroll position saving", (done) => {
        // 0. setting a scroll position and saving it
        window.scrollTo(0, 120);

        saveScrollPosition();

        expect(window.pageYOffset).to.equals(getSavedScrollPosition().top);

        // 1. clearing scroll position saving
        clearSavedScrollPosition();

        expect(getSavedScrollPosition()).to.be.null;

        // ok
        done();
    });

    it("should be able to recognize valid or invalid scroll position objects", (done) => {
        // invalid
        expect(isValidScrollPosition("foo")).to.be.false;
        expect(isValidScrollPosition("")).to.be.false;
        expect(isValidScrollPosition({})).to.be.false;
        expect(isValidScrollPosition(NaN)).to.be.false;
        expect(isValidScrollPosition(null)).to.be.false;
        expect(isValidScrollPosition(true)).to.be.false;
        expect(isValidScrollPosition(Infinity)).to.be.false;
        expect(isValidScrollPosition(undefined)).to.be.false;
        expect(isValidScrollPosition({ top: 0 })).to.be.false;
        expect(isValidScrollPosition({ left: 0 })).to.be.false;
        expect(isValidScrollPosition({ top: Infinity, left: Infinity })).to.be
            .false;
        expect(isValidScrollPosition({ top: NaN, left: NaN })).to.be.false;

        // valid
        expect(isValidScrollPosition({ top: 0, left: 0 })).to.be.true;

        // ok
        done();
    });

    it("should be able to convert invalid scroll position object into null through formatter function", (done) => {
        // invalid
        expect(formatScrollPosition("foo")).to.be.null;
        expect(formatScrollPosition("")).to.be.null;
        expect(formatScrollPosition({})).to.be.null;
        expect(formatScrollPosition(NaN)).to.be.null;
        expect(formatScrollPosition(null)).to.be.null;
        expect(formatScrollPosition(true)).to.be.null;
        expect(formatScrollPosition(Infinity)).to.be.null;
        expect(formatScrollPosition(undefined)).to.be.null;
        expect(formatScrollPosition({ top: 0 })).to.be.null;
        expect(formatScrollPosition({ left: 0 })).to.be.null;
        expect(formatScrollPosition({ top: Infinity, left: Infinity })).to.be
            .null;
        expect(formatScrollPosition({ top: NaN, left: NaN })).to.be.null;

        // valid
        const validScrollPosition = { top: 0, left: 0 };
        expect(
            JSON.stringify(formatScrollPosition(validScrollPosition))
        ).to.equals(JSON.stringify(validScrollPosition));

        // ok
        done();
    });
});
