import { DOM_BASE_NAME, head } from './client.mjs';

import {
    DIMENSIONS_HEIGHT_INNER,
    DIMENSIONS_HEIGHT_SCROLL,
    DIMENSIONS_WIDTH_OUTER,
    DIMENSIONS_WIDTH_SCROLL,
    DIMENSIONS_WIDTH_INNER,
    DIMENSIONS_HEIGHT_OUTER,
    DIMENSIONS_OUTER,
    DIMENSIONS_INNER,
    DIMENSIONS_WIDTH,
    DIMENSIONS_HEIGHT,
    DIMENSIONS_SCROLL
} from './dimensions.mjs';

import { SCROLL_TOP, SCROLL_LEFT } from './scroll.mjs';

import { SCROLLBAR_WIDTH, SCROLLBAR_HEIGHT } from './scrollbars.mjs';

import { getElementParentsLength, getElementIndex, joinHyphen } from './utils.mjs';

// Data attribute name
export const DATA_ATTR_NAME = joinHyphen('data', DOM_BASE_NAME);

// CSS variables names
const CSS_VAR_PREFIX = '--';
const CSS_VAR_SCROLL_PREFIX = 'scroll';
export const CSS_VAR_NAME_POSITION_TOP = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, CSS_VAR_SCROLL_PREFIX, SCROLL_TOP);
export const CSS_VAR_NAME_POSITION_LEFT = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, CSS_VAR_SCROLL_PREFIX, SCROLL_LEFT);
const CSS_VAR_SCROLLBAR_PREFIX = 'scrollbar';
export const CSS_VAR_NAME_GAP_VERTICAL = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, CSS_VAR_SCROLLBAR_PREFIX, SCROLLBAR_WIDTH);
export const CSS_VAR_NAME_GAP_HORIZONTAL = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, CSS_VAR_SCROLLBAR_PREFIX, SCROLLBAR_HEIGHT);
export const CSS_VAR_NAME_WIDTH_OUTER = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, DIMENSIONS_OUTER, DIMENSIONS_WIDTH);
export const CSS_VAR_NAME_HEIGHT_OUTER = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, DIMENSIONS_OUTER, DIMENSIONS_HEIGHT);
export const CSS_VAR_NAME_WIDTH_INNER = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, DIMENSIONS_INNER, DIMENSIONS_WIDTH);
export const CSS_VAR_NAME_HEIGHT_INNER = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, DIMENSIONS_INNER, DIMENSIONS_HEIGHT);
export const CSS_VAR_NAME_WIDTH_SCROLL = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, DIMENSIONS_SCROLL, DIMENSIONS_WIDTH);
export const CSS_VAR_NAME_HEIGHT_SCROLL = CSS_VAR_PREFIX + joinHyphen(DOM_BASE_NAME, DIMENSIONS_SCROLL, DIMENSIONS_HEIGHT);

// CSS variables value unit of measurement
const CSS_VAR_UNIT_VALUE = 'px';

// Only-rule index
const CSS_STYLE_SHEET_ONLY_RULE_INDEX = 0;

/**
 * Updates a given element css variables to a given styler element ensuring its presence in head
 * @param {HTMLElement} element The given element whose css variables need to be updated
 * @param {HTMLStyleElement} styler The styler element where the css variables are written
 * @param {Object} dimensions
 * @param {Object} scroll The scroll position to be set in css variables
 * @param {Object} scrollbar The scrollbars size to be set in css variables
 * @returns {HTMLStyleElement} Styler element
 */
export const setStyles = (element, styler, dimensions, scroll, scrollbar) => {
    // Ensures style tag dom presence, StyleSheet API throws otherwise
    if (!head.contains(styler)) {
        head.appendChild(styler);
    }
    
    // Element must have a dynamic attribute to be used as a unique css selector
    const dataAttrValue = element.getAttribute(DATA_ATTR_NAME) ?? joinHyphen(getElementParentsLength(element), getElementIndex(element));

    // Assigns that selector (a "data attribute")
    element.setAttribute(DATA_ATTR_NAME, dataAttrValue);

    // CSSStyleSheet instance reference
    const { sheet } = styler;

    // Cleans up former CSS rule
    if (sheet.cssRules[CSS_STYLE_SHEET_ONLY_RULE_INDEX]) {
        sheet.deleteRule(CSS_STYLE_SHEET_ONLY_RULE_INDEX);
    }

    // the css variables names and values as an object
    const rulesData = {
        [CSS_VAR_NAME_POSITION_TOP]: scroll[SCROLL_TOP],
        [CSS_VAR_NAME_POSITION_LEFT]: scroll[SCROLL_LEFT],

        [CSS_VAR_NAME_WIDTH_OUTER]: dimensions[DIMENSIONS_WIDTH_OUTER],
        [CSS_VAR_NAME_HEIGHT_OUTER]: dimensions[DIMENSIONS_HEIGHT_OUTER],

        [CSS_VAR_NAME_WIDTH_INNER]: dimensions[DIMENSIONS_WIDTH_INNER],
        [CSS_VAR_NAME_HEIGHT_INNER]: dimensions[DIMENSIONS_HEIGHT_INNER],

        [CSS_VAR_NAME_WIDTH_SCROLL]: dimensions[DIMENSIONS_WIDTH_SCROLL],
        [CSS_VAR_NAME_HEIGHT_SCROLL]: dimensions[DIMENSIONS_HEIGHT_SCROLL],

        [CSS_VAR_NAME_GAP_VERTICAL]: scrollbar[SCROLLBAR_WIDTH],
        [CSS_VAR_NAME_GAP_HORIZONTAL]: scrollbar[SCROLLBAR_HEIGHT]
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
    sheet.insertRule(`[${DATA_ATTR_NAME}="${dataAttrValue}"] { ${rules} }`, CSS_STYLE_SHEET_ONLY_RULE_INDEX);

    // Returns the given styler element itself
    return styler;
};

/**
 * Deletes a given scrollable element (associated) styler
 * @param {HTMLElement} element The given scrollable element whose styler needs to be deleted
 * @param {HTMLStyleElement} styler The styler element to be removed from head
 * @returns {HTMLStyleElement} Styler element
 */
export const unsetStyles = (element, styler) => {
    // Removes the styler element from head
    styler.remove();

    // Removes the data attr unique selector
    element.removeAttribute(DATA_ATTR_NAME);

    // Returns the given styler element itself
    return styler;
};
