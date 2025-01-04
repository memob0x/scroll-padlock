/** @typedef {import('./types.js').ComputedLayout} ComputedLayout */

/**
 * Formats the given dimensions and scroll information into CSS variables.
 * @param {ComputedLayout} computedLayout - The dimensions and scroll information.
 * @returns {string} The formatted CSS variables.
 */
export default function getCSSCustomProperties({
  offsetWidth,

  offsetHeight,

  clientWidth,

  clientHeight,

  scrollHeight,

  scrollWidth,

  scrollTop,

  scrollLeft,
}) {
  return `--offset-width:${Math.round(offsetWidth)}px;`
+ `--offset-height:${Math.round(offsetHeight)}px;`
+ `--client-width:${Math.round(Math.min(offsetWidth, clientWidth))}px;`
+ `--client-height:${Math.round(Math.min(offsetHeight, clientHeight))}px;`
+ `--scroll-width:${Math.round(scrollWidth)}px;`
+ `--scroll-height:${Math.round(scrollHeight)}px;`
+ `--scrollbar-width:${Math.round(Math.max(0, offsetWidth - clientWidth))}px;`
+ `--scrollbar-height:${Math.round(Math.max(0, offsetHeight - clientHeight))}px;`
+ `--scroll-top:${Math.round(scrollTop)}px;`
+ `--scroll-left:${Math.round(scrollLeft)}px;`;
}
