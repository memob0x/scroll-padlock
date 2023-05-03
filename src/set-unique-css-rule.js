// Only-rule index, just one big rule of css variables is set
const INT_CSS_RULE_UNIQUE_INDEX = 0;

/**
 * Updates a given element css variables to a given styler element
 * ensuring its presence in the given target element (usually head).
 * @public
 * @example
 * setUniqueCssRule(document.querySelector('style#my-styles'), '.el { color: blue; }');
 * @param {HTMLStyleElement} styler - The styler element where the css variables are written.
 * @param {string} rule - The styling rule css string.
 * @returns {HTMLStyleElement} The given styler element.
 */
const setUniqueCssRule = (styler, rule) => {
  // CSSStyleSheet instance reference
  const { sheet } = styler || {};

  // Cleans up former CSS rule
  if (sheet?.cssRules?.[INT_CSS_RULE_UNIQUE_INDEX]) {
    sheet.deleteRule(INT_CSS_RULE_UNIQUE_INDEX);
  }

  // Sets new rule up
  sheet?.insertRule(rule, INT_CSS_RULE_UNIQUE_INDEX);

  // Returns the given styler element itself
  return styler;
};

export default setUniqueCssRule;
