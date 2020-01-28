import { $html, supportsCustomEvents } from "./body-scroll.client.mjs";
import { $locker, setLockerCssVars } from "./body-scroll.locker.mjs";
import { isStyleElementInHead } from "./body-scroll.styler.mjs";
import {
    saveScrollPosition,
    restoreScrollPosition
} from "./body-scroll.scroller.mjs";

/**
 *
 */
const LOCKED_STATUS_CSS_CLASS = "body-scroll-locked";

/**
 *
 */
/**
 * Returns whether the body scroll is locked or not
 * @returns {boolean} The body scroll lock state
 */
export const isLocked = () =>
    isStyleElementInHead($locker) &&
    !$locker.disabled &&
    $html.classList.contains(LOCKED_STATUS_CSS_CLASS);

/**
 *
 */
export const update = () => {
    if (!isLocked()) {
        return;
    }

    _unlock();

    _lock();
};

/**
 *
 */
const _lock = () => {
    saveScrollPosition();
    $locker.disabled = false;
    setLockerCssVars();
    $html.classList.add(LOCKED_STATUS_CSS_CLASS);
};

/**
 *
 */
export const lock = () => {
    _lock();

    if (supportsCustomEvents) {
        window.dispatchEvent(new CustomEvent("bodyScrollLock"));
    }

    window.addEventListener("resize", update);
};

/**
 *
 */
const _unlock = () => {
    $html.classList.remove(LOCKED_STATUS_CSS_CLASS);
    restoreScrollPosition();
    $locker.disabled = true;
};

/**
 *
 */
export const unlock = () => {
    _unlock();

    if (supportsCustomEvents) {
        window.dispatchEvent(new CustomEvent("bodyScrollUnlock"));
    }

    window.removeEventListener("resize", update);
};
