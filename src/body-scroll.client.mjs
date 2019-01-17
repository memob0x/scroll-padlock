export const html = document.documentElement;
export const head = document.head || document.getElementsByTagName('head')[0];

const ua = navigator.userAgent;
const isSafari = !!ua.match(/Version\/[\d\.]+.*Safari/);
const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

export const isSafariIOS = isIOS && isSafari;

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
