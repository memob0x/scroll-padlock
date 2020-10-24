import { preparePlayground, clearPlayground } from "./test.mjs";
import { html } from "../src/body-scroll.client.mjs";
import { lockedStateCssClass } from "../src/body-scroll.style.mjs";
import { isLocked, lock, unlock } from "../src/body-scroll.state.mjs";

// TODO: test doLock;
// TODO: test doUnlock;

describe("body-scroll.state", () => {
    beforeEach(() => preparePlayground());

    afterEach(() => clearPlayground());

    it('should return the lock status expressed by a boolean with "isLocked" method', () => {
        // 0. programmatically setting locked state, isLocked method should return true
        lock(html);

        expect(isLocked(html)).to.be.true;

        // 1. programmatically setting unlocked state, isLocked method should return false
        unlock(html);

        expect(isLocked(html)).to.be.false;
    });

    it('should give class to html element with "lock" and "unlock" method', () => {
        // 0. programmatically setting locked state, css class should be absent
        lock(html);

        expect(html.classList.contains(lockedStateCssClass)).to.be.true;

        // 1. programmatically setting locked state, css class should be present
        unlock(html);

        expect(html.classList.contains(lockedStateCssClass)).to.be.false;
    });
});
