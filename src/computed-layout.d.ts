/**
 * Represents the computed layout properties of an element.
 */
export type ComputedLayout = {
  /**
   * The number of pixels that the content of an element is scrolled vertically.
   */
  scrollTop?: number;
  /**
   * The number of pixels that the content of an element is scrolled horizontally.
   */
  scrollLeft?: number;
  /**
   * The entire width of an element, including content not visible on the screen due to overflow.
   */
  scrollWidth?: number;
  /**
   * The entire height of an element, including content not visible on the screen due to overflow.
   */
  scrollHeight?: number;
  /**
   * The width of the vertical scrollbar.
   */
  scrollbarWidth?: number;
  /**
   * The height of the horizontal scrollbar.
   */
  scrollbarHeight?: number;
  /**
   * The layout width of an element as an integer.
   */
  offsetWidth?: number;
  /**
   * The layout height of an element as an integer.
   */
  offsetHeight?: number;
  /**
   * The inner width of an element in pixels.
   */
  clientWidth?: number;
  /**
   * The inner height of an element in pixels.
   */
  clientHeight?: number;
};
