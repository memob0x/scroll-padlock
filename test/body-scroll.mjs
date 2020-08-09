import bodyScroll from "../src/body-scroll.mjs";

describe("body-scroll", () => {
    // removing resize handler, just in case, in order not to affect other tests
    after(() => bodyScroll.removeResizeEventListener());

    // TODO: should have resize event listener automatically added at this point

    it("should expose all valuable methods in API", () => {
        expect(Object.keys(bodyScroll).length).to.equals(10);

        expect(bodyScroll).to.respondTo("lock");
        expect(bodyScroll).to.respondTo("unlock");
        expect(bodyScroll).to.respondTo("isLocked");

        expect(bodyScroll).to.respondTo("updateCssVariables");
        expect(bodyScroll).to.respondTo("getVerticalScrollbarGap");
        expect(bodyScroll).to.respondTo("restoreScrollPosition");
        expect(bodyScroll).to.respondTo("saveScrollPosition");
        expect(bodyScroll).to.respondTo("getSavedScrollPosition");
        expect(bodyScroll).to.respondTo("addResizeEventListener");
        expect(bodyScroll).to.respondTo("removeResizeEventListener");
    });
});
