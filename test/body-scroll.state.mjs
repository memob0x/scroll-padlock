import { preparePlayground, clearPlayground } from "./test.mjs";
import { html, lockedStateCssClass } from "../src/body-scroll.client.mjs";
import { isLocked, lock, unlock } from "../src/body-scroll.state.mjs";

// TODO: test doLock;
// TODO: test doUnlock;

describe("body-scroll.state", () => {
    beforeEach(() => preparePlayground());

    afterEach(() => clearPlayground());

    it('should return the lock status expressed by a boolean with "isLocked" method', (done) => {
        // 0. programmatically setting locked state, isLocked method should return true
        lock();

        expect(isLocked()).to.be.true;

        // 1. programmatically setting unlocked state, isLocked method should return false
        unlock();

        expect(isLocked()).to.be.false;

        // ok
        done();
    });

    it('should give class to html element with "lock" and "unlock" method', (done) => {
        // 0. programmatically setting locked state, css class should be absent
        lock();

        expect(html.classList.contains(lockedStateCssClass)).to.be.true;

        // 1. programmatically setting locked state, css class should be present
        unlock();

        expect(html.classList.contains(lockedStateCssClass)).to.be.false;

        // ok
        done();
    });
});
