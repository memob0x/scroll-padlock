import './typedef.js';

/**
 * Gets the given layout dimensions object as css rules.
 * @param {LayoutDimensions} layout - The layout dimensions objects to be set in css variables.
 * @returns {string} The styling rule css string.
 * @public
 * @example
 * getLayoutDimensionsCssRules({ outerWidth: 10 }); // --> `
 * // --scroll-padlock-outer-width: 10px;
 * // --scroll-padlock-outer-height: 0px;
 * // --scroll-padlock-inner-width: 0px;
 * // --scroll-padlock-inner-height: 0px;
 * // --scroll-padlock-scroll-width: 0px;
 * // --scroll-padlock-scroll-height: 0px;
 * // --scroll-padlock-scrollbar-width: 0px;
 * // --scroll-padlock-scrollbar-height: 0px;`
 */
const getLayoutDimensionsCssRules = (
  layout,
) => `--scroll-padlock-outer-width: ${Math.round(layout?.outerWidth || 0)}px;
--scroll-padlock-outer-height: ${Math.round(layout?.outerHeight || 0)}px;
--scroll-padlock-inner-width: ${Math.round(layout?.innerWidth || 0)}px;
--scroll-padlock-inner-height: ${Math.round(layout?.innerHeight || 0)}px;
--scroll-padlock-scroll-width: ${Math.round(layout?.scrollWidth || 0)}px;
--scroll-padlock-scroll-height: ${Math.round(layout?.scrollHeight || 0)}px;
--scroll-padlock-scrollbar-width: ${Math.round(layout?.scrollbarWidth || 0)}px;
--scroll-padlock-scrollbar-height: ${Math.round(layout?.scrollbarHeight || 0)}px;`;

export default getLayoutDimensionsCssRules;
