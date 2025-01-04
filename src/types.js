/**
 * @typedef ComputedLayout
 * @property {number} scrollTop The number of pixels the element's
 * content is scrolled vertically.
 * @property {number} scrollLeft The number of pixels the element's
 * content is scrolled horizontally.
 * @property {number} scrollWidth The total width of the element's
 * scrollable content, including the non-visible part.
 * @property {number} scrollHeight The total height of the element's
 * scrollable content, including the non-visible part.
 * @property {number} scrollbarWidth The width of the vertical scrollbar of the element.
 * @property {number} scrollbarHeight The height of the horizontal scrollbar of the element.
 * @property {number} offsetWidth The total visible width of the element, including the scrollbar.
 * @property {number} offsetHeight The total visible height of the element, including the scrollbar.
 * @property {number} clientWidth The visible width of the element, excluding the scrollbar.
 * @property {number} clientHeight The visible height of the element, excluding the scrollbar.
 */

/**
 * @typedef Options
 * @property {string} [selector] The CSS selector string that identifies the target element.
 * @property {Element} [element] The DOM element
 * that will be used to retrieve the values for the CSS variables.
 * @property {(properties: ComputedLayout) => string} [formatter] A function that allows
 * to customize the the CSS styles to be added.
 */

export { };
