import { DIMENSIONS_WIDTH, DIMENSIONS_HEIGHT, DIMENSIONS_HEIGHT_INNER, DIMENSIONS_HEIGHT_OUTER, DIMENSIONS_WIDTH_INNER, DIMENSIONS_WIDTH_OUTER } from './dimensions.mjs';

//
export const SCROLLBAR_WIDTH = DIMENSIONS_WIDTH;
export const SCROLLBAR_HEIGHT = DIMENSIONS_HEIGHT;

/**
 * 
 * @param {Object} dimensions
 * @returns {Object} The current vertical scrollbar width and the horizontal scrollbar height in px
 */
export const getScrollbarsGaps = dimensions => ({
    [SCROLLBAR_WIDTH]: dimensions[DIMENSIONS_WIDTH_OUTER] - dimensions[DIMENSIONS_WIDTH_INNER],
    [SCROLLBAR_HEIGHT]: dimensions[DIMENSIONS_HEIGHT_OUTER] - dimensions[DIMENSIONS_HEIGHT_INNER]
});
