import { dispatchMessage } from "./body-scroll.client.mjs";
import {
    lock,
    unlock,
    isLocked,
    doLock,
    doUnlock
} from "./body-scroll.state.mjs";
import {
    updateCssVariables,
    getVerticalScrollbarGap
} from "./body-scroll.style.mjs";
import {
    restoreScrollPosition,
    saveScrollPosition,
    getSavedScrollPosition
} from "./body-scroll.scroll.mjs";

// handling browser resize (implicitly includes a possible device orientation change)
// re applying a consistent lock state when body scroll is locked
let id = null;
const resizeHandler = () => {
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
        dispatchMessage("resize");
    }, 150);
};
window.addEventListener("resize", resizeHandler, true);

// public API
export default {
    // main
    lock: lock,
    unlock: unlock,
    isLocked: isLocked,
    // extras
    updateCssVariables: updateCssVariables,
    getVerticalScrollbarGap: getVerticalScrollbarGap,
    restoreScrollPosition: restoreScrollPosition,
    saveScrollPosition: saveScrollPosition,
    getSavedScrollPosition: getSavedScrollPosition
};
