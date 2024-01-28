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
 * @typedef Client
 * @type {Window & typeof globalThis}
 */

/**
 * @callback Handler
 * @returns {void}
 */

/**
 * @callback HandlerWrapper
 * @param {Handler} predicate
 * @returns {Handler}
 */

/**
 * @typedef ScrollPadlockOptions
 * @property {HTMLElement} scrollingElement Asd.
 * @property {Client | HTMLElement} scrollEventElement Asd.
 * @property {string} cssClassName Asd.
 * @property {HandlerWrapper} resizeHandlerWrapper Asd.
 * @property {HandlerWrapper} scrollHandlerWrapper Asd.
 * @property {Client} client Asd.
 */
