import {
    body,
    
    setCSSRules,
    removeCSSRules,

    getScrollableElement
} from './_test-utils.mjs';

import { eventNamePrefix } from '../src/client.mjs';

import { cssClassLocked } from '../src/style.mjs';

import { isLocked, doLock, doUnlock, lock, unlock } from '../src/state.mjs';

describe('state', () => {
    let scroller;

    before(() => setCSSRules());

    after(() => removeCSSRules());

    beforeEach(() => {
        scroller = getScrollableElement();

        body.append(scroller);
    });

    afterEach(() => {
        scroller.remove();

        scroller = null;
    });

    it('should return the lock status expressed by a boolean with "isLocked" function', () => {
        // -1. default case, (presumably) not initialized yet
        expect(isLocked(scroller)).to.be.false;
        expect(doUnlock(scroller)).to.be.false;

        // 0. programmatically setting locked state, isLocked method should return true
        expect(doLock(scroller)).to.be.true;
        expect(doLock(scroller)).to.be.false;

        expect(isLocked(scroller)).to.be.true;

        // 1. programmatically setting unlocked state, isLocked method should return false
        expect(doUnlock(scroller)).to.be.true;
        expect(doUnlock(scroller)).to.be.false;

        expect(isLocked(scroller)).to.be.false;
    });

    it('should give a css class to the given element with "lock" and "unlock" functions', () => {
        // -1. default case, (presumably) not initialized yet
        expect(isLocked(scroller)).to.be.false;
        expect(doUnlock(scroller)).to.be.false;

        expect(scroller.classList.contains(cssClassLocked)).to.be.false;

        // 0. programmatically setting locked state, css class should be absent
        expect(doLock(scroller)).to.be.true;
        expect(doLock(scroller)).to.be.false;

        expect(scroller.classList.contains(cssClassLocked)).to.be.true;

        // 1. programmatically setting locked state, css class should be present
        expect(doUnlock(scroller)).to.be.true;
        expect(doUnlock(scroller)).to.be.false;

        expect(scroller.classList.contains(cssClassLocked)).to.be.false;
    });

    it('should dispatch custom events when a lock or an unlock request succeeds', () => {
        let calls = 0;

        const handler = () => calls++;
        
        scroller.addEventListener(`${eventNamePrefix}lock`, handler);
        scroller.addEventListener(`${eventNamePrefix}unlock`, handler);

        expect(isLocked(scroller)).to.be.false;
        expect(unlock(scroller)).to.be.false;

        expect(lock(scroller)).to.be.true; // 1
        expect(lock(scroller)).to.be.false;

        expect(unlock(scroller)).to.be.true; // 2
        expect(unlock(scroller)).to.be.false;

        expect(lock(scroller)).to.be.true; // 3
        expect(unlock(scroller)).to.be.true; // 4
        
        scroller.removeEventListener(`${eventNamePrefix}lock`, handler);
        scroller.removeEventListener(`${eventNamePrefix}unlock`, handler);

        expect(calls).to.equals(4);
    });
});
