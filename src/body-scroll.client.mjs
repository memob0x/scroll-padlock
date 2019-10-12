export const $head = document.head;
export const $html = document.documentElement;
export const $body = document.body;

const createStyle = () => {
    const $el = document.createElement("style");
    $el.type = "text/css";
    return $el;
};

export const $stylerBase = createStyle();
export const $stylerResizable = createStyle();

const isLegacyIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
const isMultiTouchMacAkaIOS13 =
    window.navigator.platform === "MacIntel" &&
    window.navigator.maxTouchPoints > 1;
export const isAppleTouchDevice = isLegacyIOS || isMultiTouchMacAkaIOS13;

export const BodyScrollEvent = (() => {
    if (typeof window.CustomEvent === "function") {
        return window.CustomEvent;
    }

    function CustomEvent(event, params) {
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        };

        const evt = document.createEvent("CustomEvent");

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
