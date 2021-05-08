import {
    HYPHEN,
    ADD,
    REMOVE,
    DOM_DATA_ATTRIBUTE_NAME,
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
    SCROLLBAR_HEIGHT
} from './constants.js';

import getElementParentsLength from './get-element-parents-length.js';

import getElementIndex from './get-element-index.js';

/**
 * Updates a given element css variables to a given styler element ensuring its presence in the given target element (usually head)
 * @param {HTMLElement} element The given element whose css variables need to be updated
 * @param {HTMLStyleElement} styler The styler element where the css variables are written
 * @param {HTMLElement} target The target, the dom node where the given styler is placed (usually head element)
 * @param {Object} layout The layout dimensions objects to be set in css variables
 * @param {Object} scroll The scroll position to be set in css variables
 * @returns {HTMLStyleElement} Styler element
 */
const set = (element, styler, target, layout, scroll) => {
    // Ensures style tag dom presence, StyleSheet API throws otherwise
    if (!target?.contains(styler) && styler) {
        target.appendChild(styler);
    }
    
    // Element must have a dynamic attribute to be used as a unique css selector
    const dataAttrValue = element?.getAttribute(DOM_DATA_ATTRIBUTE_NAME) ?? getElementParentsLength(element) + HYPHEN + getElementIndex(element);

    // Assigns that selector (a "data attribute")
    element?.setAttribute(DOM_DATA_ATTRIBUTE_NAME, dataAttrValue);

    // CSSStyleSheet instance reference
    const { sheet } = styler ?? {};

    // Only-rule index, just one big rule of css variables is set
    const onlyRuleIndex = 0;

    // Cleans up former CSS rule
    if (sheet?.cssRules?.[onlyRuleIndex]) {
        sheet.deleteRule(onlyRuleIndex);
    }

    // the css variables names and values as an object
    const rulesData = {
        [CSS_VAR_NAME_POSITION_TOP]: scroll[TOP],
        [CSS_VAR_NAME_POSITION_LEFT]: scroll[LEFT],

        [CSS_VAR_NAME_OUTER_WIDTH]: layout[OUTER_WIDTH],
        [CSS_VAR_NAME_OUTER_HEIGHT]: layout[OUTER_HEIGHT],

        [CSS_VAR_NAME_INNER_WIDTH]: layout[INNER_WIDTH],
        [CSS_VAR_NAME_INNER_HEIGHT]: layout[INNER_HEIGHT],

        [CSS_VAR_NAME_SCROLL_WIDTH]: layout[SCROLL_WIDTH],
        [CSS_VAR_NAME_SCROLL_HEIGHT]: layout[SCROLL_HEIGHT],

        [CSS_VAR_NAME_SCROLLBAR_WIDTH]: layout[SCROLLBAR_WIDTH],
        [CSS_VAR_NAME_SCROLLBAR_HEIGHT]: layout[SCROLLBAR_HEIGHT]
    };

    // Enumerates the rules data object key (the css variables names)
    const rulesDataKeys = Object.keys(rulesData);

    // Composes updated css variables rule
    // (addressing a formerly set data attr selector)
    let rules = '';
    for (let i = 0, j = rulesDataKeys.length; i < j; i++) {
        const key = rulesDataKeys[i];

        rules += `${key}: ${rulesData[key]}px;`;
    }

    // Sets new rule up
    sheet?.insertRule(`[${DOM_DATA_ATTRIBUTE_NAME}="${dataAttrValue}"] { ${rules} }`, onlyRuleIndex);

    // Returns the given styler element itself
    return styler;
};

/**
 * Deletes a given scrollable element (associated) styler
 * @param {HTMLElement} element The given scrollable element whose styler needs to be deleted
 * @param {HTMLStyleElement} styler The styler element to be removed from target element (usually head)
 * @returns {HTMLStyleElement} Styler element
 */
const unset = (element, styler) => {
    // Removes the styler element from head
    styler?.remove();

    // Removes the data attr unique selector
    element?.removeAttribute(DOM_DATA_ATTRIBUTE_NAME);

    // Returns the given styler element itself
    return styler;
};

/**
 * Sets or unsets the styler and its css variables in the given target
 * @param {String} method Whether is a registration or an unregistration method (accepts "add" or "remove")
 * @param {HTMLElement} element The given element whose css variables need to be updated
 * @param {HTMLStyleElement} styler The styler element where the css variables are written
 * @param {HTMLElement} target The target, the dom node where the given styler is placed (usually head element)
 * @param {Object} layout The layout dimensions objects to be set in css variables
 * @param {Object} scroll The scroll position to be set in css variables
 * @returns {HTMLStyleElement} Styler element
 */
// Syntactic sugar, making a default export that looks like listener.js
export default (method, element, styler, target, layout, scroll) => ({
    [ADD]: set,
    [REMOVE]: unset
})[method](element, styler, target, layout, scroll);
