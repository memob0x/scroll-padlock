/**
 * @typedef ScrollPosition
 * @property {number} top - The current scroll position from parent's top.
 * @property {number} left - The current scroll position from parent's left.
 */

/**
 * @typedef LayoutDimensions
 * @property {number} outerWidth Element width including vertical scrollbar width.
 * @property {number} outerHeight Element height including horizontal scrollbar height.
 * @property {number} innerWidth Element width not including vertical scrollbar width.
 * @property {number} innerHeight Element height not including horizontal scrollbar height.
 * @property {number} scrollWidth Contents width.
 * @property {number} scrollHeight Contents height.
 * @property {number} scrollbarWidth Vertical scrollbar width.
 * @property {number} scrollbarHeight Horizontal scrollbar height.
 */

/**
 * @typedef GlobalContext
 * @type {Window & typeof globalThis}
 */

/**
 * @callback EventHandler
 * @returns {void}
 */

/**
 * @callback EventHandlerWrapper
 * @param {EventHandler} predicate - The original handler function.
 * @returns {EventHandler}
 */

/**
 * @typedef ConstructorOptions
 * @property {HTMLElement} scrollingElement The html element that can perform the scrolling action.
 * @property {GlobalContext|HTMLElement} scrollEventElement The element that can
 * perform and listen to scroll event.
 * @property {string} cssClassName The lock state CSS class name.
 */
