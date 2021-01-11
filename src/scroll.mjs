/**
 * Gets a given element or browser scroll position
 * @param {Window|HTMLElement} element The given element whose scroll position needs to be retrieved
 * @returns {Object} The given element scroll position as an object ({ top, left })
 */
export const getScrollPosition = element => ({
    // NOTE: assuming it's page case by checking scrollY|scrollX and pageYOffset|pageXOffset properties first (available for window only)
    // and then checking scrollTop|scrollLeft (available for html elements only)
    top: element?.scrollY ?? element?.pageYOffset ?? element?.scrollTop ?? 0,
    left: element?.scrollX ?? element?.pageXOffset ?? element?.scrollLeft ?? 0
});

/**
 * Scrolls a given element or window to a given scroll position
 * @param {Window|HTMLElement} element The scroller element
 * @param {Object} scroll The scroll object to scroll to
 * @returns {Object} The given scroll object
 */
export const scrollTo = (element, scroll) => {
    // Scrolls element to coordinates, native API
    element?.scrollTo(scroll?.left, scroll?.top);

    // Returns the given scroll coordinates
    return scroll;
};
