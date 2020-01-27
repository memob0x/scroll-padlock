import { $html, $style, supportsCustomEvents } from "./body-scroll.client.mjs";
import {
    isStyleElementInHead,
    setCssVars,
    saveScrollPosition,
    restoreScrollPosition
} from "./body-scroll.core.mjs";

const LOCKED_STATUS_CSS_CLASS = "body-scroll-locked";

/**
 *
 */
/**
 * Returns whether the body scroll is locked or not
 * @returns {boolean} The body scroll lock state
 */
export const isLocked = () => isStyleElementInHead() && !$style.disabled;

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
    $style.disabled = false;
    setCssVars();
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
    $style.disabled = true;
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
