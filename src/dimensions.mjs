//
export const DIMENSIONS_WIDTH_CASE = 'Width';
export const DIMENSIONS_HEIGHT_CASE = 'Height';

//
export const DIMENSIONS_WIDTH = DIMENSIONS_WIDTH_CASE.toLowerCase();
export const DIMENSIONS_HEIGHT = DIMENSIONS_HEIGHT_CASE.toLowerCase();

export const DIMENSIONS_OUTER = 'outer';
export const DIMENSIONS_INNER = 'inner';
export const DIMENSIONS_SCROLL = 'scroll';

//
export const DIMENSIONS_WIDTH_OUTER = DIMENSIONS_OUTER + DIMENSIONS_WIDTH_CASE;
export const DIMENSIONS_WIDTH_INNER = DIMENSIONS_INNER + DIMENSIONS_WIDTH_CASE;
export const DIMENSIONS_WIDTH_SCROLL = DIMENSIONS_SCROLL + DIMENSIONS_WIDTH_CASE;
export const DIMENSIONS_HEIGHT_OUTER = DIMENSIONS_OUTER + DIMENSIONS_HEIGHT_CASE;
export const DIMENSIONS_HEIGHT_INNER = DIMENSIONS_INNER + DIMENSIONS_HEIGHT_CASE;
export const DIMENSIONS_HEIGHT_SCROLL = DIMENSIONS_SCROLL + DIMENSIONS_HEIGHT_CASE;

/**
 * 
 * @param {HTMLElement} element
 * @param {Window|HTMLElement} scroller
 * @returns {Object}
 */
export const getDimensions = (element, scroller) => {
    // Retrives all the involved values
    const { clientWidth, clientHeight, offsetWidth, offsetHeight, scrollWidth, scrollHeight } = element ?? {};
    const { innerWidth, innerHeight } = scroller ?? element ?? {};

    // Implying element is global (page) and fallbacking to html element
    const outerWidth = innerWidth ?? offsetWidth;
    const outerHeight = innerHeight ?? offsetHeight;

    //
    return {
        // frame dimensions width scrollbars
        [DIMENSIONS_WIDTH_OUTER]: outerWidth,
        [DIMENSIONS_HEIGHT_OUTER]: outerHeight,
        
        // frame dimensions without scrollbars
        [DIMENSIONS_WIDTH_INNER]: clientWidth,
        [DIMENSIONS_HEIGHT_INNER]: clientHeight,

        // content dimensions
        [DIMENSIONS_WIDTH_SCROLL]: scrollWidth,
        [DIMENSIONS_HEIGHT_SCROLL]: scrollHeight
    };
};
