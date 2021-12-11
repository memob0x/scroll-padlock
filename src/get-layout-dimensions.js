import {
  WIDTH,
  INNER_WIDTH,
  HEIGHT,
  INNER_HEIGHT,
  CLIENT_WIDTH,
  CLIENT_HEIGHT,
  OUTER_WIDTH,
  OUTER_HEIGHT,
  SCROLL_WIDTH,
  SCROLL_HEIGHT,
  SCROLLBAR_WIDTH,
  SCROLLBAR_HEIGHT,
} from './constants';

/**
 * Gets a given element or browser dimensions
 * @param {HTMLElement} element The given element whose dimensions need to be retrieved
 * @param {Window|HTMLElement} scroller The given scrollable used to retrieve some
 * dimensions when the given element is global (page)
 * @returns {Object} The given element dimensions as an object ({ top, left })
 */
export default (element, scroller) => {
  // Implying global (page) element...
  let outer = {
    [WIDTH]: scroller?.[INNER_WIDTH],
    [HEIGHT]: scroller?.[INNER_HEIGHT],
  };

  // ...falling back to html element
  if (!outer[WIDTH] && !outer[HEIGHT]) {
    outer = element?.getBoundingClientRect() ?? {};
  }

  // Element area with scrollbars
  const outerWidth = outer?.[WIDTH] ?? 0;
  const outerHeight = outer?.[HEIGHT] ?? 0;

  // Element area without scrollbars
  const innerWidth = element?.[CLIENT_WIDTH] ?? 0;
  const innerHeight = element?.[CLIENT_HEIGHT] ?? 0;

  // Returns the final object
  return {
    // Element area with scrollbars
    [OUTER_WIDTH]: outerWidth,
    [OUTER_HEIGHT]: outerHeight,

    // Element area without scrollbars
    [INNER_WIDTH]: Math.min(outerWidth, innerWidth),
    [INNER_HEIGHT]: Math.min(outerHeight, innerHeight),

    // Element content area
    [SCROLL_WIDTH]: element?.[SCROLL_WIDTH] ?? 0,
    [SCROLL_HEIGHT]: element?.[SCROLL_HEIGHT] ?? 0,

    // Element scrollbar size
    [SCROLLBAR_WIDTH]: Math.max(0, outerWidth - innerWidth),
    [SCROLLBAR_HEIGHT]: Math.max(0, outerHeight - innerHeight),
  };
};
