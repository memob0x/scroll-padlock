import { lock, unlock, isLocked } from "./body-scroll.state.mjs";
import {
    updateCssVariables,
    getVerticalScrollbarGap
} from "./body-scroll.style.mjs";
import {
    restoreScrollPosition,
    saveScrollPosition,
    getSavedScrollPosition
} from "./body-scroll.scroll.mjs";
import {
    addResizeEventListener,
    removeResizeEventListener
} from "./body-scroll.resize.mjs";

// handling resize (attacching event listener) on library inclusion
addResizeEventListener();

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
    getSavedScrollPosition: getSavedScrollPosition,
    addResizeEventListener: addResizeEventListener,
    removeResizeEventListener: removeResizeEventListener
};
