import { head } from './client.mjs';

import { getElementParentsLength, getElementIndex } from './utils.mjs';

// DOM naming part (prefix, suffix etc...)
const DOM_BASE_NAME = 'scroll-padlock';

// Data attribute name
export const DATA_ATTR_NAME = `data-${DOM_BASE_NAME}`;

// CSS variables suffixes
const CSS_VAR_RECT_SUFFIX = 'scroll';

// CSS variables names
export const CSS_VAR_NAME_POSITION_TOP = `--${DOM_BASE_NAME}-${CSS_VAR_RECT_SUFFIX}-top`;
export const CSS_VAR_NAME_POSITION_LEFT = `--${DOM_BASE_NAME}-${CSS_VAR_RECT_SUFFIX}-left`;

const CSS_VAR_SCROLLBAR_SUFFIX = 'scrollbar-gap';

export const CSS_VAR_NAME_GAP_VERTICAL = `--${DOM_BASE_NAME}-${CSS_VAR_SCROLLBAR_SUFFIX}-vertical`;
export const CSS_VAR_NAME_GAP_HORIZONTAL = `--${DOM_BASE_NAME}-${CSS_VAR_SCROLLBAR_SUFFIX}-horizontal`;

const CSS_VAR_ROUNDED_SUFFIX = 'round';

// CSS variables value unit of measurement
const CSS_VAR_UNIT_VALUE = 'px';

/**
 * Updates a given element css variables to the current state
 * @param {HTMLElement} element The given element whose css variables need to be updated
 * @param {HTMLStyleElement} styler
 * @param {Object} scroll
 * @param {Object} scrollbar
 * @returns {HTMLStyleElement} Styler element
 */
export const setStyles = (element, styler, scroll, scrollbar) => {
    // Ensures style tag dom presence, StyleSheet API throws otherwise
    if (!head.contains(styler)) {
        head.appendChild(styler);
    }

    // Assigns a unique "data attribute"
    // (unique because it's formed by the length of parents and the element index in DOM tree)
    if (!element?.matches(`[${DATA_ATTR_NAME}]`)) {
        element?.setAttribute(DATA_ATTR_NAME, `${getElementParentsLength(element)}-${getElementIndex(element)}`);
    }

    // Only-rule index
    const index = 0;

    // CSSStyleSheet instance reference
    const sheet = styler?.sheet ?? {};

    // Cleans up former CSS rule
    if (sheet?.cssRules?.[index]) {
        sheet?.deleteRule(index);
    }

    // Composes updated css variables rule
    // (addressing a formerly set data attr selector)
    const rule = `[${DATA_ATTR_NAME}="${element?.getAttribute(DATA_ATTR_NAME)}"] {
        ${CSS_VAR_NAME_POSITION_TOP}: ${scroll.top}${CSS_VAR_UNIT_VALUE};
        ${CSS_VAR_NAME_POSITION_LEFT}: ${scroll.left}${CSS_VAR_UNIT_VALUE};
        
        ${CSS_VAR_NAME_POSITION_TOP}-${CSS_VAR_ROUNDED_SUFFIX}: ${Math.round(scroll.top)}${CSS_VAR_UNIT_VALUE};
        ${CSS_VAR_NAME_POSITION_LEFT}-${CSS_VAR_ROUNDED_SUFFIX}: ${Math.round(scroll.left)}${CSS_VAR_UNIT_VALUE};

        ${CSS_VAR_NAME_GAP_VERTICAL}: ${scrollbar.vertical}${CSS_VAR_UNIT_VALUE};
        ${CSS_VAR_NAME_GAP_HORIZONTAL}: ${scrollbar.horizontal}${CSS_VAR_UNIT_VALUE};
        
        ${CSS_VAR_NAME_GAP_VERTICAL}-${CSS_VAR_ROUNDED_SUFFIX}: ${Math.round(scrollbar.vertical)}${CSS_VAR_UNIT_VALUE};
        ${CSS_VAR_NAME_GAP_HORIZONTAL}-${CSS_VAR_ROUNDED_SUFFIX}: ${Math.round(scrollbar.horizontal)}${CSS_VAR_UNIT_VALUE};
    }`;

    // Sets new rule up
    sheet?.insertRule(rule, index);

    // Returns the given styler element itself
    return styler;
};

/**
 * Deletes a given scrollable element (associated) styler
 * @param {HTMLElement} element The given scrollable element whose styler needs to be deleted
 * @returns {HTMLStyleElement} Styler element
 */
export const unsetStyles = (element, styler) => {
    // Removes the styler element from head
    styler?.remove();

    // Removes the data attr unique selector
    element?.removeAttribute(DATA_ATTR_NAME);

    // Returns the given styler element itself
    return styler;
};
