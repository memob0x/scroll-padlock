/**
 * Updates a given element css variables to a given styler element
 * ensuring its presence in the given target element (usually head).
 *
 * @example
 * getCssRuleFromSchema([['top', 1], ['right', 2]]); // --> { 'top': '1px', 'right': '2px' }
 * @param {string} selector - The styling rules css selector.
 * @param {Array} schema - The css rules js schema.
 * @returns {string} The styling rule css string.
 */
const getCssRuleFromSchema = (selector, schema) => `${schema.reduce((string, [name, value]) => `${string} ${name}: ${value}px;`, `${selector} {`)} }`;

export default getCssRuleFromSchema;
