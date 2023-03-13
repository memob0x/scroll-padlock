import './typedef';

/**
 * Gets a given element or browser scroll position.
 *
 * @public
 * @example
 * getScrollPosition(document.queryselector('div')); // --> { top: 123, left: 345 }
 * @param {Window|HTMLElement} element - The given element whose scroll
 * position needs to be retrieved.
 * @returns {ScrollPosition} The given element scroll position
 * as an object ({ top, left }).
 */
const getScrollPosition = (element) => ({
  // NOTE: assuming it's page case by checking scrollY|scrollX and
  // pageYOffset|pageXOffset properties first (available for window only)
  // and then checking scrollTop|scrollLeft (available for html elements only)
  top: element?.scrollY
    || element?.pageYOffset
    || element?.scrollTop
    || 0,

  left: element?.scrollX
    || element?.pageXOffset
    || element?.scrollLeft
    || 0,
});

export default getScrollPosition;
