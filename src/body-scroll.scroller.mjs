/**
 *
 */
let scroll = {
    x: 0,
    y: 0
};

/**
 *
 */
export const getScrollPosition = () =>
    new Object({
        x: window.scrollX,
        y: window.scrollY
    });

/**
 *
 */
export const saveScrollPosition = () => (scroll = getScrollPosition());

/**
 *
 */
export const restoreScrollPosition = () => window.scrollTo(scroll.x, scroll.y);
