import './typedef';

/**
 * Gets the given layout dimensions object as css rules.
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
 * @param {LayoutDimensions} layout - The layout dimensions objects to be set in css variables.
 * @returns {string} The styling rule css string.
 */
const getLayoutDimensionsCssRules = (layout) => `--scroll-padlock-outer-width: ${layout?.outerWidth || 0}px;
--scroll-padlock-outer-height: ${layout?.outerHeight || 0}px;
--scroll-padlock-inner-width: ${layout?.innerWidth || 0}px;
--scroll-padlock-inner-height: ${layout?.innerHeight || 0}px;
--scroll-padlock-scroll-width: ${layout?.scrollWidth || 0}px;
--scroll-padlock-scroll-height: ${layout?.scrollHeight || 0}px;
--scroll-padlock-scrollbar-width: ${layout?.scrollbarWidth || 0}px;
--scroll-padlock-scrollbar-height: ${layout?.scrollbarHeight || 0}px;`;

export default getLayoutDimensionsCssRules;
