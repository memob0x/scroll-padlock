import { getCSSCustomProperties } from './get-css-custom-properties.js';
import { Options } from './types.js';

/**
 * The currently created style elements by selector.
 */
const stylers: Record<string, HTMLStyleElement> = {};

/**
 * Sets CSS rules for the scroll padlock.
 * @param options - The options for the scroll padlock.
 * @returns The style element containing the CSS rules.
 * @throws {Error} If the given options are invalid.
 * @throws {Error} If the style element CSSStyleSheet instance can't be referenced.
 */
export function setStyle(options?: Options): HTMLStyleElement {
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

  const isMainScroller = (
    element === body
    || element === documentElement
    || element === scrollingElement
  );

  if (isMainScroller) {
    offsetWidth = win.innerWidth;
    offsetHeight = win.innerHeight;
    scrollTop = win.scrollY;
    scrollLeft = win.scrollX;
  }

  if (!isMainScroller) {
    scrollTop = element.scrollTop;
    scrollLeft = element.scrollLeft;
  }

  if (!isMainScroller && element instanceof win.HTMLElement) {
    offsetWidth = element.offsetWidth;
    offsetHeight = element.offsetHeight;
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
