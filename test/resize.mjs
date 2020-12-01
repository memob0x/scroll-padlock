import { eventNamePrefix } from "../src/client.mjs";
import { unlock, lock } from "../src/state.mjs";
import {
    debounceTime,
    addResizeEventListener,
    removeResizeEventListener
} from "../src/resize.mjs";

describe("resize", () => {
    const div = document.createElement('div');

    beforeEach(() => addResizeEventListener(div));

    afterEach(() => removeResizeEventListener(div));

    // TODO: check consistent lock state to be re-applied
    // TODO: test addResizeEventListener and removeResizeEventListener to work properly

    it("should dispatch a custom resize event only at locked state", done => {
        let i = 0;

        div.addEventListener(`${eventNamePrefix}resize`, () => i++);

        // should not be dispatched when unlocked
        unlock(div);

        div.dispatchEvent(new CustomEvent("resize"));

        // should be dispatched when locked
        lock(div);

        div.dispatchEvent(new CustomEvent("resize"));

        // checking results
        setTimeout(() => {
            expect(i).to.equals(1);

            done();
        }, debounceTime);
    });
});
