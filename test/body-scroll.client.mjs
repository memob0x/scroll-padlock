import { preparePlayground, clearPlayground } from "./test.mjs";
import {
    html,
    dispatchEvent,
    addLockedCssClass,
    removeLockedCssClass,
    lockedStateCssClass,
    eventNamePrefix
} from "../src/body-scroll.client.mjs";

describe("body-scroll.client", () => {
    beforeEach(() => preparePlayground());

    afterEach(() => clearPlayground());

    it("should be able to dispatch a prefixed event name", (done) => {
        const eventName = "foobarrrr";

        window.addEventListener(`${eventNamePrefix}${eventName}`, () => done());

        dispatchEvent(eventName);
    });

    it("should be able to toggle a css class to html element", (done) => {
        addLockedCssClass();

        expect(html.classList.contains(lockedStateCssClass)).to.be.true;

        removeLockedCssClass();

        expect(html.classList.contains(lockedStateCssClass)).to.be.false;

        done();
    });
});
