/**
 * The currently created style elements by selector.
 */
const stylers: Record<string, HTMLStyleElement> = {}

/**
 * Sets CSS rules for the scroll padlock.
 * @param options - The options for the scroll padlock.
 * @param options.selector - A CSS selector string to identify the element.
 * @param options.element - The DOM element to apply the padlock to.
 * @param options.formatter - A function to format the computed layout properties.
 * @returns The style element containing the CSS rules.
 */
export function setStyle(options?: {
  selector?: string
  element?: Element | HTMLElement
  formatter?: (opts: {
    offsetWidth?: number
    offsetHeight?: number
    clientWidth?: number
    clientHeight?: number
    scrollWidth?: number
    scrollHeight?: number
    scrollTop?: number
    scrollLeft?: number
  }) => string
}): HTMLStyleElement {
  const win = globalThis

  const { document: doc } = win

  const {
    documentElement,
    scrollingElement,
    head,
    body,
  } = doc

  const {
    selector = '.scroll-padlock',
    element = scrollingElement || documentElement,
    formatter = ({
      offsetWidth = 0,
      clientWidth = 0,
    }) => `--scrollbar-width: ${offsetWidth - clientWidth}px;`,
  } = options || {}

  let offsetWidth = 0
  let offsetHeight = 0

  let scrollTop = 0
  let scrollLeft = 0

  const isMainScroller = (
    element === body
    || element === documentElement
    || element === scrollingElement
  )

  if (isMainScroller) {
    offsetWidth = win.innerWidth
    offsetHeight = win.innerHeight
    scrollTop = win.scrollY
    scrollLeft = win.scrollX
  }

  if (!isMainScroller) {
    scrollTop = element.scrollTop
    scrollLeft = element.scrollLeft
  }

  if (!isMainScroller && element instanceof win.HTMLElement) {
    offsetWidth = element.offsetWidth
    offsetHeight = element.offsetHeight
  }

  const {
    clientWidth,
    clientHeight,
    scrollWidth,
    scrollHeight,
  } = element

  const styler = stylers[selector] || doc.createElement('style')

  if (!head.contains(styler)) {
    head.append(styler)
  }

  const { sheet } = styler

  stylers[selector] = styler

  while (sheet?.cssRules.length) {
    sheet?.deleteRule(0)
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
  })}}`)

  return styler
}
