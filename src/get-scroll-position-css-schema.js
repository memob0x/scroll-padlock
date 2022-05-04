import {
  STR_KEBAB_DOUBLE_HYPHEN_PREFIX_POSITION_TOP,
  STR_KEBAB_DOUBLE_HYPHEN_PREFIX_POSITION_LEFT,
  STR_WORD_TOP,
  STR_WORD_LEFT,
} from './constants-computed';

/**
 * TODO:.
 *
 * @param {object} scroll - The scroll position to be set in css variables.
 * @returns {Array} The styling rule css string.
 */
const getScrollPositionCssSchema = (scroll) => [
  [
    STR_KEBAB_DOUBLE_HYPHEN_PREFIX_POSITION_TOP,
    scroll[STR_WORD_TOP],
  ],

  [
    STR_KEBAB_DOUBLE_HYPHEN_PREFIX_POSITION_LEFT,
    scroll[STR_WORD_LEFT],
  ],
];

export default getScrollPositionCssSchema;
