//
export const DEFAULT_SCROLL_POSITION = { top: 0, left: 0 };

/**
 * Gets a given element or browser scroll position
 * @param {Window|HTMLElement} element The given element whose scroll position needs to be retrieved
 * @returns {Object} The given element scroll position as an object ({ top, left })
 */
export const getScrollPosition = element => ({
    top: element?.pageYOffset ?? element?.scrollTop ?? 0,
    left: element?.pageXOffset ?? element?.scrollLeft ?? 0
});

/**
 * Scrolls a given element or window to a given scroll position
 * @param {Window|HTMLElement} element The scroller element
 * @param {Object} scroll The scroll object to scroll to
 * @returns {Object} The given scroll object
 */
export const scrollTo = (element, scroll) => {
    //
    element?.scrollTo(scroll?.left, scroll?.top);

    //
    return scroll;
};
