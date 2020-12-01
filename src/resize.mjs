import { dispatchEvent } from "./client.mjs";

import { doLock, doUnlock } from "./state.mjs";

// the event name supplied to event listeners
const eventName = "resize";

// the events debounce time in milliseconds
export const debounceTime = 150;

// events debounce timers closure
// a weakmap is used in order to keep every timer associated with the scrollable element itself
const timers = new WeakMap();

/**
 * Handles (debounced) browser resize (implicity includes a possible device orientation change),
 * re-applies a consistent lock state when scroll is locked
 * and only then it dispatches a custom event
 * @param {HTMLElement} element
 * @returns {void} Nothing
 */
const eventHandler = element => {
    clearTimeout(timers.get(element));

    timers.delete(element);

    timers.set(element, setTimeout(() => {
        // toggling body scroll lock

        // gets rid of possible body scroll locked state
        // avoids useless computations when scroll is not locked
        if (!doUnlock(element)) {
            return;
        }

        // recalculates and rewrites lock state
        doLock(element);

        // dispatch a "resize during lock" notification
        dispatchEvent(element, eventName);
    }, debounceTime));
};

// "passive" as event listeners only option
const options = true;

/**
 * Attach the window resize listener for a given element
 * @param {HTMLElement} element The given element
 * @returns {void} Nothing
 */
export const addResizeEventListener = element => window.addEventListener(eventName, eventHandler(element), options);

/**
 * Detach a previously attached window resize listener for a given element
 * @param {HTMLElement} element The given element
 * @returns {void} Nothing
 */
export const removeResizeEventListener = element => window.removeEventListener(eventName, eventHandler(element), options);
