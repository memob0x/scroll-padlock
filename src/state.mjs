import { dispatchEvent } from "./client.mjs";
import {
    isValidScrollPosition,
    getSavedScrollPosition,
    saveScrollPosition,
    clearSavedScrollPosition,
    restoreScrollPosition
} from "./scroll.mjs";
import {
    updateCssVariables, 
    addLockedCssClass,
    removeLockedCssClass
} from "./style.mjs";

// lock state flag closure, true if is locked
const lockStates = new WeakMap();

/**
 * Returns the current lock state as a boolean
 * @public
 * @returns {Boolean} True if body scroll is locked, false if not
 */
export const isLocked = (element) => !!lockStates.get(element);

/**
 * Locks the body scroll, saves current body scroll position (if not already saved) and updates css variables
 * @private
 * @returns {Boolean} True if the lock has been successfully done, false if not
 */
export const doLock = (element) => {
    // don't lock when already locked, lock not done, returns false early
    if (isLocked(element)) {
        return false;
    }

    // sets the lock state to true
    lockStates.set(element, true);

    // saves current scroll position if there's not another saving state
    if (!isValidScrollPosition(getSavedScrollPosition(element))) {
        saveScrollPosition(element);
    }

    // calculates and applies css variables to grant scroll lock css techniques
    updateCssVariables(element);

    // applies body scroll lock css techniques
    addLockedCssClass(element);

    // lock done, returns true
    return true;
};

/**
 * Unlocks the body scroll, restores the scroll position previously saved and clears the saving
 * @private
 * @returns {Boolean} True if the unlock has been successfully done, false if not
 */
export const doUnlock = (element) => {
    // don't unlock when already unlocked, unlock not done, returns false early
    if (!isLocked(element)) {
        return false;
    }

    // sets the lock state to false
    lockStates.set(element, false);

    // clears body scroll lock css techniques that could prevent scroll restoration
    removeLockedCssClass(element);

    // restores previously saved scroll position
    restoreScrollPosition(element, getSavedScrollPosition(element));

    // clears the scroll position saving
    clearSavedScrollPosition(element);

    // unlock done, returns true
    return true;
};

/**
 * Locks the body scroll
 * @public
 * @returns {void} Nothing
 */
export const lock = (element) => {
    // returns early if lock itself hasn't been successful
    if (!doLock(element)) {
        return;
    }

    // dispatch a "lock done" notification
    dispatchEvent(element, "lock");
};

/**
 * Unlocks the body scroll
 * @public
 * @returns {void} Nothing
 */
export const unlock = (element) => {
    // returns early if unlock itself hasn't been successful
    if (!doUnlock(element)) {
        return;
    }

    // dispatch an "unlock done" notification
    dispatchEvent(element, "unlock");
};
