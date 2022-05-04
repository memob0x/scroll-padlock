/**
 * Updates a given element css variables to a given styler element
 * ensuring its presence in the given target element (usually head).
 *
 * @param {string} selector - The styling rules css selector.
 * @param {Array} schema - TODO:.
 * @returns {string} The styling rule css string.
 */
const getLayoutAndScrollCssVariablesRule = (selector, schema) => `${schema.reduce((string, [name, value]) => `${string} ${name}: ${value}px;`, `${selector} {`)} }`;

export default getLayoutAndScrollCssVariablesRule;
