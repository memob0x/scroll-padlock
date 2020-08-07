import {
    dispatchEvent,
    addLockedCssClass,
    removeLockedCssClass
} from "./body-scroll.client.mjs";
import {
    isValidScrollPosition,
    getSavedScrollPosition,
    saveScrollPosition,
    clearSavedScrollPosition,
    restoreScrollPosition
} from "./body-scroll.scroll.mjs";
import { updateCssVariables } from "./body-scroll.style.mjs";

// lock state flag closure, true if is locked
let lockState = false;

/**
 * Returns the current lock state as a boolean
 * @public
 * @returns {Boolean} True if body scroll is locked, false if not
 */
export const isLocked = () => lockState;

/**
 * Locks the body scroll, saves current body scroll position (if not already saved) and updates css variables
 * @private
 * @returns {Boolean} True if the lock has been successfully done, false if not
 */
export const doLock = () => {
    // don't lock when already locked, lock not done, returns false early
    if (isLocked()) {
        return false;
    }

    // sets the lock state to true
    lockState = true;

    // saves current scroll position if there's not another saving state
    if (!isValidScrollPosition(getSavedScrollPosition())) {
        saveScrollPosition({
            top: window.pageYOffset,
            left: window.pageXOffset
        });
    }

    // calculates and applies :root css variables to grant body scroll lock css techniques
    updateCssVariables();

    // applies body scroll lock css techniques
    addLockedCssClass();

    // lock done, returns true
    return true;
};

/**
 * Unlocks the body scroll, restores the scroll position previously saved and clears the saving
 * @private
 * @returns {Boolean} True if the unlock has been successfully done, false if not
 */
export const doUnlock = () => {
    // don't unlock when already unlocked, unlock not done, returns false early
    if (!isLocked()) {
        return false;
    }

    // sets the lock state to false
    lockState = false;

    // clears body scroll lock css techniques that could prevent scroll restoration
    removeLockedCssClass();

    // restores previously saved scroll position
    restoreScrollPosition(getSavedScrollPosition());

    // clears the scroll position saving
    clearSavedScrollPosition();

    // unlock done, returns true
    return true;
};

/**
 * Locks the body scroll
 * @public
 * @returns {void} Nothing
 */
export const lock = () => {
    // returns early if lock itself hasn't been successful
    if (!doLock()) {
        return;
    }

    // dispatch a "lock done" notification
    dispatchEvent("lock");
};

/**
 * Unlocks the body scroll
 * @public
 * @returns {void} Nothing
 */
export const unlock = () => {
    // returns early if unlock itself hasn't been successful
    if (!doUnlock()) {
        return;
    }

    // dispatch an "unlock done" notification
    dispatchEvent("unlock");
};
