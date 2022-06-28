import {
  STR_WORD_PAGE,
  STR_WORD_SCROLL,
  STR_CHAR_UPPER_Y,
  STR_CHAR_UPPER_X,
  STR_WORD_CAP_OFFSET,
  STR_WORD_CAP_TOP,
  STR_WORD_CAP_LEFT,
} from './constants';

import {
  STR_WORD_TOP,
  STR_WORD_LEFT,
} from './constants-computed';

/**
 * Gets a given element or browser scroll position.
 *
 * @param {Window|HTMLElement} element - The given element whose scroll
 * position needs to be retrieved.
 * @returns {object} The given element scroll position as an object ({ top, left }).
 */
const getScrollPosition = (element) => ({
  // NOTE: assuming it's page case by checking scrollY|scrollX and
  // pageYOffset|pageXOffset properties first (available for window only)
  // and then checking scrollTop|scrollLeft (available for html elements only)
  [STR_WORD_TOP]: element?.[STR_WORD_SCROLL + STR_CHAR_UPPER_Y]
    || element?.[STR_WORD_PAGE + STR_CHAR_UPPER_Y + STR_WORD_CAP_OFFSET]
    || element?.[STR_WORD_SCROLL + STR_WORD_CAP_TOP]
    || 0,

  [STR_WORD_LEFT]: element?.[STR_WORD_SCROLL + STR_CHAR_UPPER_X]
    || element?.[STR_WORD_PAGE + STR_CHAR_UPPER_X + STR_WORD_CAP_OFFSET]
    || element?.[STR_WORD_SCROLL + STR_WORD_CAP_LEFT]
    || 0,
});

export default getScrollPosition;
