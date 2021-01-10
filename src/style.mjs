import { head } from './client.mjs';

// dom naming part (prefix, suffix etc...)
const domBaseName = 'scroll-padlock';

// css variables suffixes
const cssVarRoundedSuffix = 'round';
const cssVarRectSuffix = 'rect';
const cssVarScrollbarSuffix = 'scrollbar-gap';

// css variables names
export const cssVarNamePositionTop = `--${domBaseName}-top-${cssVarRectSuffix}`;
export const cssVarNamePositionLeft = `--${domBaseName}-left-${cssVarRectSuffix}`;
export const cssVarNameGapVertical = `--${domBaseName}-vertical-${cssVarScrollbarSuffix}`;
export const cssVarNameGapHorizontal = `--${domBaseName}-horizontal-${cssVarScrollbarSuffix}`;

// css variables value unit of measurement
const cssVarUnitValue = 'px';

// data attribute name
const dataAttrName = `data-${domBaseName}`;

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
    if (!element?.matches(`[${dataAttrName}]`)) {
        element?.setAttribute(dataAttrName, Date.now());
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
    const rule = `[${dataAttrName}="${element?.getAttribute(dataAttrName)}"] {
        ${cssVarNamePositionTop}: ${scroll.top * -1}${cssVarUnitValue};
        ${cssVarNamePositionLeft}: ${scroll.left * -1}${cssVarUnitValue};
        ${cssVarNameGapVertical}: ${scrollbar.vertical}${cssVarUnitValue};
        ${cssVarNameGapHorizontal}: ${scrollbar.horizontal}${cssVarUnitValue};
        
        ${cssVarNameGapVertical}-${cssVarRoundedSuffix}: ${Math.round(scrollbar.vertical)}${cssVarUnitValue};
        ${cssVarNameGapHorizontal}-${cssVarRoundedSuffix}: ${Math.round(scrollbar.horizontal)}${cssVarUnitValue};
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

    element?.removeAttribute(dataAttrName);

    return styler;
};
