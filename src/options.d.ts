import { ComputedLayout } from './computed-layout';

/**
 * Options for configuring the scroll padlock.
 */
export type Options = {
  /**
   * A CSS selector string to identify the element.
   */
  selector?: string;
  /**
   * The DOM element to apply the padlock to.
   */
  element?: Element | HTMLElement;
  /**
   * A function to format the computed layout properties.
   */
  formatter?: (properties: ComputedLayout) => string;
};
