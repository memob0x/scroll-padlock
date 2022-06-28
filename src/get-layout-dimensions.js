import {
  STR_WORD_WIDTH,
  STR_WORD_HEIGHT,
  STR_CAMEL_INNER_WIDTH,
  STR_CAMEL_INNER_HEIGHT,
  STR_CAMEL_CLIENT_WIDTH,
  STR_CAMEL_CLIENT_HEIGHT,
  STR_CAMEL_OUTER_WIDTH,
  STR_CAMEL_OUTER_HEIGHT,
  STR_CAMEL_SCROLL_WIDTH,
  STR_CAMEL_SCROLL_HEIGHT,
  STR_CAMEL_SCROLLBAR_WIDTH,
  STR_CAMEL_SCROLLBAR_HEIGHT,
} from './constants-computed';

/**
 * Gets a given element or browser dimensions.
 *
 * @param {HTMLElement} element - The given element whose dimensions need to be retrieved.
 * @param {Window|HTMLElement} scroller - The given scrollable used to retrieve some
 * dimensions when the given element is global (page).
 * @returns {object} The given element dimensions as an object ({ top, left }).
 */
const getLayoutDimensions = (element, scroller) => {
  // Implying global (page) element...
  let outer = {
    [STR_WORD_WIDTH]: scroller?.[STR_CAMEL_INNER_WIDTH],
    [STR_WORD_HEIGHT]: scroller?.[STR_CAMEL_INNER_HEIGHT],
  };

  // ...falling back to html element
  if (!outer[STR_WORD_WIDTH] && !outer[STR_WORD_HEIGHT]) {
    outer = element?.getBoundingClientRect() || {};
  }

  // Element area with scrollbars
  const outerWidth = outer?.[STR_WORD_WIDTH] || 0;
  const outerHeight = outer?.[STR_WORD_HEIGHT] || 0;

  // Element area without scrollbars
  const innerWidth = element?.[STR_CAMEL_CLIENT_WIDTH] || 0;
  const innerHeight = element?.[STR_CAMEL_CLIENT_HEIGHT] || 0;

  // Returns the final object
  return {
    // Element area with scrollbars
    [STR_CAMEL_OUTER_WIDTH]: outerWidth,
    [STR_CAMEL_OUTER_HEIGHT]: outerHeight,

    // Element area without scrollbars
    [STR_CAMEL_INNER_WIDTH]: Math.min(outerWidth, innerWidth),
    [STR_CAMEL_INNER_HEIGHT]: Math.min(outerHeight, innerHeight),

    // Element content area
    [STR_CAMEL_SCROLL_WIDTH]: element?.[STR_CAMEL_SCROLL_WIDTH] || 0,
    [STR_CAMEL_SCROLL_HEIGHT]: element?.[STR_CAMEL_SCROLL_HEIGHT] || 0,

    // Element scrollbar size
    [STR_CAMEL_SCROLLBAR_WIDTH]: Math.max(0, outerWidth - innerWidth),
    [STR_CAMEL_SCROLLBAR_HEIGHT]: Math.max(0, outerHeight - innerHeight),
  };
};

export default getLayoutDimensions;
