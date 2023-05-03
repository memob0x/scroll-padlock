import './typedef';

/**
 * Gets the given scroll position object as css rules.
 * @public
 * @example
 * getScrollPositionCssRules({ top: 10 }); // --> `
 * // --scroll-padlock-scroll-top: 10px;
 * // --scroll-padlock-scroll-left: 0px;`
 * @param {ScrollPosition} scroll - The scroll position
 * to be set in css variables.
 * @returns {string} The styling rule css string.
 */
const getScrollPositionCssRules = (scroll) => `--scroll-padlock-scroll-top: ${scroll?.top || 0}px;
--scroll-padlock-scroll-left: ${scroll?.left || 0}px;`;

export default getScrollPositionCssRules;
