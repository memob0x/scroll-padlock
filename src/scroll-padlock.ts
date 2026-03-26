/**
 * Formats the given dimensions and scroll information into CSS variables.
 * @param computedLayout - Represents the computed layout properties of an HTML element.
 * @param computedLayout.offsetWidth - The total layout width of the element in pixels, including scrollbars.
 * @param computedLayout.offsetHeight - The total layout height of the element in pixels, including scrollbars.
 * @param computedLayout.clientWidth - The inner width of the element in pixels, **excluding scrollbars**.
 * @param computedLayout.clientHeight - The inner height of the element in pixels, **excluding scrollbars**.
 * @param computedLayout.scrollWidth - The full width of the element's content, including content not visible due to overflow.
 * @param computedLayout.scrollHeight - The full height of the element's content, including content not visible due to overflow.
 * @param computedLayout.scrollTop - The number of pixels that the element's content is scrolled vertically.
 * @param computedLayout.scrollLeft - The number of pixels that the element's content is scrolled horizontally.
 * @returns The formatted CSS variables.
 */
const getCSSCustomProperties = ({
  offsetWidth = 0,
  offsetHeight = 0,
  clientWidth = 0,
  clientHeight = 0,
  scrollWidth = 0,
  scrollHeight = 0,
  scrollTop = 0,
  scrollLeft = 0,
}: {
  offsetWidth?: number,
  offsetHeight?: number,
  clientWidth?: number,
  clientHeight?: number,
  scrollWidth?: number,
  scrollHeight?: number,
  scrollTop?: number,
  scrollLeft?: number,
}) => `--offset-width:${offsetWidth}px;`
+ `--offset-height:${offsetHeight}px;`
+ `--client-width:${clientWidth}px;`
+ `--client-height:${clientHeight}px;`
+ `--scroll-width:${scrollWidth}px;`
+ `--scroll-height:${scrollHeight}px;`
+ `--scroll-top:${scrollTop}px;`
+ `--scroll-left:${scrollLeft}px;`;

/**
 * The currently created style elements by selector.
 */
const stylers: Record<string, HTMLStyleElement> = {};

/**
 * Sets CSS rules for the scroll padlock.
 * @param options - The options for the scroll padlock.
 * @param options.selector - A CSS selector string to identify the element.
 * @param options.element - The DOM element to apply the padlock to.
 * @param options.formatter - A function to format the computed layout properties.
 * @returns The style element containing the CSS rules.
 */
export function setStyle(options?: {
  selector?: string;
  element?: Element | HTMLElement;
  formatter?: typeof getCSSCustomProperties
}): HTMLStyleElement {
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

  let offsetWidth = 0;
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

  stylers[selector] = styler;

  while (sheet?.cssRules.length) {
    sheet?.deleteRule(0);
  }

  sheet?.insertRule(`${selector}{${formatter({
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
