import {
    TOP,
    LEFT,
    PAGE,
    SCROLL,
    Y_UPPERCASE,
    X_UPPERCASE,
    OFFSET_CAPITALIZED,
    TOP_CAPITALIZED,
    LEFT_CAPITALIZED
} from './constants.mjs';

/**
 * Gets a given element or browser scroll position
 * @param {Window|HTMLElement} element The given element whose scroll position needs to be retrieved
 * @returns {Object} The given element scroll position as an object ({ top, left })
 */
export default element => ({
    // NOTE: assuming it's page case by checking scrollY|scrollX and pageYOffset|pageXOffset properties first (available for window only)
    // and then checking scrollTop|scrollLeft (available for html elements only)
    [TOP]: element?.[SCROLL + Y_UPPERCASE] ?? element?.[PAGE + Y_UPPERCASE + OFFSET_CAPITALIZED] ?? element?.[SCROLL + TOP_CAPITALIZED] ?? 0,
    [LEFT]: element?.[SCROLL + X_UPPERCASE] ?? element?.[PAGE + X_UPPERCASE + OFFSET_CAPITALIZED] ?? element?.[SCROLL + LEFT_CAPITALIZED] ?? 0
});
