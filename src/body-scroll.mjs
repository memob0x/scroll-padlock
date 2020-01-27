import {
    getScrollPosition,
    setCssVars,
    saveScrollPosition,
    restoreScrollPosition
} from "./body-scroll.core.mjs";

import { lock, unlock, isLocked } from "./body-scroll.api.mjs";

export default {
    //
    setCssVars: setCssVars,
    getScrollPosition: getScrollPosition,
    saveScrollPosition: saveScrollPosition,
    restoreScrollPosition: restoreScrollPosition,

    //
    lock: lock,
    unlock: unlock,
    isLocked: isLocked,
    toggle: () => (isLocked() ? unlock() : lock())
};
