// Mainly strings composition constants
export const HYPHEN = '-';
export const OUTER = 'outer';
export const INNER = 'inner';
export const CLIENT = 'client';
export const SCROLLBAR = 'scrollbar';
export const SCROLL = 'scroll';
export const RESIZE = 'resize';
export const WIDTH_CAPITALIZED = 'Width';
export const HEIGHT_CAPITALIZED = 'Height';
export const Y_UPPERCASE = 'Y';
export const X_UPPERCASE = 'X';
export const OFFSET_CAPITALIZED = 'Offset';
export const TOP_CAPITALIZED = 'Top';
export const LEFT_CAPITALIZED = 'Left';
export const PAGE = 'page';
export const CSS_VAR_PREFIX = HYPHEN + HYPHEN;

// Common global time values
export const TIME_MS_DEBOUNCE_RESIZE = 250;
export const TIME_MS_DEBOUNCE_SCROLL = 125;

// Universal add/remove interfaces methods names
export const ADD = 'add';
export const REMOVE = 'remove';

// DOM constants
export const DOM_BASE_NAME = SCROLL + HYPHEN + 'padlock';
export const DOM_DATA_ATTRIBUTE_NAME = 'data' + HYPHEN + DOM_BASE_NAME;

/**
 * Turns a string lowercase
 * @param {string} The given string
 * @returns {String} The output lowercase string
 */
const lowercase = string => string.toLowerCase();

// Layout properties names
export const TOP = lowercase(TOP_CAPITALIZED);
export const LEFT = lowercase(LEFT_CAPITALIZED);
export const WIDTH = lowercase(WIDTH_CAPITALIZED);
export const HEIGHT = lowercase(HEIGHT_CAPITALIZED);
export const CLIENT_WIDTH = CLIENT + WIDTH_CAPITALIZED;
export const CLIENT_HEIGHT = CLIENT + HEIGHT_CAPITALIZED;
export const OUTER_WIDTH = OUTER + WIDTH_CAPITALIZED;
export const OUTER_HEIGHT = OUTER + HEIGHT_CAPITALIZED;
export const INNER_WIDTH = INNER + WIDTH_CAPITALIZED;
export const INNER_HEIGHT = INNER + HEIGHT_CAPITALIZED;
export const SCROLL_WIDTH = SCROLL + WIDTH_CAPITALIZED;
export const SCROLL_HEIGHT = SCROLL + HEIGHT_CAPITALIZED;
export const SCROLLBAR_WIDTH = SCROLLBAR + WIDTH_CAPITALIZED;
export const SCROLLBAR_HEIGHT = SCROLLBAR + HEIGHT_CAPITALIZED;

// CSS variables names
export const CSS_VAR_NAME_POSITION_TOP = CSS_VAR_PREFIX + DOM_BASE_NAME + HYPHEN + SCROLL + HYPHEN + TOP;
export const CSS_VAR_NAME_POSITION_LEFT = CSS_VAR_PREFIX + DOM_BASE_NAME + HYPHEN + SCROLL + HYPHEN + LEFT;
export const CSS_VAR_NAME_SCROLLBAR_WIDTH = CSS_VAR_PREFIX + DOM_BASE_NAME + HYPHEN + SCROLLBAR + HYPHEN + WIDTH;
export const CSS_VAR_NAME_SCROLLBAR_HEIGHT = CSS_VAR_PREFIX + DOM_BASE_NAME + HYPHEN + SCROLLBAR + HYPHEN + HEIGHT;
export const CSS_VAR_NAME_OUTER_WIDTH = CSS_VAR_PREFIX + DOM_BASE_NAME + HYPHEN + OUTER + HYPHEN + WIDTH;
export const CSS_VAR_NAME_OUTER_HEIGHT = CSS_VAR_PREFIX + DOM_BASE_NAME + HYPHEN + OUTER + HYPHEN + HEIGHT;
export const CSS_VAR_NAME_INNER_WIDTH = CSS_VAR_PREFIX + DOM_BASE_NAME + HYPHEN + INNER + HYPHEN + WIDTH;
export const CSS_VAR_NAME_INNER_HEIGHT = CSS_VAR_PREFIX + DOM_BASE_NAME + HYPHEN + INNER + HYPHEN + HEIGHT;
export const CSS_VAR_NAME_SCROLL_WIDTH = CSS_VAR_PREFIX + DOM_BASE_NAME + HYPHEN + SCROLL + HYPHEN + WIDTH;
export const CSS_VAR_NAME_SCROLL_HEIGHT = CSS_VAR_PREFIX + DOM_BASE_NAME + HYPHEN + SCROLL + HYPHEN + HEIGHT;
