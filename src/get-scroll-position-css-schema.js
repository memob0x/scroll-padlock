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
    '--scroll-padlock-scroll-top',
    scroll.top,
  ],

  [
    '--scroll-padlock-scroll-left',
    scroll.left,
  ],
];

export default getScrollPositionCssSchema;
