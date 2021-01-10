export const DEFAULT_SCROLLBAR = { horizontal: 0, vertical: 0 };

/**
 * Gets a given element current vertical scrollbar width size in px unit
 * @param {HTMLElement} element The given element whose scrollbar gaps need to be retrieved
 * @param {Window|HTMLElement} scroller
 * @returns {Object} The current vertical scrollbar width and the horizontal scrollbar height in px
 */
export const getScrollbarsGaps = (element, scroller) => {
    //
    const { clientWidth, clientHeight, offsetWidth, offsetHeight } = element ?? {};
    const { innerWidth, innerHeight } = scroller ?? {};

    //
    const horizontal = (innerHeight ?? offsetHeight) - clientHeight;
    const vertical = (innerWidth ?? offsetWidth) - clientWidth;

    //
    return { horizontal, vertical };
};
