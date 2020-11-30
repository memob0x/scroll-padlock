import {
    isValidScrollPosition,
    getSavedScrollPosition
} from "./scroll.mjs";
import { capitalize } from "./utils.mjs";
import { head, html, body } from "./client.mjs";

const getBoundingProp = (element, prop) => element?.getBoundingClientRect()?.[prop] ?? 0;

const getScrollProp = (element, prop) => element?.[`scroll${capitalize(prop)}`] ?? 0;

const getProp = (element, prop) => element === html || element === body ? getBoundingProp(element, prop) : getScrollProp(element, prop);

const getWidth = element => getProp(element, 'width');

const getHeight = element => getProp(element, 'height');

/**
 * Gets the current vertical scrollbar width size in px unit
 * @public
 * @returns {Object} The current vertical scrollbar width and the horizontal scrollbar height in px
 */
export const getScrollbarsGaps = element => {
    const styles = element?.style ?? {};

    // NOTE: right now this is the safest and more robust way to detect the real document scrollbar size (compatible with iOS pinch to zoom)
    // bodyscroll is gonna change overflow property anyway, so we keep this not 100% clean approach for now

    styles.overflow = "";

    // clears possible body scroll lock state css strategies
    const wasLocked = removeLockedCssClass(element);

    // caches current element sizes
    // NOTE: right now only getBoundingClientRect grant sub pixel measures, repaint would have been done anyway so...
    const width = getWidth(element);
    const height = getHeight(element);
    
    // sets overflow property to hidden
    styles.overflowY = "hidden";
    
    // gets the actual scrollbar width comparing the cached element width to the current one with overflow hidden on
    const vertical = getWidth(element) - width;

    //
    styles.overflowY = "";

    //
    styles.overflowX = "hidden";

    const horizontal = getHeight(element) - height;

    // cleans everything up
    styles.overflowX = "";

    // possibly re applies body scroll lock state css strategies
    if (wasLocked) {
        addLockedCssClass(element);
    }

    // returns the vertical scrollbar width and horizontal scrollbar height
    return { vertical, horizontal };
};

//
const stylers = new WeakMap();

//
export const cssVarNamePositionTop = "--scroll-padlock-top-rect";
export const cssVarNamePositionLeft = "--scroll-padlock-left-rect";
export const cssVarNameGapVertical = "--scroll-padlock-vertical-scrollbar-gap";
export const cssVarNameGapHorizontal = "--scroll-padlock-horizontal-scrollbar-gap";

const dataAttrName = 'data-scroll-padlock';

/**
 * 
 * @param element 
 */
export const clearStyle = element => {
    stylers.get(element)?.remove();

    stylers.delete(element);

    element.removeAttribute(dataAttrName);
};

/**
 * Updates css variables to the current state
 * @public
 * @returns {void} Nothing
 */
export const updateCssVariables = element => {
    // ensuring style tag reference existance
    if (!stylers.has(element)) {
        stylers.set(element, document.createElement('style'));
    }

    // getting style tag reference
    const styler = stylers.get(element);

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
    const scrollPosition = isValidScrollPosition(scrollSaving)
        ? scrollSaving
        : { top: 0, left: 0 };

    // composes updated css variables rule
    const rule = `[${dataAttrName}="${element?.getAttribute(dataAttrName)}"] {
        ${cssVarNamePositionTop}: ${scrollPosition.top * -1}px;
        ${cssVarNamePositionLeft}: ${scrollPosition.left * -1}px;

        ${cssVarNameGapVertical}: ${scrollbarsGaps.vertical}px;
        ${cssVarNameGapHorizontal}: ${scrollbarsGaps.horizontal}px;
        
        ${cssVarNameGapVertical}-round: ${Math.round(scrollbarsGaps.vertical)}px;
        ${cssVarNameGapHorizontal}-round: ${Math.round(scrollbarsGaps.horizontal)}px;
    }`;

    // sets new rule up
    styler.sheet.insertRule(rule, index);
};

//
export const cssClassBase = `scroll-padlock`;

//
export const cssClassLocked = `${cssClassBase}--locked`;

/**
 * Toggles a given css class to a given element
 * @param {HTMLElement} element
 * @param {String} className
 * @param {Boolean} bool Whether the class should be added ro removed
 * @returns {Boolean} Whether the removal or the
 */
const toggleCssClass = (element, className, bool) => {
    const hadClass = !!element?.classList?.contains(className);

    bool = bool ?? !hadClass;

    element?.classList?.toggle(className, bool);

    return (bool && !hadClass) || (!bool && hadClass);
};

/**
 * 
 * @param {HTMLElement} element
 * @returns {Boolean}
 */
export const addLockedCssClass = element => toggleCssClass(element, cssClassLocked, true);

/**
 * 
 * @param {HTMLElement} element
 * @returns {Boolean}
 */
export const removeLockedCssClass = element => toggleCssClass(element, cssClassLocked, false);

/**
 * 
 * @param {HTMLElement} element
 * @returns {Boolean}
 */
export const addBaseCssClass = element => toggleCssClass(element, cssClassBase, true);

/**
 * 
 * @param {HTMLElement} element
 * @returns {Boolean}
 */
export const removeBaseCssClass = element => toggleCssClass(element, cssClassBase, false);
