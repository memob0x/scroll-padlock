/** @typedef {import('./types.js').CustomProperties} CustomProperties */

const { round, min, max } = Math;

/**
 * Formats the given dimensions and scroll information into CSS variables.
 * @param {CustomProperties} customProperties -
 * The dimensions and scroll information.
 * @returns {string} The formatted CSS variables.
 */
export default function getCSSCustomProperties(customProperties) {
  const {
    offsetWidth,

    offsetHeight,

    clientWidth,

    clientHeight,

    scrollHeight,

    scrollWidth,

    scrollTop,

    scrollLeft,
  } = customProperties;

  return `--offset-width: ${round(offsetWidth)}px;
--offset-height: ${round(offsetHeight)}px;
--client-width: ${round(min(offsetWidth, clientWidth))}px;
--client-height: ${round(min(offsetHeight, clientHeight))}px;
--scroll-width: ${round(scrollWidth)}px;
--scroll-height: ${round(scrollHeight)}px;
--scrollbar-width: ${round(max(0, offsetWidth - clientWidth))}px;
--scrollbar-height: ${round(max(0, offsetHeight - clientHeight))}px;
--scroll-top: ${round(scrollTop)}px;
--scroll-left: ${round(scrollLeft)}px;`;
}
