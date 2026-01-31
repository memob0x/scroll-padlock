/**
 * Represents the computed layout properties of an HTML element.
 */
export type ComputedLayout = {
  /**
   * The number of pixels that the element's content is scrolled vertically.
   */
  scrollTop?: number;

  /**
   * The number of pixels that the element's content is scrolled horizontally.
   */
  scrollLeft?: number;

  /**
   * The full width of the element's content, including content not visible due to overflow.
   */
  scrollWidth?: number;

  /**
   * The full height of the element's content, including content not visible due to overflow.
   */
  scrollHeight?: number;

  /**
   * The width of the vertical scrollbar in pixels, if present.
   */
  scrollbarWidth?: number;

  /**
   * The height of the horizontal scrollbar in pixels, if present.
   */
  scrollbarHeight?: number;

  /**
   * The total layout width of the element in pixels, including scrollbars.
   */
  offsetWidth?: number;

  /**
   * The total layout height of the element in pixels, including scrollbars.
   */
  offsetHeight?: number;

  /**
   * The inner width of the element in pixels, **excluding scrollbars**.
   */
  clientWidth?: number;

  /**
   * The inner height of the element in pixels, **excluding scrollbars**.
   */
  clientHeight?: number;
};
