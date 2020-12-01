// caching involved dom elements
export const html = document.documentElement;
export const body = document.body;
export const head = document.head;

// all the custom events dispatched by the library will start with this string
// in order to avoid name clashing
export const eventNamePrefix = "scrollpadlock";

/**
 * Dispatches a custom event if custom events are supported, otherwise does nothing
 * @param {HTMLElement} element
 * @param {String} messageName The given message name to be dispatched
 * @returns {void} Nothing
 */
export const dispatchEvent = (element, messageName) =>
    typeof window.CustomEvent === "function"
        ? element?.dispatchEvent(new CustomEvent(`${eventNamePrefix}${messageName}`))
        : () => {};
