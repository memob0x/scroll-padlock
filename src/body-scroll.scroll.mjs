import { isNumber } from "./body-scroll.utils.mjs";

// scroll position saving closure
const scrollSaving = new WeakMap();

/**
 * Checks whether a given value is a valid scroll object or not
 * @example
 * isValidScrollPosition({top:0, left:100}); // true
 * isValidScrollPosition(null); // false
 * isValidScrollPosition({top:"foo", left:NaN}); // false
 * @static
 * @private
 * @param {Object} value The given value to be checked
 * @returns {Boolean} True if the given value is a valid scroll object
 */
export const isValidScrollPosition = (value) =>
    typeof value === "object" && isNumber(value?.top) && isNumber(value?.left);

/**
 * Formats a given scroll position object value, if malformed returns null
 * @static
 * @private
 * @param {Object} value The given value to be formatted
 * @returns {Object|null} The given value is returned if is a valid scroll position object, otherwise null is returned
 */
export const formatScrollPosition = (value) =>
    isValidScrollPosition(value) ? value : null;

/**
 * Restores a given valid scroll position object, if not passed possibly restores a previously saved scroll position object
 * @public
 * @param {HTMLElement} element
 * @param {Object} [scroll] The given scroll object to be restored
 * @returns {Object|null} The given value is returned if is a valid scroll position object, otherwise null is returned
 */
export const restoreScrollPosition = (element, scroll) => {
    scroll = scroll !== undefined ? scroll : getSavedScrollPosition(element);
    scroll = formatScrollPosition(scroll);

    if (scroll) {
        element?.scrollTo(scroll.left, scroll.top);
    }

    return scroll;
};

/**
 * Saves a given valid scroll position object, if not passed saves the current body scroll position
 * @public
 * @param {HTMLElement} element
 * @param {Object} [scroll] The given scroll position object to be saved
 * @returns {Object|null} The given value is returned if is a valid scroll position object, otherwise null is returned
 */
export const saveScrollPosition = (element, scroll) => {
    if (scroll === undefined) {
        scroll = {
            top: element?.scrollTop ?? 0,
            left: element?.scrollLeft ?? 0
        };
    }

    scroll = formatScrollPosition(scroll);

    scrollSaving.set(element, scroll);

    return scroll;
};

/**
 * Returns the currently saved scroll position object
 * @public
 * @param {HTMLElement} element
 * @returns {Object|null} The currently saved scroll position object, null if nothing was saved
 */
export const getSavedScrollPosition = (element) => scrollSaving.get(element) ?? null;

/**
 * Returns the currently saved scroll position object
 * @public
 * @param {HTMLElement} element
 * @returns {Boolean} Whether the scroll saving deletion has been successful or not
 */
export const clearSavedScrollPosition = (element) => scrollSaving.delete(element);
