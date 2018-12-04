export const html = document.documentElement;
export const body = document.body || document.getElementsByTagName('body')[0];
export const head = document.head || document.getElementsByTagName('head')[0];

const stylerID = 'body-scroll';
const styler = document.createElement('style');
styler.type = 'text/css';
styler.id = stylerID;

export const setStyle = (css = '') => {
    if (!css) {
        styler.remove();

        return;
    }

    if (styler.styleSheet) {
        styler.styleSheet.cssText = css;
    } else {
        styler.innerHTML = '';
        styler.appendChild(document.createTextNode(css));
    }

    if (!head.querySelector('style#' + stylerID)) {
        head.appendChild(styler);
    }
};

export const incubator = (incubator => {
    const s4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    incubator.id = `body-scroll-lock-${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;

    return incubator;
})(document.createElement('div'));

export const BodyScrollEvent = (() => {
    if (typeof window.CustomEvent === 'function') {
        return window.CustomEvent;
    }

    function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };

        const evt = document.createEvent('CustomEvent');

        evt.initCustomEvent(
            event,
            params.bubbles,
            params.cancelable,
            params.detail
        );

        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    return CustomEvent;
})();
