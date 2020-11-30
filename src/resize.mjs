import { dispatchEvent } from "./client.mjs";
import { doLock, doUnlock } from "./state.mjs";

const eventName = "resize";

export const debounceTime = 150;

let id = null;

/**
 * Handles (debounced) browser resize (implicity includes a possible device orientation change),
 * re-applies a consistent lock state when body scroll is locked
 * and only then it dispatches a custom event
 * @param {HTMLElement} element
 * @returns {void} Nothing
 */
const eventHandler = (element) => {
    clearTimeout(id);

    id = setTimeout(() => {
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
    }, debounceTime);
};

// passive as only option
const options = true;

/**
 * Attach the resize the handler to a browser resize event listener
 * @param {HTMLElement} element
 * @returns {void} Nothing
 */
export const addResizeEventListener = (element) =>
    window.addEventListener(eventName, eventHandler(element), options);

/**
 * Detach the resize the handler to a browser resize event listener
 * @param {HTMLElement} element
 * @returns {void} Nothing
 */
export const removeResizeEventListener = (element) =>
    window.removeEventListener(eventName, eventHandler(element), options);
