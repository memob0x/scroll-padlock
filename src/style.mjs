import { head } from './client.mjs';

// dom naming part (prefix, suffix etc...)
const DOM_BASE_NAME = 'scroll-padlock';

// data attribute name
export const DATA_ATTR_NAME = `data-${DOM_BASE_NAME}`;

// css variables suffixes
const CSS_VAR_RECT_SUFFIX = 'scroll';

// css variables names
export const CSS_VAR_NAME_POSITION_TOP = `--${DOM_BASE_NAME}-${CSS_VAR_RECT_SUFFIX}-top`;
export const CSS_VAR_NAME_POSITION_LEFT = `--${DOM_BASE_NAME}-${CSS_VAR_RECT_SUFFIX}-left`;

const CSS_VAR_SCROLLBAR_SUFFIX = 'scrollbar-gap';

export const CSS_VAR_NAME_GAP_VERTICAL = `--${DOM_BASE_NAME}-${CSS_VAR_SCROLLBAR_SUFFIX}-vertical`;
export const CSS_VAR_NAME_GAP_HORIZONTAL = `--${DOM_BASE_NAME}-${CSS_VAR_SCROLLBAR_SUFFIX}-horizontal`;

const CSS_VAR_ROUNDED_SUFFIX = 'round';

// css variables value unit of measurement
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
    // ensuring style tag dom presence, StyleSheet API throws otherwise
    if (!head.contains(styler)) {
        head.appendChild(styler);
    }

    // ensuring data attr based unique selector
    if (!element?.matches(`[${DATA_ATTR_NAME}]`)) {
        element?.setAttribute(DATA_ATTR_NAME, Date.now());
    }

    // only rule
    const index = 0;

    //
    const sheet = styler?.sheet ?? {};

    // clean up past rules
    if (sheet?.cssRules?.[index]) {
        sheet?.deleteRule(index);
    }

    // composes updated css variables rule
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

    // sets new rule up
    sheet?.insertRule(rule, index);

    //
    return styler;
};

/**
 * Deletes a given scrollable element (associated) styler
 * @param {HTMLElement} element The given scrollable element whose styler needs to be deleted
 * @returns {HTMLStyleElement} Styler element
 */
export const unsetStyles = (element, styler) => {
    styler?.remove();

    element?.removeAttribute(DATA_ATTR_NAME);

    return styler;
};
