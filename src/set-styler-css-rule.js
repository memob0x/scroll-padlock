import getObjectStringified from './get-object-stringified';

import {
  CSS_VAR_NAME_POSITION_TOP,
  CSS_VAR_NAME_POSITION_LEFT,
  CSS_VAR_NAME_OUTER_WIDTH,
  CSS_VAR_NAME_OUTER_HEIGHT,
  CSS_VAR_NAME_INNER_WIDTH,
  CSS_VAR_NAME_INNER_HEIGHT,
  CSS_VAR_NAME_SCROLL_WIDTH,
  CSS_VAR_NAME_SCROLL_HEIGHT,
  CSS_VAR_NAME_SCROLLBAR_WIDTH,
  CSS_VAR_NAME_SCROLLBAR_HEIGHT,
  TOP,
  LEFT,
  OUTER_WIDTH,
  OUTER_HEIGHT,
  INNER_WIDTH,
  INNER_HEIGHT,
  SCROLL_WIDTH,
  SCROLL_HEIGHT,
  SCROLLBAR_WIDTH,
  SCROLLBAR_HEIGHT,
} from './constants';

// Only-rule index, just one big rule of css variables is set
const CSS_RULE_INDEX_MAIN = 0;

const REG_EXP_GLOBAL_COMMAS = /,/g;

const getStylerCssRule = (selector, layout, scroll) => {
  // the css variables names and values as an object
  const rulesObject = {
    [CSS_VAR_NAME_POSITION_TOP]: scroll[TOP],
    [CSS_VAR_NAME_POSITION_LEFT]: scroll[LEFT],

    [CSS_VAR_NAME_OUTER_WIDTH]: layout[OUTER_WIDTH],
    [CSS_VAR_NAME_OUTER_HEIGHT]: layout[OUTER_HEIGHT],

    [CSS_VAR_NAME_INNER_WIDTH]: layout[INNER_WIDTH],
    [CSS_VAR_NAME_INNER_HEIGHT]: layout[INNER_HEIGHT],

    [CSS_VAR_NAME_SCROLL_WIDTH]: layout[SCROLL_WIDTH],
    [CSS_VAR_NAME_SCROLL_HEIGHT]: layout[SCROLL_HEIGHT],

    [CSS_VAR_NAME_SCROLLBAR_WIDTH]: layout[SCROLLBAR_WIDTH],
    [CSS_VAR_NAME_SCROLLBAR_HEIGHT]: layout[SCROLLBAR_HEIGHT],
  };

  // Enumerates the rules data object key (the css variables names)
  const rulesString = getObjectStringified(rulesObject).replace(REG_EXP_GLOBAL_COMMAS, ';');

  //
  return selector + rulesString;
};

/**
 * Updates a given element css variables to a given styler element
 * ensuring its presence in the given target element (usually head)
 * @param {HTMLStyleElement} styler The styler element where the css variables are written
 * @param {String} selector The styling rules css selector
 * @param {Object} layout The layout dimensions objects to be set in css variables
 * @param {Object} scroll The scroll position to be set in css variables
 * @returns {HTMLStyleElement} Styler element
 */
const setStylerCssRule = (styler, selector, layout, scroll) => {
  // CSSStyleSheet instance reference
  const { sheet } = styler ?? {};

  // Cleans up former CSS rule
  if (sheet?.cssRules?.[CSS_RULE_INDEX_MAIN]) {
    sheet.deleteRule(CSS_RULE_INDEX_MAIN);
  }

  //
  const rule = getStylerCssRule(styler, selector, layout, scroll);

  // Sets new rule up
  sheet?.insertRule(rule, CSS_RULE_INDEX_MAIN);

  // Returns the given styler element itself
  return styler;
};

export default setStylerCssRule;
