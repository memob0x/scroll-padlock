import { preparePlayground, clearPlayground } from "./test.mjs";
import bodyScroll from "../src/body-scroll.mjs";

// TODO: test resize (maybe through spy?)

describe("body-scroll", () => {
    beforeEach(() => preparePlayground());

    afterEach(() => clearPlayground());

    it("should expose all valuable methods in API", () => {
        expect(Object.keys(bodyScroll).length).to.equals(8);

        expect(bodyScroll).to.respondTo("lock");
        expect(bodyScroll).to.respondTo("unlock");
        expect(bodyScroll).to.respondTo("isLocked");

        expect(bodyScroll).to.respondTo("updateCssVariables");
        expect(bodyScroll).to.respondTo("getVerticalScrollbarGap");
        expect(bodyScroll).to.respondTo("restoreScrollPosition");
        expect(bodyScroll).to.respondTo("saveScrollPosition");
        expect(bodyScroll).to.respondTo("getSavedScrollPosition");
    });
});
