import {
    $head,
    $html,
    $body,
    $stylerBase,
    $stylerResizable,
    isAppleTouchDevice,
    BodyScrollEvent
} from "./body-scroll.client.mjs";

let status = false;
let scroll = {
    x: 0,
    y: 0
};
let scrollbarWidth = 0;
let clientWidth = 0;

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

const getResizableRules = () => {
    return `html, body {
        width: ${clientWidth}px!important;
    }`;
};

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

const printBaseRules = () => printRules($stylerBase, getBaseRules());

const printResizableRules = () =>
    printRules($stylerResizable, getResizableRules());

export const isLocked = () => status;

export const lock = () => {
    if (status) {
        return false;
    }

    status = true;

    scroll = {
        x: window.scrollX,
        y: window.scrollY
    };

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

    return true;
};

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

    return true;
};

export const resize = () => {
    if (!status) {
        return;
    }

    clientWidth = $html.clientWidth;

    printResizableRules();
};
