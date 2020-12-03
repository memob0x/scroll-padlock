import { head, html, body } from "./client.mjs";

import { capitalizeWord } from "./utils.mjs";

import { isValidScrollPosition, getSavedScrollPosition } from "./scroll.mjs";

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

// base css class name (initialization)
export const cssClassBase = domBaseName;

// css class name on locked state
export const cssClassLocked = `${cssClassBase}--locked`;

// scrollbar gap detection css overflow states
const cssOverflowUnset = '';
const cssOverflowHidden = 'hidden';

// stylers closure
// a weakmap is used in order to keep every styler associated with the scrollable element itself
const stylers = new WeakMap();

// TODO: make jsdocs more clear

/**
 * Gets a the value for a given property name of a given element bounding client rect
 * @param {HTMLElement} element The given elemetn
 * @param {String} prop The given property name
 * @returns {Number} THe property value
 */
const getBoundingClientRectProp = (element, prop) => element?.getBoundingClientRect()?.[prop] ?? 0;

/**
 * Gets the value for a given scroll-property-value (scrollWidth, scrollHeight) of a given element
 * @param {HTMLElement} element The given elemetn
 * @param {String} prop The given property name
 * @returns {Number} THe property value
 */
const getScrollProp = (element, prop) => element?.[`scroll${capitalizeWord(prop)}`] ?? 0;

/**
 * Gets the value for a given property name of a given element
 * @param {HTMLElement} element The given element
 * @param {String} prop The given property name
 * @returns {Number} THe property value
 */
const getProp = (element, prop) => element === html || element === body ? getBoundingClientRectProp(element, prop) : getScrollProp(element, prop);

/**
 * Gets a given element width (without scrollbar)
 * @param {HTMLElement} element The given element whose width needs to be retrieved
 * @returns {Number} The given element scroll-width
 */
// TODO: provide unit test
const getWidth = element => getProp(element, 'width');

/**
 * Gets a given element height (without scrollbar)
 * @param {HTMLElement} element The given element whose height needs to be retrieved
 * @returns {Number} The given element scroll-height
 */
// TODO: provide unit test
const getHeight = element => getProp(element, 'height');

/**
 * Gets a given element current vertical scrollbar width size in px unit
 * @param {HTMLElement} element The given element whose scrollbar gaps need to be retrieved
 * @returns {Object} The current vertical scrollbar width and the horizontal scrollbar height in px
 */
// NOTE: right now this is the safest and more robust way to detect the scrollbar size (which is also compatible with iOS pinch to zoom)
// overflow property is going to change anyway, so this not-100%-clean approach (debatably) is kept for now
export const getScrollbarsGaps = element => {
    const styles = element?.style ?? {};

    // clears all overflow-related inline styles (just in case...)
    styles.overflow = styles.overflowX = styles.overflowY = cssOverflowUnset;

    // clears possible body scroll lock state css strategies
    const wasLocked = removeLockedCssClass(element);

    // caches current element sizes
    // NOTE: right now only getBoundingClientRect grant sub pixel measures, repaint would have been done anyway so...
    const width = getWidth(element);
    const height = getHeight(element);

    // horizontal scrollbar

    // hides horizontal scrollbar
    styles.overflowX = cssOverflowHidden;

    // gets horizontal scrollbar gap size (height with possible scrollbar - height without scrollbar)
    const horizontal = getHeight(element) - height;

    // clears horizontal scrollbar (previously set) hiding property value
    styles.overflowX = cssOverflowUnset;
    
    // vertical scrollbar

    // hides vertical scrollbar
    styles.overflow = cssOverflowHidden;
    
    // gets vertical scrollbar gap size (width with possible scrollbar - width without scrollbar)
    const vertical = getWidth(element) - width;

    // clears vertical scrollbar (previously set) hiding property value
    styles.overflow = cssOverflowUnset;

    // possibly re applies body scroll lock state css strategies
    if (wasLocked) {
        addLockedCssClass(element);
    }

    // returns the vertical and horizontal scrollbar gaps as an object
    return { vertical, horizontal };
};

/**
 * Gets the given scrollable element (associated) styler
 * @param {HTMLElement} element The given scrollable element whose styler needs to be deleted
 * @returns {HTMLStyleElement|null} Styler element, null if not inserted to head
 */
export const getStyler = element => stylers.get(element) ?? null;

/**
 * Deletes a given scrollable element (associated) styler
 * @param {HTMLElement} element The given scrollable element whose styler needs to be deleted
 * @returns {HTMLStyleElement|null} Styler element, null if not inserted to head
 */
export const clearStyle = element => {
    const styler = getStyler(element);

    styler?.remove();

    stylers.delete(element);

    element.removeAttribute(dataAttrName);

    return styler;
};

/**
 * Updates a given element css variables to the current state
 * @param {HTMLElement} element The given element whose css variables need to be updated
 * @returns {HTMLStyleElement} Styler element
 */
export const updateCssVariables = element => {
    // ensuring style tag reference existance
    if (!stylers.has(element)) {
        stylers.set(element, document.createElement('style'));
    }

    // getting style tag reference
    const styler = getStyler(element);

    // ensuring style tag dom presence, StyleSheet API throws otherwise
    if (!head.contains(styler)) {
        head.append(styler);
    }

    // ensuring data attr based unique selector
    if (!element?.matches(`[${dataAttrName}]`)) {
        element?.setAttribute(dataAttrName, Date.now());
    }

    // only rule
    const index = 0;

    // clean up past rules
    if (styler.sheet.cssRules[index]) {
        styler.sheet.deleteRule(index);
    }

    // calculating scrollbar gap
    const scrollbarsGaps = getScrollbarsGaps(element);
    // gets the current scroll position object saving or default
    const scrollSaving = getSavedScrollPosition(element);
    const scrollPosition = isValidScrollPosition(scrollSaving) ? scrollSaving : { top: 0, left: 0 };

    // composes updated css variables rule
    const rule = `[${dataAttrName}="${element?.getAttribute(dataAttrName)}"] {
        ${cssVarNamePositionTop}: ${scrollPosition.top * -1}${cssVarUnitValue};
        ${cssVarNamePositionLeft}: ${scrollPosition.left * -1}${cssVarUnitValue};

        ${cssVarNameGapVertical}: ${scrollbarsGaps.vertical}${cssVarUnitValue};
        ${cssVarNameGapHorizontal}: ${scrollbarsGaps.horizontal}${cssVarUnitValue};
        
        ${cssVarNameGapVertical}-${cssVarRoundedSuffix}: ${Math.round(scrollbarsGaps.vertical)}${cssVarUnitValue};
        ${cssVarNameGapHorizontal}-${cssVarRoundedSuffix}: ${Math.round(scrollbarsGaps.horizontal)}${cssVarUnitValue};
    }`;

    // sets new rule up
    styler.sheet.insertRule(rule, index);

    return styler;
};

/**
 * Toggles a given css class on a given element
 * @param {HTMLElement} element The element whose css class needs to be toggled
 * @param {String} className The css class to be toggled
 * @param {Boolean} bool Whether the class should be added ro removed
 * @returns {Boolean} Whether the toggle (or the force removal, or the force add) has been successful
 */
export const toggleCssClass = (element, className, bool) => {
    const hadClass = !!element?.classList?.contains(className);

    bool = bool ?? !hadClass;

    element?.classList?.toggle(className, bool);

    return (bool && !hadClass) || (!bool && hadClass);
};

/**
 * Syntactic sugar, adds a locked stase css class to a given element
 * @param {HTMLElement} element The given element
 * @returns {Boolean} Whether the css class has been given successfully or not
 */
export const addLockedCssClass = element => toggleCssClass(element, cssClassLocked, true);

/**
 * Syntactic sugar, removes a locked stase css class to a given element
 * @param {HTMLElement} element The given element
 * @returns {Boolean} Whether the css class has been removed successfully or not
 */
export const removeLockedCssClass = element => toggleCssClass(element, cssClassLocked, false);

/**
 * Syntactic sugar, removes a base (initialization) stase css class to a given element
 * @param {HTMLElement} element The given element
 * @returns {Boolean} Whether the css class has been removed successfully or not
 */
export const addBaseCssClass = element => toggleCssClass(element, cssClassBase, true);

/**
 * Syntactic sugar, removes a base (initialization) stase css class to a given element
 * @param {HTMLElement} element The given element
 * @returns {Boolean} Whether the css class has been removed successfully or not
 */
export const removeBaseCssClass = element => toggleCssClass(element, cssClassBase, false);
