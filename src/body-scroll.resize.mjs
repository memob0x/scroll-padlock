import { dispatchEvent } from "./body-scroll.client.mjs";
import { doLock, doUnlock } from "./body-scroll.state.mjs";

const eventName = "resize";

export const debounceTime = 150;

let id = null;

/**
 * Handles (debounced) browser resize (implicity includes a possible device orientation change),
 * re-applies a consistent lock state when body scroll is locked
 * and only then it dispatches a custom event
 * @returns {void} Nothing
 */
const eventHandler = () => {
    clearTimeout(id);

    id = setTimeout(() => {
        // toggling body scroll lock

        // gets rid of possible body scroll locked state
        // avoids useless computations when scroll is not locked
        if (!doUnlock()) {
            return;
        }

        // recalculates and rewrites lock state
        doLock();

        // dispatch a "resize during lock" notification
        dispatchEvent(eventName);
    }, debounceTime);
};

/**
 * Attach the resize the handler to a browser resize event listener
 * @returns {void} Nothing
 */
export const addResizeEventListener = () =>
    window.addEventListener(eventName, eventHandler, true);

/**
 * Detach the resize the handler to a browser resize event listener
 * @returns {void} Nothing
 */
export const removeResizeEventListener = () =>
    window.removeEventListener(eventName, eventHandler);
