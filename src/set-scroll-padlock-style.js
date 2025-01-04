import getCSSCustomProperties from './get-css-custom-properties.js';

/** @typedef {import('./types.js').Options} Options */

/**
 * The currently created style elements by selector.
 * @type {Record<string, HTMLStyleElement>} SetCSSRulesOptions
 */
const stylers = {};

/**
 * Sets CSS rules for the scroll padlock.
 * @param {Options} [options] - The options for the scroll padlock.
 * @returns {HTMLStyleElement} The style element containing the CSS rules.
 * @throws {Error} If the given options are invalid.
 * @throws {Error} If the style element CSSStyleSheet instance can't be referenced.
 */
export default function setScrollPadlockStyle(options) {
  const win = globalThis;

  const { document: doc } = win;

  const {
    documentElement,

    scrollingElement,

    head,

    body,
  } = doc;

  const {
    selector = '.scroll-padlock',

    element = scrollingElement || documentElement,

    formatter = getCSSCustomProperties,
  } = options || {};

  if (!selector || !element || !formatter) {
    throw new Error('Invalid options provided.');
  }

  // element width with scrollbar width
  let offsetWidth = 0;

  // element height with scrollbar height
  let offsetHeight = 0;

  let scrollTop = 0;

  let scrollLeft = 0;

  if (
    element === body

    || element === documentElement

    || element === scrollingElement
  ) {
    ({
      innerWidth: offsetWidth,

      innerHeight: offsetHeight,

      scrollY: scrollTop,

      scrollX: scrollLeft,
    } = win);
  } else {
    ({
      offsetWidth,

      offsetHeight,

      scrollTop,

      scrollLeft,
    } = element);
  }

  const {
    clientWidth,

    clientHeight,

    scrollWidth,

    scrollHeight,
  } = element;

  const styler = stylers[selector] || doc.createElement('style');

  if (!head.contains(styler)) {
    head.append(styler);
  }

  const { sheet } = styler;

  if (!sheet) {
    throw new Error('Invalid CSSStyleSheet instance.');
  }

  stylers[selector] = styler;

  while (sheet.cssRules.length) {
    sheet.deleteRule(0);
  }

  sheet.insertRule(`${selector}{${formatter({
    offsetWidth,

    offsetHeight,

    clientWidth,

    clientHeight,

    scrollHeight,

    scrollWidth,

    scrollTop,

    scrollLeft,
  })}}`);

  return styler;
}
