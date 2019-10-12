import {
    $head,
    $html,
    $body,
    $stylerBase,
    $stylerResizable,
    isAppleTouchDevice,
    BodyScrollEvent
} from "./body-scroll.client.mjs";

// local vars
let status = false;
let scroll = {
    x: 0,
    y: 0
};
let scrollbarWidth = 0;
let clientWidth = 0;

/**
 * Gets the CSS rules that can't be influenced by a window resize
 * @returns {string} CSS rules
 */
const getBaseRules = () => {
    let output = `html, body {
        height: auto!important;
        margin: 0!important;
        padding: 0 ${scrollbarWidth}px 0 0!important;
    }`;

    if (isAppleTouchDevice) {
        output += `html {
            position: fixed!important;
            top: ${-1 * scroll.y}px!important;
            left: ${-1 * scroll.x}px!important;
            overflow: visible!important;
        }`;
    } else {
        output += `body {
            overflow: hidden!important;
        }`;
    }

    return output;
};

/**
 * Gets the CSS rules that can be influenced by a window resize
 * @returns {string} CSS rules
 */
const getResizableRules = () => {
    return `html, body {
        width: ${clientWidth}px!important;
    }`;
};

/**
 * Sets some CSS rules to a style element
 * @param {HTMLElement} $actor A style element
 * @param {string} rules The CSS rules
 */
const printRules = ($actor, rules) => {
    if ($actor.styleSheet) {
        $actor.styleSheet.cssText = rules;
    } else {
        $actor.appendChild(document.createTextNode(rules));
    }

    if ($actor.parentNode !== $head) {
        $head.append($actor);
    }
};

// shorthand style printers
const printBaseRules = () => printRules($stylerBase, getBaseRules());
const printResizableRules = () =>
    printRules($stylerResizable, getResizableRules());

/**
 * Resize handler to refresh the CSS rules when body scroll is locked
 */
const resize = () => {
    if (!status) {
        return;
    }

    clientWidth = $html.clientWidth;

    printResizableRules();
};

/**
 * Returns whether the body scroll is locked or not
 * @returns {boolean} The body scroll lock state
 */
export const isLocked = () => status;

/**
 * Locks the body scroll
 * @returns {boolean} Whether the lock action has been successful of not
 */
export const lock = () => {
    if (status) {
        return false;
    }

    status = true;

    if (isAppleTouchDevice) {
        scroll = {
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

    printBaseRules();
    printResizableRules();

    if (isAppleTouchDevice) {
        window.scroll(0, 0);
    }

    window.dispatchEvent(
        new BodyScrollEvent("bodyScrollLock", {
            detail: {
                clientWidth: clientWidth,
                scrollbarWidth: scrollbarWidth
            }
        })
    );

    document.addEventListener("resize", resize);

    return true;
};

/**
 * Unlocks the body scroll
 * @returns {boolean} Whether the unlock action has been successful of not
 */
export const unlock = () => {
    if (!status) {
        return false;
    }

    status = false;

    $stylerBase.innerHTML = "";
    $stylerResizable.innerHTML = "";

    if (isAppleTouchDevice) {
        window.scroll(scroll.x, scroll.y);
    }

    window.dispatchEvent(
        new BodyScrollEvent("bodyScrollUnlock", {
            detail: {
                clientWidth: clientWidth,
                scrollbarWidth: scrollbarWidth
            }
        })
    );

    document.removeEventListener("resize", resize);

    return true;
};
