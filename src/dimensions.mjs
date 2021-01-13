// Mainly strings compositions constants
export const DIMENSIONS_WIDTH_CASE = 'Width';
export const DIMENSIONS_HEIGHT_CASE = 'Height';
export const DIMENSIONS_WIDTH = DIMENSIONS_WIDTH_CASE.toLowerCase();
export const DIMENSIONS_HEIGHT = DIMENSIONS_HEIGHT_CASE.toLowerCase();
export const DIMENSIONS_OUTER = 'outer';
export const DIMENSIONS_INNER = 'inner';
const DIMENSIONS_CLIENT = 'client';
export const DIMENSIONS_SCROLL = 'scroll';
const DIMENSIONS_HEIGHT_CLIENT = DIMENSIONS_CLIENT + DIMENSIONS_HEIGHT_CASE;
const DIMENSIONS_WIDTH_CLIENT = DIMENSIONS_CLIENT + DIMENSIONS_WIDTH_CASE;

// Dimensions object properties names
export const DIMENSIONS_WIDTH_OUTER = DIMENSIONS_OUTER + DIMENSIONS_WIDTH_CASE;
export const DIMENSIONS_WIDTH_INNER = DIMENSIONS_INNER + DIMENSIONS_WIDTH_CASE;
export const DIMENSIONS_WIDTH_SCROLL = DIMENSIONS_SCROLL + DIMENSIONS_WIDTH_CASE;
export const DIMENSIONS_HEIGHT_OUTER = DIMENSIONS_OUTER + DIMENSIONS_HEIGHT_CASE;
export const DIMENSIONS_HEIGHT_INNER = DIMENSIONS_INNER + DIMENSIONS_HEIGHT_CASE;
export const DIMENSIONS_HEIGHT_SCROLL = DIMENSIONS_SCROLL + DIMENSIONS_HEIGHT_CASE;

/**
 * Gets a given element or browser dimensions
 * @param {HTMLElement} element The given element whose dimensions need to be retrieved
 * @param {Window|HTMLElement} scroller The given scrollable used to retrieve some dimensions when the given element is global (page)
 * @returns {Object} The given element dimensions as an object ({ top, left })
 */
export const getDimensions = (element, scroller) => {
    // Implying global (page) element...
    let outer = {
        [DIMENSIONS_WIDTH]: scroller[DIMENSIONS_WIDTH_INNER],
        [DIMENSIONS_HEIGHT]: scroller[DIMENSIONS_HEIGHT_INNER]
    };

    // ...falling back to html element
    if( !outer[DIMENSIONS_WIDTH] && !outer[DIMENSIONS_HEIGHT] ){
        outer = element.getBoundingClientRect();
    }

    // Returns the final object
    return {
        // frame dimensions with scrollbars
        [DIMENSIONS_WIDTH_OUTER]: outer[DIMENSIONS_WIDTH],
        [DIMENSIONS_HEIGHT_OUTER]: outer[DIMENSIONS_HEIGHT],
        
        // frame dimensions without scrollbars
        [DIMENSIONS_WIDTH_INNER]: element[DIMENSIONS_WIDTH_CLIENT],
        [DIMENSIONS_HEIGHT_INNER]: element[DIMENSIONS_HEIGHT_CLIENT],

        // content dimensions
        [DIMENSIONS_WIDTH_SCROLL]: element[DIMENSIONS_WIDTH_SCROLL],
        [DIMENSIONS_HEIGHT_SCROLL]: element[DIMENSIONS_HEIGHT_SCROLL]
    };
};
