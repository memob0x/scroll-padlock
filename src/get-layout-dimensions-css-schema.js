import './typedef';

/**
 * Gets the given layout dimensions object as css rules schema.
 *
 * @public
 * @example getLayoutDimensionsCssSchema({ width: 10, height: 20 }); // --> [
 * //  ['--outer-width', 10],
 * //  ['--outer-height', 20]
 * // ]).
 * @param {Layout} layout - The layout dimensions objects to be set in css variables.
 * @returns {CssRulesSchema} The styling rule css schema.
 */
const getLayoutDimensionsCssSchema = (layout) => [
  [
    '--scroll-padlock-outer-width',
    layout?.outerWidth || 0,
  ],

  [
    '--scroll-padlock-outer-height',
    layout?.outerHeight || 0,
  ],

  [
    '--scroll-padlock-inner-width',
    layout?.innerWidth || 0,
  ],

  [
    '--scroll-padlock-inner-height',
    layout?.innerHeight || 0,
  ],

  [
    '--scroll-padlock-scroll-width',
    layout?.scrollWidth || 0,
  ],

  [
    '--scroll-padlock-scroll-height',
    layout?.scrollHeight || 0,
  ],

  [
    '--scroll-padlock-scrollbar-width',
    layout?.scrollbarWidth || 0,
  ],

  [
    '--scroll-padlock-scrollbar-height',
    layout?.scrollbarHeight || 0,
  ],
];

export default getLayoutDimensionsCssSchema;
