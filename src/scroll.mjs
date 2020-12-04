import { isNumber } from "./utils.mjs";

import { body, html } from "./client.mjs";

// scroll position savings closure
// a weakmap is used in order to keep every scroll object associated with the scrollable element itself
const scrollSaving = new WeakMap();

/**
 * Checks whether a given value is a valid scroll object or not
 * @example
 * isValidScrollPosition({top:0, left:100}); // true
 * isValidScrollPosition(null); // false
 * isValidScrollPosition({top:"foo", left:NaN}); // false
 * @param {Object} value The given value to be checked
 * @returns {Boolean} True if the given value is a valid scroll object
 */
export const isValidScrollPosition = value => typeof value === "object" && isNumber(value?.top) && isNumber(value?.left);

/**
 * Formats a given scroll position object value, if malformed returns null
 * @param {Object} value The given value to be formatted
 * @returns {Object|null} The given value is returned if is a valid scroll position object, otherwise null is returned
 */
export const formatScrollPosition = value => isValidScrollPosition(value) ? value : null;

/**
 * Checks whether the given element is a main scrollable element (html or body)
 * @param {HTMLElement} element The given element to be checked
 * @returns {Boolean} True if element is a global frame element
 */
// TODO: provide unit tests
const isGlobalScroller = element => element === html || element === body;

/**
 * Gets a scroller element, returns Window object if a main frame element (html, body) is provided
 * @param {HTMLElement} element The given html element to be checked
 * @returns {Window|HTMLElement} The scrollable element, Window is returned if a main element is provided
 */
// TODO: provide unit tests
const getScroller = element => isGlobalScroller(element) ? window : element;

/**
 * Scrolls a given element or window to a given scroll position
 * @param {Window|HTMLElement} element The scroller element
 * @param {Object} scroll The scroll object to scroll to
 * @returns {Object} The given scroll object
 */
// TODO: provide unit tests
const scrollTo = (element, scroll) => {
    getScroller(element)?.scrollTo(scroll?.left, scroll?.top);

    return scroll;
}

/**
 * Restores a given valid scroll position object, if not passed possibly restores a previously saved scroll position object
 * @param {HTMLElement} element
 * @param {Object} [scroll] The given scroll object to be restored
 * @returns {Object|null} The given value is returned if is a valid scroll position object, otherwise null is returned
 */
export const restoreScrollPosition = (element, scroll) => scrollTo(element, formatScrollPosition(scroll ?? getSavedScrollPosition(element)))

/**
 * Gets browser scroll position
 * @returns {Object} The browser scroll position as an object ({ top, left })
 */
// TODO: provide unit tests
const getGlobalScrollPosition = () => ({
    top: window.pageYOffset || body.scrollTop || html.scrollTop || 0,
    left: window.pageXOffset || body.scrollLeft || html.scrollLeft || 0
});

/**
 * Gets a given element scroll position
 * @param {HTMLElement} element The given element whose scroll position needs to be retrieved
 * @returns {Object} The given element scroll position as an object ({ top, left })
 */
// TODO: provide unit tests
const getElementScrollPosition = element => ({
    top: element?.scrollTop ?? 0,
    left: element?.scrollLeft ?? 0
});

/**
 * Gets a given element scroll position, does more checks (eg. on window) if html or body element is passed
 * @param {HTMLElement} element The given element whose scroll position needs to be retrieved
 * @returns {Object} The given element scroll position as an object ({ top, left })
 */
// TODO: unit test body | html condition
export const getScrollPosition = element => isGlobalScroller(element) ? getGlobalScrollPosition() : getElementScrollPosition(element);

/**
 * Saves a given valid scroll position object, if not passed saves the current body scroll position
 * @param {HTMLElement} element
 * @param {Object} [scroll] The given scroll position object to be saved
 * @returns {Object|null} The given value is returned if is a valid scroll position object, otherwise null is returned
 */
export const saveScrollPosition = (element, scroll) => {
    scrollSaving.set(element, formatScrollPosition(scroll ?? getScrollPosition(element)));

    return getSavedScrollPosition(element);
};

/**
 * Returns the currently saved scroll position object
 * @param {HTMLElement} element
 * @returns {Object|null} The currently saved scroll position object, null if nothing was saved
 */
export const getSavedScrollPosition = element => scrollSaving.get(element) ?? null;

/**
 * Returns the currently saved scroll position object
 * @param {HTMLElement} element
 * @returns {Boolean} Whether the scroll saving deletion has been successful or not
 */
export const clearSavedScrollPosition = element => scrollSaving.delete(element);
