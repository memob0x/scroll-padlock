/**
 * Gets a given element current vertical scrollbar width size in px unit
 * @param {HTMLElement} element The given element whose scrollbar gaps need to be retrieved
 * @param {Window|HTMLElement} scroller
 * @returns {Object} The current vertical scrollbar width and the horizontal scrollbar height in px
 */
export const getScrollbarsGaps = (element, scroller) => {
    // Retrives all the involved values
    const { clientWidth, clientHeight, offsetWidth, offsetHeight } = element ?? {};
    const { innerWidth, innerHeight } = scroller ?? {};

    // NOTE: assuming it's page case by checking innerHeight|innerWidth properties first (available for window only)
    // and then checking clientHeight|offsetWidth (available for html elements only)
    const horizontal = (innerHeight ?? offsetHeight) - clientHeight;
    const vertical = (innerWidth ?? offsetWidth) - clientWidth;

    // Returns scrollbars size
    return { horizontal, vertical };
};
