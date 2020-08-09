import { eventNamePrefix } from "../src/body-scroll.client.mjs";
import { unlock, lock } from "../src/body-scroll.state.mjs";
import {
    debounceTime,
    addResizeEventListener,
    removeResizeEventListener
} from "../src/body-scroll.resize.mjs";

describe("body-scroll.resize", () => {
    beforeEach(() => addResizeEventListener());
    beforeEach(() => removeResizeEventListener());

    // TODO: check consisten lock state to be re-applied

    it("should dispatch a custom resize event only at locked state", (done) => {
        let i = 0;

        window.addEventListener(`${eventNamePrefix}resize`, () => i++);

        // should not be dispatched when unlocked
        unlock();

        window.dispatchEvent(new CustomEvent("resize"));

        // should be dispatched when locked
        lock();

        window.dispatchEvent(new CustomEvent("resize"));

        // checking results
        setTimeout(() => {
            expect(i).to.equals(1);

            done();
        }, debounceTime);
    });
});
