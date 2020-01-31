(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('bodyScroll', factory) :
    (global = global || self, global.bodyScroll = factory());
}(this, (function () { 'use strict';

    const NAMESPACE = "body-scroll-lock";

    const $head = document.head;
    const $html = document.documentElement;
    const $body = document.body;

    const $style =
        $head.querySelector(`#${NAMESPACE}`) ||
        (() => {
            const $style = document.createElement("style");

            $style.id = NAMESPACE;

            return $style;
        })();

    /**
     *
     */
    let _x = 0;
    let _y = 0;

    /**
     *
     */
    const save = () => {
        _x = window.pageXOffset;
        _y = window.pageYOffset;
    };

    /**
     *
     */
    const restore = () => window.scrollTo(_x, _y);

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
        typeof window.CustomEvent === "function"
            ? window.dispatchEvent(new CustomEvent(eventName))
            : () => {};

    /**
     *
     */
    const _lock = () => {
        save();
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

        restore();

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
    const isLocked = () =>
        _styleExists() && !$style.disabled && $html.classList.contains(NAMESPACE);

    /**
     *
     */
    const update = () => {
        if (!isLocked()) {
            return;
        }

        _unlock();

        _lock();
    };

    /**
     *
     */
    const lock = () => {
        _lock();

        _dispatch("bodyscrolllock");

        _resize("add");
    };

    /**
     *
     */
    const unlock = () => {
        _unlock();

        _dispatch("bodyscrollunlock");

        _resize("remove");
    };

    var Api = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isLocked: isLocked,
        update: update,
        lock: lock,
        unlock: unlock
    });

    return Api;

})));

//# sourceMappingURL=body-scroll.js.map
