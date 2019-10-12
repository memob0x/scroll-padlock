import {
    $head,
    $stylerBase,
    $stylerResizable,
    isAppleTouchDevice
} from './body-scroll.client.mjs';

const IMPORTANT_STATEMENT = '!important';

let status = false;
let scroll = {
    x: 0,
    y: 0
};
let scrollbarWidth = 0;
let clientWidth = 0;

const getBaseRules = () => {
    let output = '';
    output = ' html,';
    output += 'body {';
    output += 'height: auto' + IMPORTANT_STATEMENT + ';';
    output += 'margin: 0' + IMPORTANT_STATEMENT + ';';
    output +=
        'padding: 0 ' + scrollbarWidth + 'px 0 0' + IMPORTANT_STATEMENT + ';';
    output += '}';

    if (isAppleTouchDevice) {
        output += 'html {';
        output += 'position: fixed' + IMPORTANT_STATEMENT + ';';
        output += 'top: ' + -1 * scroll.y + 'px' + IMPORTANT_STATEMENT + ';';
        output += 'left: ' + -1 * scroll.x + 'px' + IMPORTANT_STATEMENT + ';';
        output += 'overflow: visible' + IMPORTANT_STATEMENT + ';';
        output += '}';
    } else {
        output += 'body {';
        output += 'overflow: hidden' + IMPORTANT_STATEMENT + ';';
        output += '}';
    }

    return output;
};

const getResizableRules = () => {
    let output = '';
    output = ' html,';
    output += 'body {';
    output += 'width: ' + clientWidth + 'px' + IMPORTANT_STATEMENT + ';';
    output += '}';
    return output;
};

const printRules = ($actor, rules) => {
    $actor.innerHTML = rules;

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

    const _clientWidth = document.documentElement.clientWidth;
    document.body.style.width = document.body.clientWidth + 'px';
    document.documentElement.style.overflow = 'hidden';
    clientWidth = document.documentElement.clientWidth;
    scrollbarWidth = clientWidth - _clientWidth;
    document.body.style.width = '';
    document.documentElement.style.overflow = '';

    printBaseRules();

    printResizableRules();

    if (isAppleTouchDevice) {
        window.scroll(0, 0);
    }

    window.dispatchEvent(
        new CustomEvent('bodyScrollLock', {
            clientWidth: clientWidth,
            scrollbarWidth: scrollbarWidth
        })
    );

    return true;
};

export const unlock = () => {
    if (!status) {
        return false;
    }

    status = false;

    $stylerBase.innerHTML = '';
    $stylerResizable.innerHTML = '';

    if (isAppleTouchDevice) {
        window.scroll(scroll.x, scroll.y);
    }

    window.dispatchEvent(
        new CustomEvent('bodyScrollUnlock', {
            clientWidth: clientWidth,
            scrollbarWidth: scrollbarWidth
        })
    );

    return true;
};

export const resize = () => {
    if (!status) {
        return;
    }

    clientWidth = document.documentElement.clientWidth;

    printResizableRules();
};
