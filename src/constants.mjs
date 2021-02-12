import joinHyphen from './join-array-of-strings-with-hyphen.mjs';

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
export const LAYOUT_HEIGHT_CLIENT = LAYOUT_CLIENT + LAYOUT_HEIGHT_CASE;
export const LAYOUT_WIDTH_CLIENT = LAYOUT_CLIENT + LAYOUT_WIDTH_CASE;

// Dimensions object properties names
export const LAYOUT_WIDTH_OUTER = LAYOUT_OUTER + LAYOUT_WIDTH_CASE;
export const LAYOUT_WIDTH_INNER = LAYOUT_INNER + LAYOUT_WIDTH_CASE;
export const LAYOUT_WIDTH_SCROLL = LAYOUT_SCROLL + LAYOUT_WIDTH_CASE;
export const LAYOUT_HEIGHT_OUTER = LAYOUT_OUTER + LAYOUT_HEIGHT_CASE;
export const LAYOUT_HEIGHT_INNER = LAYOUT_INNER + LAYOUT_HEIGHT_CASE;
export const LAYOUT_HEIGHT_SCROLL = LAYOUT_SCROLL + LAYOUT_HEIGHT_CASE;
export const LAYOUT_SCROLLBAR_WIDTH = LAYOUT_SCROLLBAR + LAYOUT_WIDTH_CASE;
export const LAYOUT_SCROLLBAR_HEIGHT = LAYOUT_SCROLLBAR + LAYOUT_HEIGHT_CASE;

// Scroll object properties names
export const SCROLL_TOP = 'top';
export const SCROLL_LEFT = 'left';

// Common global event names
export const EVENT_NAME_SCROLL = 'scroll';
export const EVENT_NAME_RESIZE = 'resize';

// Common global time values
export const RESIZE_DEBOUNCE_INTERVAL_MS = 250;
export const SCROLL_DEBOUNCE_INTERVAL_MS = 125;

// DOM naming part (prefix, suffix etc...)
export const DOM_BASE_NAME = 'scroll-padlock';

// Data attribute name
export const DATA_ATTR_NAME = joinHyphen('data', DOM_BASE_NAME);

// CSS variables names
const CSS_VAR_PREFIX = '--';
const CSS_VAR_SCROLL_PREFIX = 'scroll';
export const CSS_VAR_NAME_POSITION_TOP = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, CSS_VAR_SCROLL_PREFIX, SCROLL_TOP);
export const CSS_VAR_NAME_POSITION_LEFT = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, CSS_VAR_SCROLL_PREFIX, SCROLL_LEFT);
const CSS_VAR_SCROLLBAR_PREFIX = 'scrollbar';
export const CSS_VAR_NAME_SCROLLBAR_WIDTH = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, CSS_VAR_SCROLLBAR_PREFIX, LAYOUT_WIDTH);
export const CSS_VAR_NAME_SCROLLBAR_HEIGHT = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, CSS_VAR_SCROLLBAR_PREFIX, LAYOUT_HEIGHT);
export const CSS_VAR_NAME_WIDTH_OUTER = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, LAYOUT_OUTER, LAYOUT_WIDTH);
export const CSS_VAR_NAME_HEIGHT_OUTER = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, LAYOUT_OUTER, LAYOUT_HEIGHT);
export const CSS_VAR_NAME_WIDTH_INNER = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, LAYOUT_INNER, LAYOUT_WIDTH);
export const CSS_VAR_NAME_HEIGHT_INNER = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, LAYOUT_INNER, LAYOUT_HEIGHT);
export const CSS_VAR_NAME_WIDTH_SCROLL = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, LAYOUT_SCROLL, LAYOUT_WIDTH);
export const CSS_VAR_NAME_HEIGHT_SCROLL = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, LAYOUT_SCROLL, LAYOUT_HEIGHT);

// CSS variables value unit of measurement
export const CSS_VAR_UNIT_VALUE = 'px';

// Only-rule index
export const CSS_STYLE_SHEET_ONLY_RULE_INDEX = 0;

//
export const LISTENER_METHOD_ADD = 'add';
export const LISTENER_METHOD_REMOVE = 'remove';

//
export const STYLER_METHOD_ADD = LISTENER_METHOD_ADD;
export const STYLER_METHOD_REMOVE = LISTENER_METHOD_REMOVE;

// 
export const DEFAULT_CSS_CLASS_NAME = `${DOM_BASE_NAME}-locked`;
