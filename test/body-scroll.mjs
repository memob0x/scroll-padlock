import bodyScroll from "../src/body-scroll.mjs";
import { eventNamePrefix } from "../src/body-scroll.client.mjs";

describe("body-scroll", () => {
    // removing resize handler at the end of the tests lot in order not to affect other tests
    after(() => bodyScroll.removeResizeEventListener());

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

    it("should have the resize event handler attached to browser resize event listener on library inclusion", (done) => {
        bodyScroll.lock();

        window.addEventListener(`${eventNamePrefix}resize`, () => {
            done();

            bodyScroll.unlock();
        });

        window.dispatchEvent(new CustomEvent("resize"));
    });
});
