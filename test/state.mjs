import { preparePlayground, clearPlayground } from "./index.mjs";

import { eventNamePrefix } from "../src/client.mjs";

import { cssClassLocked } from "../src/style.mjs";

import { isLocked, doLock, doUnlock, lock, unlock } from "../src/state.mjs";

describe("state", () => {
    beforeEach(() => preparePlayground());

    afterEach(() => clearPlayground());

    it('should return the lock status expressed by a boolean with "isLocked" function', () => {
        const div = document.createElement('div');

        // -1. default case, (presumably) not initialized yet
        expect(isLocked(div)).to.be.false;
        expect(doUnlock(div)).to.be.false;

        // 0. programmatically setting locked state, isLocked method should return true
        expect(doLock(div)).to.be.true;
        expect(doLock(div)).to.be.false;

        expect(isLocked(div)).to.be.true;

        // 1. programmatically setting unlocked state, isLocked method should return false
        expect(doUnlock(div)).to.be.true;
        expect(doUnlock(div)).to.be.false;

        expect(isLocked(div)).to.be.false;
    });

    it('should give a css class to the given element with "lock" and "unlock" functions', () => {
        const div = document.createElement('div');
        
        // -1. default case, (presumably) not initialized yet
        expect(isLocked(div)).to.be.false;
        expect(doUnlock(div)).to.be.false;

        expect(div.classList.contains(cssClassLocked)).to.be.false;

        // 0. programmatically setting locked state, css class should be absent
        expect(doLock(div)).to.be.true;
        expect(doLock(div)).to.be.false;

        expect(div.classList.contains(cssClassLocked)).to.be.true;

        // 1. programmatically setting locked state, css class should be present
        expect(doUnlock(div)).to.be.true;
        expect(doUnlock(div)).to.be.false;

        expect(div.classList.contains(cssClassLocked)).to.be.false;
    });

    it('should dispatch custom events when a lock or an unlock request succeeds', () => {
        const div = document.createElement('div');

        let calls = 0;

        const handler = () => calls++;
        
        div.addEventListener(`${eventNamePrefix}lock`, handler);
        div.addEventListener(`${eventNamePrefix}unlock`, handler);

        expect(isLocked(div)).to.be.false;
        expect(unlock(div)).to.be.false;

        expect(lock(div)).to.be.true; // 1
        expect(lock(div)).to.be.false;

        expect(unlock(div)).to.be.true; // 2
        expect(unlock(div)).to.be.false;

        expect(lock(div)).to.be.true; // 3
        expect(unlock(div)).to.be.true; // 4
        
        div.removeEventListener(`${eventNamePrefix}lock`, handler);
        div.removeEventListener(`${eventNamePrefix}unlock`, handler);

        expect(calls).to.equals(4);
    });
});
