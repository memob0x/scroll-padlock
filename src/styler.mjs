import {
    STYLER_METHOD_ADD,
    DATA_ATTR_NAME,
    CSS_STYLE_SHEET_ONLY_RULE_INDEX,
    CSS_VAR_NAME_POSITION_TOP,
    CSS_VAR_NAME_POSITION_LEFT,
    CSS_VAR_NAME_WIDTH_OUTER,
    CSS_VAR_NAME_HEIGHT_OUTER,
    CSS_VAR_NAME_WIDTH_INNER,
    CSS_VAR_NAME_HEIGHT_INNER,
    CSS_VAR_NAME_WIDTH_SCROLL,
    CSS_VAR_NAME_HEIGHT_SCROLL,
    CSS_VAR_NAME_SCROLLBAR_WIDTH,
    CSS_VAR_NAME_SCROLLBAR_HEIGHT,
    CSS_VAR_UNIT_VALUE,
    STYLER_METHOD_REMOVE,
    SCROLL_TOP,
    SCROLL_LEFT,
    LAYOUT_WIDTH_OUTER,
    LAYOUT_HEIGHT_OUTER,
    LAYOUT_WIDTH_INNER,
    LAYOUT_HEIGHT_INNER,
    LAYOUT_WIDTH_SCROLL,
    LAYOUT_HEIGHT_SCROLL,
    LAYOUT_SCROLLBAR_WIDTH,
    LAYOUT_SCROLLBAR_HEIGHT
} from './constants.mjs';

import joinHyphen from './join-array-of-strings-with-hyphen.mjs';

import getElementParentsLength from './get-element-parents-length.mjs';

import getElementIndex from './get-element-index.mjs';

/**
 * Updates a given element css variables to a given styler element ensuring its presence in head
 * @param {HTMLElement} element The given element whose css variables need to be updated
 * @param {HTMLStyleElement} styler The styler element where the css variables are written
 * @param {Object} layout
 * @param {Object} scroll The scroll position to be set in css variables
 * @returns {HTMLStyleElement} Styler element
 */
const set = (element, styler, target, layout, scroll) => {
    // Ensures style tag dom presence, StyleSheet API throws otherwise
    if (!target?.contains(styler) && styler) {
        target.appendChild(styler);
    }
    
    // Element must have a dynamic attribute to be used as a unique css selector
    const dataAttrValue = element?.getAttribute(DATA_ATTR_NAME) ?? joinHyphen(getElementParentsLength(element), getElementIndex(element));

    // Assigns that selector (a "data attribute")
    element?.setAttribute(DATA_ATTR_NAME, dataAttrValue);

    // CSSStyleSheet instance reference
    const { sheet } = styler ?? {};

    // Cleans up former CSS rule
    if (sheet?.cssRules?.[CSS_STYLE_SHEET_ONLY_RULE_INDEX]) {
        sheet.deleteRule(CSS_STYLE_SHEET_ONLY_RULE_INDEX);
    }

    // the css variables names and values as an object
    const rulesData = {
        [CSS_VAR_NAME_POSITION_TOP]: scroll[SCROLL_TOP],
        [CSS_VAR_NAME_POSITION_LEFT]: scroll[SCROLL_LEFT],

        [CSS_VAR_NAME_WIDTH_OUTER]: layout[LAYOUT_WIDTH_OUTER],
        [CSS_VAR_NAME_HEIGHT_OUTER]: layout[LAYOUT_HEIGHT_OUTER],

        [CSS_VAR_NAME_WIDTH_INNER]: layout[LAYOUT_WIDTH_INNER],
        [CSS_VAR_NAME_HEIGHT_INNER]: layout[LAYOUT_HEIGHT_INNER],

        [CSS_VAR_NAME_WIDTH_SCROLL]: layout[LAYOUT_WIDTH_SCROLL],
        [CSS_VAR_NAME_HEIGHT_SCROLL]: layout[LAYOUT_HEIGHT_SCROLL],

        [CSS_VAR_NAME_SCROLLBAR_WIDTH]: layout[LAYOUT_SCROLLBAR_WIDTH],
        [CSS_VAR_NAME_SCROLLBAR_HEIGHT]: layout[LAYOUT_SCROLLBAR_HEIGHT]
    };

    // Enumerates the rules data object key (the css variables names)
    const rulesDataKeys = Object.keys(rulesData);

    // Composes updated css variables rule
    // (addressing a formerly set data attr selector)
    let rules = '';
    for (let i = 0, j = rulesDataKeys.length; i < j; i++) {
        const key = rulesDataKeys[i];

        rules += `${key}: ${rulesData[key]}${CSS_VAR_UNIT_VALUE};`;
    }

    // Sets new rule up
    sheet?.insertRule(`[${DATA_ATTR_NAME}="${dataAttrValue}"] { ${rules} }`, CSS_STYLE_SHEET_ONLY_RULE_INDEX);

    // Returns the given styler element itself
    return styler;
};

/**
 * Deletes a given scrollable element (associated) styler
 * @param {HTMLElement} element The given scrollable element whose styler needs to be deleted
 * @param {HTMLStyleElement} styler The styler element to be removed from head
 * @returns {HTMLStyleElement} Styler element
 */
const unset = (element, styler) => {
    // Removes the styler element from head
    styler?.remove();

    // Removes the data attr unique selector
    element?.removeAttribute(DATA_ATTR_NAME);

    // Returns the given styler element itself
    return styler;
};

/**
 * 
 * @param {String} method
 * @param {HTMLElement} element
 * @param {HTMLStyleElement} styler
 * @param {HTMLElement} target
 * @param {Object} layout
 * @param {Object} scroll
 */
export default (method, element, styler, target, layout, scroll) => ({
    [STYLER_METHOD_ADD]: set,
    [STYLER_METHOD_REMOVE]: unset
})[method](element, styler, target, layout, scroll);
