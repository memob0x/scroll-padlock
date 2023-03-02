/**
 * Gets a given element or browser dimensions.
 *
 * @public
 * @example
 * getLayoutDimensions(document.querySelector('div')) // --> { outerHeight: 123, ... }
 * @param {HTMLElement} element - The given element whose dimensions need to be retrieved.
 * @param {Window|HTMLElement} scroller - The given scrollable used to retrieve some
 * dimensions when the given element is global (page).
 * @returns {object} The given element dimensions as an object ({ top, left }).
 */
const getLayoutDimensions = (element, scroller) => {
  // Implying global (page) element...
  let outer = {
    width: scroller?.innerWidth,
    height: scroller?.innerHeight,
  };

  // ...falling back to html element
  if (!outer.width && !outer.height) {
    outer = element?.getBoundingClientRect() || {};
  }

  // Element area with scrollbars
  const outerWidth = outer?.width || 0;
  const outerHeight = outer?.height || 0;

  // Element area without scrollbars
  const innerWidth = element?.clientWidth || 0;
  const innerHeight = element?.clientHeight || 0;

  // Returns the final object
  return {
    // Element area with scrollbars
    outerWidth,
    outerHeight,

    // Element area without scrollbars
    innerWidth: Math.min(outerWidth, innerWidth),
    innerHeight: Math.min(outerHeight, innerHeight),

    // Element content area
    scrollWidth: element?.scrollWidth || 0,
    scrollHeight: element?.scrollHeight || 0,

    // Element scrollbar size
    scrollbarWidth: Math.max(0, outerWidth - innerWidth),
    scrollbarHeight: Math.max(0, outerHeight - innerHeight),
  };
};

export default getLayoutDimensions;
