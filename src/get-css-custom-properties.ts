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

  return `--offset-width:${Math.round(offsetWidth)}px;`
+ `--offset-height:${Math.round(offsetHeight)}px;`
+ `--client-width:${Math.round(Math.min(offsetWidth, clientWidth))}px;`
+ `--client-height:${Math.round(Math.min(offsetHeight, clientHeight))}px;`
+ `--scroll-width:${Math.round(scrollWidth)}px;`
+ `--scroll-height:${Math.round(scrollHeight)}px;`
+ `--scrollbar-width:${Math.round(Math.max(0, offsetWidth - clientWidth))}px;`
+ `--scrollbar-height:${Math.round(Math.max(0, offsetHeight - clientHeight))}px;`
+ `--scroll-top:${Math.round(scrollTop)}px;`
+ `--scroll-left:${Math.round(scrollLeft)}px;`;
}
