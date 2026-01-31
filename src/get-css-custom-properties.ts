import { ComputedLayout } from './computed-layout';

/**
 * Formats the given dimensions and scroll information into CSS variables.
 * @param computedLayout - The dimensions and scroll information.
 * @returns The formatted CSS variables.
 */
export function getCSSCustomProperties(computedLayout?: ComputedLayout): string {
  const {
    offsetWidth = 0,
    offsetHeight = 0,
    clientWidth = 0,
    clientHeight = 0,
    scrollHeight = 0,
    scrollWidth = 0,
    scrollTop = 0,
    scrollLeft = 0,
  } = computedLayout || {};

  return `--offset-width:${offsetWidth}px;`
+ `--offset-height:${offsetHeight}px;`
+ `--client-width:${clientWidth}px;`
+ `--client-height:${clientHeight}px;`
+ `--scroll-width:${scrollWidth}px;`
+ `--scroll-height:${scrollHeight}px;`
+ `--scroll-top:${scrollTop}px;`
+ `--scroll-left:${scrollLeft}px;`;
}
