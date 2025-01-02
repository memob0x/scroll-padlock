import './typedef.js';
import getCSSCustomAttributes from './get-css-custom-attributes.js';

const INT_CSS_RULE_UNIQUE_INDEX = 0;

/**
 * Sets the given CSS rules to the given selector.
 * @type {Record<string, HTMLStyleElement>} SetCSSRulesOptions
 */
const stylers = {};

/**
 * Sets CSS rules for the scroll padlock.
 * @param {{
 * selector: string;
 * element: Element;
 * formatter: (properties: CustomProperties) => string;
 * }} settings - The settings for the scroll padlock.
 * @returns {HTMLStyleElement} The style element containing the CSS rules.
 * @throws {Error} If the given settings are invalid.
 * @throws {Error} If the style element CSSStyleSheet instance can't be referenced.
 */
export default function setScrollPadlockStyle(settings) {
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

    element = scrollingElement,

    formatter = getCSSCustomAttributes,
  } = settings || {};

  if (!selector || !element || !formatter) {
    throw new Error('Invalid settings provided.');
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

  if (sheet.cssRules[INT_CSS_RULE_UNIQUE_INDEX]) {
    sheet.deleteRule(INT_CSS_RULE_UNIQUE_INDEX);
  }

  sheet.insertRule(`${selector} { ${formatter({
    offsetWidth,

    offsetHeight,

    clientWidth,

    clientHeight,

    scrollHeight,

    scrollWidth,

    scrollTop,

    scrollLeft,
  })} }`, INT_CSS_RULE_UNIQUE_INDEX);

  return styler;
}
