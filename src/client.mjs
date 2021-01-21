// All involved client elements references
export const doc = document;
export const { documentElement, body, head } = doc;

// DOM naming part (prefix, suffix etc...)
export const DOM_BASE_NAME = 'scroll-padlock';

// Common global event names
export const EVENT_NAME_SCROLL = 'scroll';
export const EVENT_NAME_RESIZE = 'resize';

// Common global time values
export const RESIZE_DEBOUNCE_INTERVAL_MS = 250;
export const SCROLL_DEBOUNCE_INTERVAL_MS = 125;

/**
 * Registers an event listener
 * @param {Window|HTMLElement} element The given element target of the event listener
 * @param {String} eventName The event listener name
 * @param {Function} listener The event handler
 * @param {Object|Boolean} options The event listener options object (or boolean to address "passive" property only)
 * @returns {void} Nothing
 */
export const addListener = (element, eventName, listener, options = true) => element?.addEventListener(eventName, listener, options);

/**
 * Unregisters an event listener
 * @param {Window|HTMLElement} element The given element target of the event listener
 * @param {String} eventName The event listener name
 * @param {Function} listener The event handler
 * @param {Object|Boolean} options The event listener options object (or boolean to address "passive" property only)
 * @returns {void} Nothing
 */
export const removeListener = (element, eventName, listener, options = true) => element?.removeEventListener(eventName, listener, options);
