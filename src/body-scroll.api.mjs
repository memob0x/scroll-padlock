import { $html, $style } from "./body-scroll.client.mjs";
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
const resizeHandler = () => {
    unlock();

    lock();
};

/**
 *
 */
export const lock = () => {
    saveScrollPosition();
    $style.disabled = false;
    setCssVars();
    $html.classList.add(LOCKED_STATUS_CSS_CLASS);

    window.dispatchEvent(new CustomEvent("bodyScrollLock"));

    window.addEventListener("resize", resizeHandler);
};

/**
 *
 */
export const unlock = () => {
    $html.classList.remove(LOCKED_STATUS_CSS_CLASS);
    restoreScrollPosition();
    $style.disabled = true;

    window.dispatchEvent(new CustomEvent("bodyScrollUnlock"));

    window.removeEventListener("resize", resizeHandler);
};
