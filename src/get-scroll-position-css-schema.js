import {
  STR_KEBAB_DOUBLE_HYPHEN_PREFIX_POSITION_TOP,
  STR_KEBAB_DOUBLE_HYPHEN_PREFIX_POSITION_LEFT,
  STR_WORD_TOP,
  STR_WORD_LEFT,
} from './constants-computed';

/**
 * Gets the given scroll position object as css rules schema.
 *
 * @public
 * @example getScrollPositionCssSchema({ top: 10, left: 20 }); // --> [
 * //  ['--position-top', 10],
 * //  ['--position-left', 20]
 * // ]).
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
