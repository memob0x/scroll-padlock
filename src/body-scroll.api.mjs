import {
    NAMESPACE,
    supportsCustomEvents,
    $head,
    $html,
    $body,
    $style
} from "./body-scroll.constants.mjs";

import * as Scroll from "./body-scroll.scroll.mjs";

/**
 * Checks if the style element is in the tag head or not
 * @returns {boolean} true if present
 */
const _styleExists = () => $style.parentNode === $head;

/**
 *
 * @param {boolean} locked
 * @returns {number}
 */
const _getClientWidth = locked => {
    $body.style.width = locked ? `${$html.clientWidth}px` : "";
    $html.style.overflow = locked ? "hidden" : "";

    return $html.clientWidth;
};

/**
 *
 * @param {string} eventName
 */
const _dispatch = eventName =>
    supportsCustomEvents
        ? window.dispatchEvent(new CustomEvent(eventName))
        : () => {};

/**
 *
 */
const _lock = () => {
    Scroll.save();
    $style.disabled = false;

    const index = 0;

    if (!_styleExists()) {
        $head.appendChild($style);
    }

    if ($style.sheet.cssRules[index]) {
        $style.sheet.deleteRule(index);
    }

    $style.sheet.insertRule(
        `:root {
            --${NAMESPACE}-top-rect: ${window.scrollY * -1}px!important;
            --${NAMESPACE}-scrollbar-gap: ${_getClientWidth(true) -
            _getClientWidth(false)}px!important;
        }`,
        index
    );

    $html.classList.add(NAMESPACE);
};

/**
 *
 */
const _unlock = () => {
    $html.classList.remove(NAMESPACE);

    Scroll.restore();

    $style.disabled = true;
};

/**
 *
 */
const _resize = mode => window[`${mode}EventListener`]("resize", update);

/**
 *
 */
/**
 * Returns whether the body scroll is locked or not
 * @returns {boolean} The body scroll lock state
 */
export const isLocked = () =>
    _styleExists() && !$style.disabled && $html.classList.contains(NAMESPACE);

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
export const lock = () => {
    _lock();

    _dispatch("bodyscrolllock");

    _resize("add");
};

/**
 *
 */
export const unlock = () => {
    _unlock();

    _dispatch("bodyscrollunlock");

    _resize("remove");
};
