// caching involved dom elements
export const head = document.head;
export const body = document.body;
export const html = document.documentElement;
export const styler = document.createElement("style");

/**
 * Dispatches the given message name in jQuery.Event
 * @private
 * @param {String} messageName The given message name to be dispatched
 * @returns {void} Nothing
 */
export const dispatchMessage = (messageName) =>
    typeof window.CustomEvent === "function"
        ? window.dispatchEvent(new CustomEvent(`bodyscroll${messageName}`))
        : () => {};

//
const lockedStateCssClass = "body-scroll-lock";

/**
 * Toggles the locked state css class to html element
 * @param {Boolean} bool Whether the class should be added ro removed
 * @returns {Boolean} Whether the removal or the
 */
const toggleLockedCssClass = (bool) => {
    const hadClass = html.classList.contains(lockedStateCssClass);

    bool = bool ?? !hadClass;

    html.classList.toggle(lockedStateCssClass, bool);

    return (bool && !hadClass) || (!bool && hadClass);
};

/**
 *
 * @returns {Boolean}
 */
export const addLockedCssClass = () => toggleLockedCssClass(true);

/**
 *
 * @returns {Boolean}
 */
export const removeLockedCssClass = () => toggleLockedCssClass(false);
