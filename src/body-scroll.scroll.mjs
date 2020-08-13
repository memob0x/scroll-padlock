import { isNumber } from "./body-scroll.utils.mjs";

// scroll position saving closure
let scrollSaving = null;

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
 * @param {Object} [scroll] The given scroll object to be restored
 * @returns {Object|null} The given value is returned if is a valid scroll position object, otherwise null is returned
 */
export const restoreScrollPosition = (scroll) => {
    scroll = scroll !== undefined ? scroll : scrollSaving;
    scroll = formatScrollPosition(scroll);

    if (scroll) {
        window.scrollTo(scroll.left, scroll.top);
    }

    return scroll;
};

/**
 * Saves a given valid scroll position object, if not passed saves the current body scroll position
 * @public
 * @param {Object} [scroll] The given scroll position object to be saved
 * @returns {Object|null} The given value is returned if is a valid scroll position object, otherwise null is returned
 */
export const saveScrollPosition = (scroll) => {
    if (scroll === undefined) {
        scroll = {
            top: window.pageYOffset,
            left: window.pageXOffset
        };
    }

    scrollSaving = formatScrollPosition(scroll);

    return scrollSaving;
};

/**
 * Returns the currently saved scroll position object
 * @public
 * @returns {Object|null} The currently saved scroll position object, null if nothing was saved
 */
export const getSavedScrollPosition = () => scrollSaving;

/**
 * Returns the currently saved scroll position object
 * @public
 * @returns {Object|null} The currently saved scroll position object, null if nothing was saved
 */
export const clearSavedScrollPosition = () => (scrollSaving = null);
