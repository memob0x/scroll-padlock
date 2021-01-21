// Mainly strings compositions constants
export const LAYOUT_WIDTH_CASE = 'Width';
export const LAYOUT_HEIGHT_CASE = 'Height';
export const LAYOUT_WIDTH = LAYOUT_WIDTH_CASE.toLowerCase();
export const LAYOUT_HEIGHT = LAYOUT_HEIGHT_CASE.toLowerCase();
export const LAYOUT_OUTER = 'outer';
export const LAYOUT_INNER = 'inner';
const LAYOUT_CLIENT = 'client';
const LAYOUT_SCROLLBAR = 'scrollbar';
export const LAYOUT_SCROLL = 'scroll';
const LAYOUT_HEIGHT_CLIENT = LAYOUT_CLIENT + LAYOUT_HEIGHT_CASE;
const LAYOUT_WIDTH_CLIENT = LAYOUT_CLIENT + LAYOUT_WIDTH_CASE;

// Dimensions object properties names
export const LAYOUT_WIDTH_OUTER = LAYOUT_OUTER + LAYOUT_WIDTH_CASE;
export const LAYOUT_WIDTH_INNER = LAYOUT_INNER + LAYOUT_WIDTH_CASE;
export const LAYOUT_WIDTH_SCROLL = LAYOUT_SCROLL + LAYOUT_WIDTH_CASE;
export const LAYOUT_HEIGHT_OUTER = LAYOUT_OUTER + LAYOUT_HEIGHT_CASE;
export const LAYOUT_HEIGHT_INNER = LAYOUT_INNER + LAYOUT_HEIGHT_CASE;
export const LAYOUT_HEIGHT_SCROLL = LAYOUT_SCROLL + LAYOUT_HEIGHT_CASE;
export const LAYOUT_SCROLLBAR_WIDTH = LAYOUT_SCROLLBAR + LAYOUT_WIDTH_CASE;
export const LAYOUT_SCROLLBAR_HEIGHT = LAYOUT_SCROLLBAR + LAYOUT_HEIGHT_CASE;

/**
 * Gets a given element or browser dimensions
 * @param {HTMLElement} element The given element whose dimensions need to be retrieved
 * @param {Window|HTMLElement} scroller The given scrollable used to retrieve some dimensions when the given element is global (page)
 * @returns {Object} The given element dimensions as an object ({ top, left })
 */
export const getLayout = (element, scroller) => {
    // Implying global (page) element...
    let outer = {
        [LAYOUT_WIDTH]: scroller?.[LAYOUT_WIDTH_INNER],
        [LAYOUT_HEIGHT]: scroller?.[LAYOUT_HEIGHT_INNER]
    };

    // ...falling back to html element
    if( !outer[LAYOUT_WIDTH] && !outer[LAYOUT_HEIGHT] ){
        outer = element?.getBoundingClientRect() ?? {};
    }

    // Element area with scrollbars
    const outerWidth = outer?.[LAYOUT_WIDTH] ?? 0;
    const outerHeight = outer?.[LAYOUT_HEIGHT] ?? 0;

    // Element area without scrollbars
    const innerWidth = element?.[LAYOUT_WIDTH_CLIENT] ?? 0;
    const innerHeight = element?.[LAYOUT_HEIGHT_CLIENT] ?? 0;

    // Returns the final object
    return {
        // Element area with scrollbars
        [LAYOUT_WIDTH_OUTER]: outerWidth,
        [LAYOUT_HEIGHT_OUTER]: outerHeight,
        
        // Element area without scrollbars
        [LAYOUT_WIDTH_INNER]: innerWidth,
        [LAYOUT_HEIGHT_INNER]: innerHeight,

        // Element content area
        [LAYOUT_WIDTH_SCROLL]: element?.[LAYOUT_WIDTH_SCROLL] ?? 0,
        [LAYOUT_HEIGHT_SCROLL]: element?.[LAYOUT_HEIGHT_SCROLL] ?? 0,

        // Element scrollbar size
        [LAYOUT_SCROLLBAR_WIDTH]: outerWidth - innerWidth,
        [LAYOUT_SCROLLBAR_HEIGHT]: outerHeight - innerHeight
    };
};
