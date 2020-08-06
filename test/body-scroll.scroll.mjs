import { preparePlayground, clearPlayground } from "./test.mjs";
import {
    saveScrollPosition,
    getSavedScrollPosition,
    restoreScrollPosition
} from "../src/body-scroll.scroll.mjs";

// TODO: test isValidScrollPosition;
// TODO: test formatScrollPosition;
// TODO: test clearSavedScrollPosition;

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
});
