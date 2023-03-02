/**
 * Gets the given layout dimensions object as css rules schema.
 *
 * @public
 * @example getLayoutDimensionsCssSchema({ width: 10, height: 20 }); // --> [
 * //  ['--outer-width', 10],
 * //  ['--outer-height', 20]
 * // ]).
 * @param {object} layout - The layout dimensions objects to be set in css variables.
 * @returns {Array} The styling rule css schema.
 */
const getLayoutDimensionsCssSchema = (layout) => [
  [
    '--scroll-padlock-outer-width',
    layout.outerWidth,
  ],

  [
    '--scroll-padlock-outer-height',
    layout.outerHeight,
  ],

  [
    '--scroll-padlock-inner-width',
    layout.innerWidth,
  ],

  [
    '--scroll-padlock-inner-height',
    layout.innerHeight,
  ],

  [
    '--scroll-padlock-scroll-width',
    layout.scrollWidth,
  ],

  [
    '--scroll-padlock-scroll-height',
    layout.scrollHeight,
  ],

  [
    '--scroll-padlock-scrollbar-width',
    layout.scrollbarWidth,
  ],

  [
    '--scroll-padlock-scrollbar-height',
    layout.scrollbarHeight,
  ],
];

export default getLayoutDimensionsCssSchema;
