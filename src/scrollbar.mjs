export const DEFAULT_SCROLLBAR = { horizontal: 0, vertical: 0 };

/**
 * Gets a given element current vertical scrollbar width size in px unit
 * @param {HTMLElement} element The given element whose scrollbar gaps need to be retrieved
 * @param {Window|HTMLElement} scroller
 * @returns {Object} The current vertical scrollbar width and the horizontal scrollbar height in px
 */
export const getScrollbarsGaps = (element, scroller) => {
    //
    const { clientWidth, clientHeight } = element;

    //
    let horizontal = scroller?.innerHeight - clientHeight;
    let vertical = scroller?.innerWidth - clientWidth;

    //
    if( isNaN(horizontal) || isNaN(vertical) ){
        horizontal = element?.offsetHeight - clientHeight;
        vertical = element?.offsetWidth - clientWidth;
    }

    //
    horizontal = horizontal ?? 0;
    vertical = vertical ?? 0;

    //
    return { horizontal, vertical };
};
