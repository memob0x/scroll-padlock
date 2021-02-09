import {
    SCROLL_TOP,
    SCROLL_LEFT
} from './constants.mjs';

/**
 * Gets a given element or browser scroll position
 * @param {Window|HTMLElement} element The given element whose scroll position needs to be retrieved
 * @returns {Object} The given element scroll position as an object ({ top, left })
 */
export default element => ({
    // NOTE: assuming it's page case by checking scrollY|scrollX and pageYOffset|pageXOffset properties first (available for window only)
    // and then checking scrollTop|scrollLeft (available for html elements only)
    [SCROLL_TOP]: element?.scrollY ?? element?.pageYOffset ?? element?.scrollTop ?? 0,
    [SCROLL_LEFT]: element?.scrollX ?? element?.pageXOffset ?? element?.scrollLeft ?? 0
});
