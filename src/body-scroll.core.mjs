import {
    $head,
    $html,
    $body,
    $style,
    shouldUsePositionFixedTechnique
} from "./body-scroll.client.mjs";

let scrollPosition = {
    x: 0,
    y: 0
};
let scrollbarWidth = 0;
let clientWidth = 0;

let options = {
    alwaysUsePositionFixedTechnique: false
};

/**
 * Checks if the style element is in the tag head or not
 * @returns {boolean} true if present
 */
const isStyleElementInHead = () => $style.parentNode === $head;

/**
 * Inserts a rule with the CSSStyleSheet interface
 * @param {string} rule The CSS rule to add
 * @param {number} index The index of the CSS rule in the CSSRulesList
 */
const insertIndexedRule = (rule = "", index = 0) => {
    if (!isStyleElementInHead()) {
        $head.appendChild($style);
    }

    if ($style.sheet.cssRules[index]) {
        $style.sheet.deleteRule(index);
    }

    $style.sheet.insertRule(rule, index);
};

/**
 * Inserts the CSS rules that doesn't need to be recalculated on resize
 */
const insertBaseRules = () => {
    insertIndexedRule(
        `html {
            padding-right: ${scrollbarWidth}px!important;
        }`,
        0
    );

    if (
        shouldUsePositionFixedTechnique ||
        options.alwaysUsePositionFixedTechnique
    ) {
        insertIndexedRule(
            `html {
                height: auto!important;
                position: fixed!important;
                top: ${-1 * scrollPosition.y}px!important;
                left: ${-1 * scrollPosition.x}px!important;
                overflow: visible!important;
            }`,
            1
        );
    } else {
        insertIndexedRule(
            `body {
                overflow: hidden!important;
            }`,
            1
        );
    }
};

/**
 * Inserts the CSS rules that need to be recalculated on resize
 */
const insertResizableRules = () =>
    insertIndexedRule(
        `html {
            width: ${clientWidth}px!important;
        }`,
        2
    );

/**
 *
 */
const resizeListener = () => {
    clientWidth = $html.clientWidth;

    insertResizableRules();
};

/**
 * Returns whether the body scroll is locked or not
 * @returns {boolean} The body scroll lock state
 */
export const isLocked = () => isStyleElementInHead() && !$style.disabled;

/**
 * Locks the body scroll
 * @returns {boolean} Whether the lock action has been successful of not (false if already locked)
 */
export const lock = () => {
    if (isLocked()) {
        return false;
    }

    if (
        shouldUsePositionFixedTechnique ||
        options.alwaysUsePositionFixedTechnique
    ) {
        scrollPosition = {
            x: window.scrollX,
            y: window.scrollY
        };
    }

    const _clientWidth = $html.clientWidth;
    $body.style.width = $body.clientWidth + "px";
    $html.style.overflow = "hidden";
    clientWidth = $html.clientWidth;
    scrollbarWidth = clientWidth - _clientWidth;
    $body.style.width = "";
    $html.style.overflow = "";

    insertBaseRules();
    insertResizableRules();

    $style.disabled = false;

    if (
        shouldUsePositionFixedTechnique ||
        options.alwaysUsePositionFixedTechnique
    ) {
        window.scroll(0, 0);
    }

    window.dispatchEvent(
        new CustomEvent("bodyScrollLock", {
            detail: {
                clientWidth: clientWidth,
                scrollbarWidth: scrollbarWidth
            }
        })
    );

    window.addEventListener("resize", resizeListener);

    return true;
};

/**
 * Unlocks the body scroll
 * @returns {boolean} Whether the unlock action has been successful of not (false if already unlocked)
 */
export const unlock = () => {
    if (!isLocked()) {
        return false;
    }

    $style.disabled = true;

    if (
        shouldUsePositionFixedTechnique ||
        options.alwaysUsePositionFixedTechnique
    ) {
        window.scroll(scrollPosition.x, scrollPosition.y);
    }

    window.dispatchEvent(
        new CustomEvent("bodyScrollUnlock", {
            detail: {
                clientWidth: clientWidth,
                scrollbarWidth: scrollbarWidth
            }
        })
    );

    window.removeEventListener("resize", resizeListener);

    return true;
};

export const setOption = (name, value) => {
    if (name in options && typeof value === typeof options[name]) {
        options[name] = value;
    }
};
